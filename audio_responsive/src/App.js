import React from 'react';
import AudioResponsiveCircle from './AudioResponsiveCircle';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cercle Réactif à l'Audio</h1>
        <AudioResponsiveCircle />
      </header>
    </div>
  );
}

export default App;