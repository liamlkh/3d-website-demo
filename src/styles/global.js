import { createGlobalStyle } from 'styled-components';

import colors from './colors';

const GlobalStyle = createGlobalStyle`
  /* Default */
  * {
    box-sizing: border-box;
    user-select: none;
    margin: 0;
    outline: 0;
    padding: 0;
  }
  body {
    background-color: ${colors.background};
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
  }
  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  body, input, textarea {
    font-family: 'Ubuntu', sans-serif !important;
  }
  a, button {
    outline: none;
  }
  h2 {
    margin-bottom: .5em;
  }
  p {
    margin-bottom: 1.5em;
  }

  canvas {
    user-select: none;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  
    to {
      opacity: 1;
    }
  }
`;

export default GlobalStyle;
