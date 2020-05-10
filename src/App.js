// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//
// export default App;

import React from "react";
import { createGlobalStyle } from "styled-components";
import { reset } from "react95";
import DesktopApp from 'scripts/app/desktop';
import { MainConfigContext, default as MainConfig }  from 'scripts/app/config/main';

const ResetStyles = createGlobalStyle`
  ${reset}
`;

const FullScreenStyle = {
  position: 'absolute',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
};

export default props =>
  <div className="App" style={FullScreenStyle}>
    <ResetStyles />
    <MainConfigContext.Provider value={MainConfig}>
      <DesktopApp />
    </MainConfigContext.Provider>
  </div>
