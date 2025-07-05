import React from 'react'
import './App.css'
import Registration from './components/Registration'
import Home from './components/Home'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router';

function App()
{

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
        </Routes>

      </Router>
      <ToastContainer />
    </>
  )
}

export default App
