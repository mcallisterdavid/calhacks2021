import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useThree} from '@react-three/fiber'
import { OrbitControls, ScrollControls, Stars, Text, PerspectiveCamera, Html} from "@react-three/drei"
import jsonFile from './tsne800Dataset.json'
import './Visualization.css'
import WebPlayback from './WebPlayback';

function Box(props) {
  // This reference will give us direct access to the mesh
  const ref = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const [trig, setTrig] = useState(0)
  const [annotationVisible, setAnnotationVisible] = useState(false)
  var vis = false

  var total = 0
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    let man_dist = (Math.abs(ref.current.position.x - cameraX) + Math.abs(ref.current.position.y - cameraY) + Math.abs(ref.current.position.z - cameraZ))
    vis = (man_dist < 10 && man_dist > 6)
    setAnnotationVisible(vis)
  })


  let songClicked=()=>{
    console.log(props.data)
    setActive(!active)
    if (ref.current.name) {
      props.setWindowData(props.data)
      setPlayback(props.token, props.track_id);
    }
  }
  
  let colors=()=>{
    let x = ref.current.position.x
    let y = ref.current.position.y
    let z = ref.current.position.z
    console.log("DONKEY")

    let r = Math.max(0, Math.min(parseInt(7 * x + 202), 255))
    let g = Math.max(0, Math.min(parseInt(5 * x + 161), 255))
    let b = Math.max(0, Math.min(parseInt(2 * x + 215), 255))
    

    return 'rgb(' + r + ', ' + g + ', ' + b + ')'
  }

  let annotationHidden=()=>{
    let x = ref.current.position.x
    let y = ref.current.position.y
    let z = ref.current.position.z

    let dx = Math.abs(x - cameraX)
    let dy = Math.abs(y - cameraY)
    let dz = Math.abs(z - cameraZ)
    let manhattan = dx + dy + dz
    console.log(manhattan)

    return (hovered || manhattan < 3) ? <div className="content">{ref.current.name}</div> : null
  }

  return (
    <mesh
      {...props}
      ref={ref}
      scale={hovered ? 1.3 : 1}
      onClick={songClicked}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <sphereGeometry args={[0.15, 28, 14]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'lightblue'} />
      <Html distanceFactor={10}>
        {
          (annotationVisible || hovered) ? <div className="content">{ref.current.name}</div> : null
        }
        
      </Html>
    </mesh>
  )
}

function SongLabel(props) {
  const ref = useRef()
  // Set up state for the hovered and active state
  
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    console.log(ref.current)
    


  })
  return (
    <Text
        color="black" // default
        anchorX={props.x}
        anchorY={props.y}
        anchorZ={props.z}
        ref={ref}
      >
        {props.label}
      </Text>
  )
}

function setPlayback(token, uri) {
  const body = JSON.stringify({
    uris: [`spotify:track:${uri}`],
    offset: {
      position: 0
    },
    position_ms: 0
  })
  console.log(body)
  console.log(JSON.parse(body))
  console.log(token)

    fetch("https://api.spotify.com/v1/me/player/play", {
    body: body,
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    method: "PUT"
  })
}

function randomG(v){ 
  var r = 0;
  for(var i = v; i > 0; i --){
      r += Math.random();
  }
  return r / v;
}


function ReadTSNE({ token, tsneData, setWindowData }) {
  console.log(tsneData)
  // tsneData = jsonFile
  let keys = Object.keys(tsneData)
  let boxes = []
  for (let i = 0; i < keys.length; i++) {
    let track_id = keys[i]
    let x = tsneData[track_id]['tsne-one']
    let y = tsneData[track_id]['tsne-two']
    let z = tsneData[track_id]['tsne-three']
    // boxes.push(<SongLabel label={track_id} x={x} y={y} z={z} />)
    boxes.push(<Box key={i} setWindowData={setWindowData} token={token} name={tsneData[track_id]['track_name']} track_id={track_id} data={tsneData[track_id]} position={[x, y, z]} />)
  }
  
  console.log(boxes)
  return boxes
}

var clock = 0.0
var pauseFlag = false
var lastPress = 0.0
var cameraX = 0
var cameraY = 0
var cameraZ = 0
var speed = 25
var zoom_i = 1
var zooms = [55, 60, 75, 90]
var zoom = 60


function Dolly() {
  useFrame((state) => {


    document.addEventListener('keypress', function(e) {

      if (state.clock.getElapsedTime() - lastPress > 0.3) {
        lastPress = state.clock.getElapsedTime()
        if (e.key == " ") {
          pauseFlag = !pauseFlag
          console.log("EVENT HEARD")
          console.log(state.clock.getElapsedTime() - lastPress)
        } else if (e.key == "s") {
          if (speed > 0) {
            speed -= 10
          } else {
            speed += 10
          }
          speed = Math.max(-205, speed)
        } else if (e.key == "f") {
          if (speed < 0) {
            speed -= 10
          } else {
            speed += 10
          }
          speed = Math.min(205, speed)
        } else if (e.key == "r") {
          speed *= -1
        } else if (e.key == "z") {
          zoom_i = (zoom_i + 1) % 4
          zoom = zooms[zoom_i]
        }
        console.log("SPEED: " + speed)
      }
    })

    if (!pauseFlag) {
      // console.log(clock)
      clock += state.clock.getDelta() * speed
    }

    // console.log(state) 
    // state.camera.position.z = 10 + Math.sin(state.clock.getElapsedTime() * 4) * 8
    state.camera.fov = zoom - Math.sin(clock / 4) * 25
    cameraY = Math.sin(clock / 8) * 8
    cameraX = Math.cos(clock / 8) * 8
    cameraZ = Math.sin(clock / 8) * 8
    state.camera.position.y = cameraY
    state.camera.position.x = cameraX
    state.camera.position.z = cameraZ
    // let point = new useThree.Vector3(0, 0, 0);
    state.camera.lookAt(0, 0, 0)
    state.camera.updateProjectionMatrix()
  })
  return null
}

function Cloud() {
  let boxes = []
  for (let i = 0; i < 50; i++) {

    let gauss_x = 20 * randomG(7) - 10
    let gauss_y = 20 * randomG(7) - 10
    let gauss_z = 20 * randomG(7) - 10

    

    // console.log(gauss_x)
    boxes.push(<Box key={i} name={i} position={[gauss_x, gauss_y, gauss_z]} />)
  }

  let avg_x = 0
  for(let i = 0; i < 50; i++) {
    let curr = boxes[i]
    // console.log(curr)
    // avg_x += curr.position.x
  }
  avg_x /= boxes.length
  // console.log(avg_x)

  return boxes  
}

function SongWindow({ url, data, token }) {
  console.log(data)
  return (
    <div className="spotify-window">
      <h4 style={{fontSize: "15px", fontFamily: '"Inter var", sans-serif', marginBottom: '0', color: "white"}}>{data.track_name} - {data.album}</h4>
      <h4 style={{fontSize: "15px", fontFamily: '"Inter var", sans-serif', marginBottom: '0', color: "white"}}>{data.artist}</h4>
      <WebPlayback token={token} />
    </div>
  )
}

export default function Visualization({ token, tsneData }) {
  const [windowData, setWindowData] = useState({})

  return (
    <>
    <SongWindow token={token} data={windowData} />
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <ReadTSNE token={token} tsneData={tsneData} setWindowData={setWindowData} />
      <Dolly />
    </Canvas>
    </>
  )
}
