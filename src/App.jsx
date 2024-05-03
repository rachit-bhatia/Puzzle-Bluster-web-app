import { useState } from 'react'
// import './App.css'
import SignInPage from './pages/signIn/sign-in'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignUpPage from './pages/signUp/sign-up'
import HomePage from './pages/home/home'


function App() {


  return (

    
    <BrowserRouter>
      <Routes>
          <Route index element={<SignInPage/>} /> 
          <Route path="/home" element={<HomePage/>} />
          <Route path="/signin" element={<SignInPage/>} />
          <Route path="/signup" element={<SignUpPage/>} />

      </Routes>
    </BrowserRouter>

       


    

    
  )
}

export default App
