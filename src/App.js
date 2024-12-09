import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, ScrollControls } from '@react-three/drei';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import AuthPage from './components/AuthPage';
import Experience from './components/Experience';
import Dashboard from './pages/Dashboard';
import AuthProvider from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import './App.css'; // Asegúrate de importar el archivo CSS global
import './Canvas.css'; // Asegúrate de importar el archivo CSS global
import { Stats, OrbitControls } from '@react-three/drei'


const keyboardMap = [
  {name: "forward", keys:["ArrowUp", "KeyW"]},
  {name: "backward", keys:["ArrowDown", "KeyS"]},
  {name: "left", keys:["ArrowLeft", "KeyA"]},
  {name: "right", keys:["ArrowRight", "KeyD"]},
  {name: "run", keys:["Shift"]},

];


const CanvasWrapper = () => (
  <div className="fullscreen-canvas"> {/* Clase para ocupar toda la pantalla */}
  <KeyboardControls map={keyboardMap}>
    <Canvas camera={{ position: [0, 0.5, 5], fov: 42 }} style={{
      touchAction: "none",
    }}>
      <color attach="background" args={["#f5f3ee"]} />
      <fog attach="fog" args={["#f5f3ee", 10, 50]} />
        <Experience /> {/* Componente que contiene elementos 3D */}
        
        <Stats />
    </Canvas>
  </KeyboardControls>
  </div>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/canvas" element={<CanvasWrapper />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
