import styled from 'styled-components'

export const ContentContainer = styled.div`
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  animation: fadeIn 0.5s;
  pointer-events: none;
  padding: 8% 7% 0 10%;

  @media (max-width: 425px) { 
    width: 100%;
  }
`

export const ContentInner = styled.div`
  width: 100%;
  max-height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  pointer-events: auto;

  h2 {
    font-family: 'Source Serif Pro', serif;
    font-size: 2.8125em;
    line-height: 1.11111111em;
  }
  p {
    font-family: source sans pro,helvetica,arial,sans-serif;
  }
`

export const BackButton = styled.div`
  cursor: pointer;
  margin-bottom: 0.7em;
  pointer-events: auto;
`

