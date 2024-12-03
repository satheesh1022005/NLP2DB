import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Nav} from './pages/index';
import ErDiagramFetcher from './components/ErDiagramFetcher';
function App() {
  return (
    <>
      <Nav />
      <ErDiagramFetcher/>
    </>
  )
}

export default App
