import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
  * {
      margin: 0;
      padding: 0;
      outline: 0;
      box-sizing: border-box;
    }
    html, body, #root{
      height: 100%
    }
    body {
      background-color: #292929;
      -webkit-font-smoothing: antialiased;
      color: #fff;
      font-family: 'Roboto', sans-serif;
    }
    button {
      cursor: pointer;
    }

`;
