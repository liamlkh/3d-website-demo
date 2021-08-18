import React from 'react'
import store from '@/store'

import {
  ContentContainer,
  ContentInner,
  BackButton
} from './styles'

export default function Content({ heading, isRight }) {

  const onClick = () => {
    store.dispatch({ type: 'SET_LOCATION', location: 'home' })
  }

  return (
    <ContentContainer
      style={isRight ? { right: 0 } : { left: 0 }}
    >
      <ContentInner>
        <BackButton onClick={onClick}>
          {'< back'}
        </BackButton>
        <h2>
          {heading}
        </h2>
        <p>
          This is a paragraph.
        </p>
        <p>
          This is another paragraph. These are some texts. These are some texts. These are some texts. These are some texts. These are some texts. These are some texts. These are some texts. These are some texts.
          <br/>
          This is a new line.
        </p>
        <p>
          This is another paragraph. These are some texts. These are some texts. These are some texts. These are some texts. These are some texts. These are some texts. These are some texts. These are some texts.
          <br/>
          This is a new line.
        </p>
        <p>
          This is the last paragraph.
          <br/>
          This is a new line.
        </p>
      </ContentInner>
    </ContentContainer>
  )
}

