import React, { useEffect, useRef } from 'react'
import { useThree, useFrame, extend } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

extend({ EffectComposer, RenderPass, ShaderPass, BokehPass })

const Effects = () => {

  const { gl, scene, camera, size } = useThree()
  const composer = useRef()

  useEffect(() => {
    composer.current.setSize(size.width, size.height)
  }, [size])

  useFrame(() => {
    composer.current.render()
  }, 1)

  return (
    <effectComposer ref={composer} args={[gl]}>  
      <renderPass attachArray="passes" args={[scene, camera]} /> 
      <shaderPass attachArray="passes" args={[GammaCorrectionShader]} /> 
      <shaderPass attachArray="passes" args={[FXAAShader]} material-uniforms-resolution-value={[1 / size.width, 1 / size.height]} />
      <bokehPass attachArray="passes" args={[scene, camera,  { focus: 18, aperture: 0.0003, maxblur: 0.01, width: size.width, height: size.height }]} />
    </effectComposer>
  )
}

export default Effects

