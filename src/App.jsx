// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthDiag.jsx'
import Home from './pages/HomeDiag.jsx'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/auth" element={<AuthPage/>}/>
        <Route path="*" element={<Navigate to="/auth" replace/>}/>
      </Routes>
    </BrowserRouter>
  )
}
