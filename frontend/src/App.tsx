import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import ShoppingPage from "./pages/ShoppingPage";
import MoviesPage from "./pages/MoviesPage";
import EventsPage from "./pages/EventsPage";
import ImprovementsPage from "./pages/ImprovementsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/"         element={<HomePage />} />
        <Route path="/shopping" element={<ShoppingPage />} />
        <Route path="/movies"   element={<MoviesPage />} />
        <Route path="/events"   element={<EventsPage />} />
        <Route path="/improvements" element={<ImprovementsPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="*"         element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
