import { ReactElement, useState } from 'react'
// import './App.css'
import SignInPage from './pages/signIn/sign-in'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignUpPage from './pages/signUp/sign-up'
import HomePage from './pages/home/home'
import AccountDetails from './pages/accountDetails/account-details'
import LevelSelection from './pages/levelSelection/levelSelection'
import RenderPuzzle from './pages/wordSearchPuzzle/renderPuzzle'
import React from 'react'


function App() {


  return (

    
    <BrowserRouter>
      <Routes>
          <Route index element={<SignInPage/>} /> 
          <Route path="/home" element={<HomePage/>} />
          <Route path="/signin" element={<SignInPage/>} />
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/account-details" element={<AccountDetails/>} />
          <Route path="/difficultyselection" element={<LevelSelection/>} />
          <Route path="/render/:difficulty/:levelId/:loadFlag" element={<RenderPuzzle/>} />
      </Routes>
    </BrowserRouter>

       


    

    
  )
}

export default App
