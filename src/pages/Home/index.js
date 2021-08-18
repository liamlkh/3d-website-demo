import React from 'react'
import { useSelector } from 'react-redux'

import {
  Container
} from './styles'

import ThreeCanvas from '@/pages/ThreeCanvas'
import Menu from '@/components/Menu'
import Dots from '@/components/Dots'
import Content from '@/pages/Content'

export default function Home() {

  const location = useSelector(state => state.location.current)

  return (
    <Container>
      <ThreeCanvas/>
      <Dots/>
      {location == 'Section1' && <Content heading='Section 1' isRight />}
      {location == 'Section2' && <Content heading='Section 2' />}
      {location == 'Section3' && <Content heading='Section 3' isRight />}
      {location == 'Section4' && <Content heading='Section 4' />}
      <Menu/>
    </Container>
  )
}

