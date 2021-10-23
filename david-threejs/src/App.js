import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useThree} from '@react-three/fiber'
import { OrbitControls, ScrollControls, Stars, Text, PerspectiveCamera} from "@react-three/drei"
import jsonFile from './tsneLargeDataset.json'

function Box(props) {
  // This reference will give us direct access to the mesh
  const ref = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const [trig, setTrig] = useState(0)
  var total = 0
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    // ref.current.rotation.x = ref.current.rotation.y += 0.02
    // trig += 0.02
    // ref.current.position.y = Math.sin(trig)
    if (ref.current.name == "Shaylan") {
      ref.current.rotation.x = ref.current.rotation.y += 0.02
      // ref.current.scale.x -= 0.01
    }


    // console.log(ref)

    // if (ref.current.name && (typeof ref.current.name) == "number") {
    //   // console.log(ref.current.name)
    //   ref.current.rotation.x = ref.current.rotation.y += 0.02*ref.current.name
    // }

    // console.log(ref.current)

  })


  let songClicked=()=>{
    setActive(!active)
    if (ref.current.name) {
      console.log(ref.current.name)
    }
  }
  

  return (
    <mesh
      {...props}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={songClicked}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <sphereGeometry args={[0.15, 28, 14]} />
      <meshStandardMaterial color={hovered ? 'green' : 'red'} />
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


function ReadTSNE() {
  console.log(jsonFile)
  let keys = Object.keys(jsonFile['tsne-one'])
  let boxes = []
  for (let i = 0; i < keys.length; i++) {
    let track_id = keys[i]
    let x = jsonFile['tsne-one'][track_id]
    let y = jsonFile['tsne-two'][track_id]
    let z = jsonFile['tsne-three'][track_id]
    boxes.push(<Box key={i} name={track_id} position={[x, y, z]} />)
  }
  
  // console.log(boxes)
  return boxes
}

function Dolly() {
  useFrame((state) => {
    // state.camera.position.z = 10 + Math.sin(state.clock.getElapsedTime() * 4) * 8
    // state.camera.fov = 50 - Math.sin(state.clock.getElapsedTime() * 4) * 40
    state.camera.position.y = Math.sin(state.clock.getElapsedTime() / 8) * 8
    state.camera.position.x = Math.cos(state.clock.getElapsedTime() / 8) * 8
    state.camera.position.z = Math.sin(state.clock.getElapsedTime() / 8) * 8
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
  
  return (
    <Canvas>
      {/* <OrbitControls />
      <ScrollControls /> */}

      <Text
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
      >
        hello world!
      </Text>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Box position={[0, 0, 0]} name="Shaylan" />
      {/* <Cloud /> */}
      <ReadTSNE />
      <Dolly />
    </Canvas>
  )
}
