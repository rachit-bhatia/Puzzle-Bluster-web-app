import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/signIn/sign-in";
import SignUpPage from "./pages/signUp/sign-up";
import HomePage from "./pages/home/home";
import AccountDetails from "./pages/accountDetails/account-details";
import AccountPage from "./pages/accountPage/accountPage";
import LevelSelection from "./pages/levelSelection/levelSelection";
import RenderPuzzle from "./pages/wordSearchPuzzle/renderPuzzle";
import RenderMathPuzzle from "./pages/mathPuzzle/renderMathPuzzle";
import PuzzleSelection from "./pages/puzzleSelection/puzzleSelection";
import HomePageGuest from "./pages/homeGuest/homeGuest";
import Leaderboard from "./pages/leaderboard/leaderboard";
import DesktopPage from "./pages/desktopPage/desktopPage";
import NavBar from "./components/navBar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<DesktopPage />} />
        {/* <Route index element={<SignInPage />} /> */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/home-guest" element={<HomePageGuest />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/account-details" element={<AccountDetails />} />
        <Route path="/accountpage" element={<AccountPage />} />
        <Route path="/puzzleselection" element={<PuzzleSelection />} />
        <Route
          path="/:puzzleType/levelselection"
          element={<LevelSelection />}
        />

        <Route
          path="/render-word/:difficulty/:levelId/:loadFlag"
          element={<RenderPuzzle />}
        />
        <Route
          path="/render-math/:difficulty/:levelId/:loadFlag"
          element={<RenderMathPuzzle />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
