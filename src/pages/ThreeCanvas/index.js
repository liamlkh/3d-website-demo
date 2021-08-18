import React, { useEffect, useRef, useCallback, Suspense } from 'react'
import * as THREE from 'three'
import store from '@/store'
import { useSelector } from 'react-redux'
import { isMobile } from "react-device-detect"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls } from '@react-three/drei'
import { Physics, usePlane } from "@react-three/cannon"

import {
  CanvasWrapper
} from './styles'

import Effects from './Effects'
import MouseObject from '@/components/MouseObject'
import SectionObject from '@/components/SectionObject'
import Cube from '@/components/Cube'

const LOCATION_DATA = {
  'home': {
    pos: [0, 0, 0],
    color: '#1d4f3d',
    cameraPos: null,
    cameraRot: [-Math.PI * 0.2, 0, 0]
  },
  'Section1': {
    pos: [-15, 0, -8],
    rot: [0, Math.PI * 0.15, 0],
    color: '#4f1d36',
    cameraPos: new THREE.Vector3(-8, 11.6, 1.7),
    cameraRot: [-0.638, 0.1235, 0.0911]
  },
  'Section2': {
    pos: [30, 0, -20],
    rot: [0, -Math.PI * 0.3, 0],
    color: '#1d3a4f',
    cameraPos: new THREE.Vector3(20.8, 12.7, -6.8),
    cameraRot: [-0.7086, -0.0864, -0.074]
  },
  'Section3': {
    pos: [-14, 0, 20],
    rot: [0, -Math.PI * 0.1, 0],
    color: '#4f441d',
    cameraPos: new THREE.Vector3(-6.5, 9.0, 31.0),
    cameraRot: [-0.617, 0.013, 0.009]
  },
  'Section4': {
    pos: [27, 0, 17],
    rot: [0, Math.PI * 0.003, 0],
    color: '#4f1d21',
    cameraPos: new THREE.Vector3(25, 12.0, 29.4),
    cameraRot: [-0.667, 0.222, 0.172]
  },
}

const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()

const Ground = ({ groundRef, locationDataRef }) => {

  const materialRef = useRef()
  const [planeRef] = usePlane(() => ({ mass: 0, rotation: [-Math.PI / 2, 0, 0], position: [0, 0, 0] }))

  useFrame(() => {
    let color = new THREE.Color(locationDataRef.current.color)
    materialRef.current.color.lerp(color, 0.05)
  })

  return (
    <>
      <mesh ref={groundRef} position={[0, -0.1, 0]}>
        <cylinderBufferGeometry args={[65, 65, 0.1, 64]} />
        <meshStandardMaterial attach="material" opacity={0} />
      </mesh>
      <mesh ref={planeRef} receiveShadow>
        <planeBufferGeometry attach="geometry" args={[450, 450]} />
        <meshStandardMaterial ref={materialRef} attach="material" color={'#012a36'} />
      </mesh>
    </>
  )
}

const UpdateCamera = ({ locationDataRef }) => {

  const { camera } = useThree()

  useFrame(() => {
    if (locationDataRef.current.cameraPos)
      camera.position.lerp(locationDataRef.current.cameraPos, 0.03)

    const quaternion = new THREE.Quaternion()
    quaternion.setFromEuler(new THREE.Euler(locationDataRef.current.cameraRot[0], locationDataRef.current.cameraRot[1], locationDataRef.current.cameraRot[2]))
    camera.quaternion.slerp(quaternion, 0.05)
  })

  return null
}

const ThreeCanvas = () => {

  const location = useSelector(state => state.location.current)

  const canvasRef = useRef()
  const groundRef = useRef()
  const mouseObjectRef = useRef()
  const cameraRef = useRef()

  const locationDataRef = useRef(LOCATION_DATA['home'])
  const keyRef = useRef({})

  const preventDefault = useCallback((e) => { e.preventDefault() }, [])
  useEffect(() => {
    canvasRef.current.addEventListener('touchmove',preventDefault, { passive: false })
  }, [])

  const updateMousePosition = useCallback(e => {
    if (cameraRef.current && groundRef.current) {
      mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1
      mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1

      raycaster.setFromCamera(mouse, cameraRef.current)
      const intersects = raycaster.intersectObject(groundRef.current)

      if (intersects.length > 0) {
        const target = intersects[0].point
        target.z += 5

        mouseObjectRef.current && mouseObjectRef.current.goTo(target)
      }
    }
  }, [])

  const onKeyDown = useCallback(e => {
    keyRef.current[e.key] = true
  }, [])

  const onKeyUp = useCallback(e => {
    delete keyRef.current[e.key]
  }, [])

  const onMouseDown = (e) => {
    updateMousePosition(e)
    canvasRef.current.addEventListener("mousemove", updateMousePosition)
  }

  const onMouseUp = () => {
    canvasRef.current.removeEventListener("mousemove", updateMousePosition)
  }

  const onTouchMove = (e) => {
    updateMousePosition(e.targetTouches[0])
  }

  const onTouchStart = (e) => {
    updateMousePosition(e.targetTouches[0])
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
  }, [location])

  useEffect(() => {
    locationDataRef.current = LOCATION_DATA[location]
    const pos = locationDataRef.current.pos
    mouseObjectRef.current && mouseObjectRef.current.goTo(new THREE.Vector3().fromArray(pos), location)
  }, [location])

  const goToLocation = (location) => {
    store.dispatch({ type: 'SET_LOCATION', location: location })
  }

  return (
    <CanvasWrapper 
      ref={canvasRef}
      onMouseDown={isMobile ? null : onMouseDown} 
      onMouseUp={isMobile ? null : onMouseUp}
      onTouchMove={isMobile ? onTouchMove : null}
      onTouchStart={isMobile ? onTouchStart : null}
    >
      <Canvas 
        shadows
        camera={{ position: [0, 13, 15], fov: 60 }} 
        onCreated={({ camera }) => {
          cameraRef.current = camera
          camera.rotation.set(-Math.PI * 0.2, 0, 0)
        }}
      >
        <UpdateCamera locationDataRef={locationDataRef}/>
        <color attach="background" args={['white']} />
        <ambientLight intensity={1} />
        <spotLight 
          intensity={0.6} 
          position={[0, 150, 0]} 
          angle={0.6} 
          penumbra={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Suspense fallback={null}>
          <Physics gravity={[0, -10, 0]}>
            <Ground groundRef={groundRef} locationDataRef={locationDataRef}/>
            <MouseObject ref={mouseObjectRef} keyRef={keyRef} currentLocation={location} goToLocation={goToLocation} />
            <group name="routes">
              {Object.entries(LOCATION_DATA).slice(1).map(([location, { pos, rot } ])=> {
                return <SectionObject position={pos} rotation={rot} name={location} />
              })}
            </group>
            {/* <Box position={[-15, 0, 10]} rotation={[0, -Math.PI * 0.2, 0]}/> */}
            {/* <Box position={[20, 0, 20]} /> */}
          </Physics>
        </Suspense>
        <Effects/>
        {/* <OrbitControls/> */}
      </Canvas>
    </CanvasWrapper>
  )
}

export default ThreeCanvas
