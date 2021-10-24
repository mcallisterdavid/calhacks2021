import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame} from '@react-three/fiber'
import { OrbitControls, ScrollControls, Stars, Text, PerspectiveCamera, Html} from "@react-three/drei"
import jsonFile from './tsne800Dataset.json'

function Box(props) {
  // This reference will give us direct access to the mesh
  const ref = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const [trig, setTrig] = useState(0)
  const [annotationVisible, setAnnotationVisible] = useState(false)
  var total = 0
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    
    if (ref.current.name && ref.current.name == "Shaylan") {
      ref.current.rotation.x = ref.current.rotation.y += 0.02
      // ref.current.scale.x -= 0.01
    }

  })


  let songClicked=()=>{
    setActive(!active)
    if (ref.current.name) {
      console.log(ref.current.name)
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
          hovered ? <div className="content">{ref.current.name}</div> : null
        }
        
      </Html>
    </mesh>
  )
}


function randomG(v){ 
  var r = 0;
  for(var i = v; i > 0; i --){
      r += Math.random();
  }
  return r / v;
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


function ReadTSNE() {
  console.log(jsonFile)
  let keys = Object.keys(jsonFile)
  let boxes = []
  for (let i = 0; i < keys.length; i++) {
    let track_id = keys[i]
    let x = jsonFile[track_id]['tsne-one']
    let y = jsonFile[track_id]['tsne-two']
    let z = jsonFile[track_id]['tsne-three']
    // boxes.push(<SongLabel label={track_id} x={x} y={y} z={z} />)
    boxes.push(<Box key={i} name={jsonFile[track_id]['track_name']} position={[x, y, z]} />)
  }
  
  // console.log(boxes)
  return boxes
}

var clock = 0.0
var pauseFlag = false
var lastPress = 0.0
var cameraX = 0
var cameraY = 0
var cameraZ = 0
var speed = 25

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
    state.camera.fov = 60 - Math.sin(clock / 4) * 25
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

export default function App() {


  // let interval=()=>{
  //   clock += 1
  //   // console.log(clock)
  // }

  // useEffect(() => {
  //   let intervalID = setInterval(interval, 10)
  //   return ()=>clearInterval(intervalID)

  // }, [])
  return (
    <Canvas>
      {/* <OrbitControls />
      <ScrollControls /> */}

      {/* <Text
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
      >
        hello world!
      </Text> */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      {/* <Box position={[0, 0, 0]} name="Shaylan" /> */}
      {/* <Cloud /> */}
      <ReadTSNE />
      <Dolly />
      {/* <SongLabel label="DONKEY" x={0} y={0} z={0} /> */}
    </Canvas>
  )
}
