import React, { useState, useMemo, useRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useBox } from "@react-three/cannon"
import { isMobileOnly } from 'react-device-detect';

const Y_POS = 6
const LERP_SPEED = isMobileOnly ? 0.06 : 0.03

const MouseObject = React.forwardRef( (props, ref) => {

  const { keyRef, goToLocation } = props
  const { camera, scene } = useThree()
  const meshRef = useRef()
  const tiltRef = useRef()
  const targetRef = useRef(new THREE.Vector3(0, 0, 0))
  const [location, setLocation] = useState('home')
  const [isMoving, setIsMoving] = useState(false)
  const [isKeyPressed, setIsKeyPressed] = useState(false)

  useImperativeHandle( ref, () => ({
    goTo: (target, location) => {
      if (location) {
        setLocation(location)
        setIsMoving(true)
      }
      setIsKeyPressed(false)
      targetRef.current = target
    },
  }) )

  const [colliderRef, collider] = useBox(() => ({ 
    // mass: 1, 
    isKinematic: true,
    args: [5.5, 2, 4], 
    position: [0, Y_POS, 0], 
    // onCollide: (e) => {}
  }))

  const object = useGLTF(require('@/assets/glb/paper-plane.glb').default)
  useMemo(() => {
    Object.values(object.nodes).forEach(obj => {
      obj.isMesh && Object.assign(obj, { castShadow: true })
    })
  }, [object.nodes])

  const checkIntersect = (mesh1, meshes) => {
    for (const mesh2 of meshes) {
      const box1 = new THREE.Box3().setFromObject(mesh1);
      const box2 = new THREE.Box3().setFromObject(mesh2)
      if (box2.containsBox(box1))
        return mesh2.name
    }
    return null
  }

  let quaternion = new THREE.Quaternion()
  useFrame(() => {

    // key pressed
    if (Object.keys(keyRef.current).length > 0)
      setIsKeyPressed(true)
    if (keyRef.current['ArrowUp'] || keyRef.current['ArrowDown'] ) {
      const direction = new THREE.Vector3()
      meshRef.current.getWorldDirection(direction)
      targetRef.current.copy(meshRef.current.position)
      targetRef.current.add(direction.multiplyScalar(keyRef.current['ArrowUp'] ? 10 : -10))
    }
    if (keyRef.current['ArrowRight']) {
      meshRef.current.rotateY(-0.05)
    }
    if (keyRef.current['ArrowLeft']) {
      meshRef.current.rotateY(0.05)
    }

    // move
    targetRef.current.x = Math.max(-50, Math.min(targetRef.current.x, 50))
    targetRef.current.z = Math.max(-50, Math.min(targetRef.current.z, 50))
    targetRef.current.y = 0 
    meshRef.current.position.lerp(targetRef.current, LERP_SPEED) 

    // rotate
    if (!isKeyPressed) {
      const rotationY = Math.atan2( (targetRef.current.x - meshRef.current.position.x), (targetRef.current.z - (meshRef.current.position.z) ) )
      quaternion.setFromEuler(new THREE.Euler(0, rotationY, 0))
      meshRef.current.quaternion.slerp(quaternion, 0.05)
    }

    // update collider
    collider.position.set(meshRef.current.position.x, Y_POS, meshRef.current.position.z)
    collider.rotation.set(meshRef.current.rotation.x, meshRef.current.rotation.y, meshRef.current.rotation.z)

    // update camera
    if (location == 'home')
      camera.position.lerp({ x: targetRef.current.x, y: 13, z: targetRef.current.z + 15 }, LERP_SPEED)

    // check intersect
    const dist = meshRef.current.position.distanceTo(targetRef.current)
    if (dist > 1 && !isMoving) {    
      const routeObjects = scene.getObjectByName('routes').children.map(x => x.children[0])
      const intersect = checkIntersect(colliderRef.current, routeObjects)
      if (intersect && location == 'home') {
        goToLocation(intersect)
      }
      if (intersect == null && location != 'home') {
        goToLocation('home')
      } 
    }
    if (dist < 6) {
      setIsMoving(false)
    }

    // tilt
    const tilt = Math.PI * (-0.08 + dist / 10 * 0.08) 
    quaternion.setFromEuler(new THREE.Euler(tilt, 0, 0))
    tiltRef.current.quaternion.slerp(quaternion, 0.07)  
  })

  return (
    <>
      <mesh ref={colliderRef} name="mouseObject" layers={1}> 
        <boxGeometry args={[5, 2, 5.5]}/>
        <meshBasicMaterial color='red' transparent opacity={0}/>
      </mesh>
      <group ref={meshRef} rotation={[0, Math.PI, 0]}>
        <group position={[0, Y_POS, 0]} rotation={[0, Math.PI, 0]} scale={2.5}>
          <group ref={tiltRef}>
            <primitive object={object.scene} dispose={null} />
          </group>
        </group>
      </group>
    </>
  )

})

export default MouseObject


