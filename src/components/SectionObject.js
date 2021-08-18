import React, { useMemo, useEffect, useRef } from 'react'
import * as THREE from 'three'

const loader = new THREE.FontLoader()

export default function SectionObject(props) {
  const { name } = props

  const font = loader.parse(require('@/assets/fonts/Roboto_Bold.json'))
  const config = useMemo(() => ({ font, size: 3, height: 1 }), [font])
  const textRef = useRef()

  useEffect(() => {
    textRef.current.geometry.computeBoundingBox()
    const offset = (textRef.current.geometry.boundingBox.max.x - textRef.current.geometry.boundingBox.min.x) * 0.5
    textRef.current.position.x -= offset
  }, [])

  return (
    <group {...props} >
      <mesh name={name} position={0, 8, 0} layers={1} >
        <boxGeometry args={[20, 16, 16]}/>
        <meshBasicMaterial color='blue' transparent opacity={0}/>
      </mesh>
      <mesh ref={textRef} position={[0, 2, 0]} castShadow>
        <textGeometry args={[name, config]} />
        <meshPhysicalMaterial color='white' />
      </mesh>
    </group>
  )
}
