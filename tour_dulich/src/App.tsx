import "./App.css";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { About } from "./pages/user/about/About";
import Profile from "./pages/user/profile/Profile";
import Home from "./pages/user/home/Home";
import Tour from "./pages/user/tours/Tours";
import Contact from "./pages/user/contact/Contact";
import TourDetail from "./pages/user/tourDetail/TourDetail";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <nav>
            <Link to="/login"></Link>
            <Link to="/register"></Link>
            <Link to="/"></Link>
            <Link to="/about"></Link>
            <Link to="/profile"></Link>
            <Link to="/tours"></Link>
            <Link to="/contact"></Link>
          </nav>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tours" element={<Tour />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tours/:id/detail" element={<TourDetail />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
