import { ReactElement, useState } from 'react'
// import './App.css'
import SignInPage from './pages/signIn/sign-in'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignUpPage from './pages/signUp/sign-up'
import HomePage from './pages/home/home'
import WordSearchBoard from './pages/wordSearchPuzzle/fillBoardGridHard'
import AccountDetails from './pages/accountDetails/account-details'
import DifficultySelectionPage from './pages/difficultySelection/difficultySelection'
import RenderPuzzle from './pages/wordSearchPuzzle/renderPuzzle'
import React from 'react'


function App() {


  return (

    
    <BrowserRouter>
      <Routes>
          <Route index element={<DifficultySelectionPage/>} /> 
          <Route path="/home" element={<HomePage/>} />
          <Route path="/signin" element={<SignInPage/>} />
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/account-details" element={<AccountDetails/>} />
          <Route path="/difficultyselection" element={<DifficultySelectionPage/>} />
          <Route path="/render/:difficulty" element={<RenderPuzzle/>} />
      </Routes>
    </BrowserRouter>

       


    

    
  )
}

export default App
