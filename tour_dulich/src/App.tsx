import "./App.css";
import Register from "../pages/login/Register";
import Login from "../pages/login/Login";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <nav>
            <Link to="/login"></Link>
            <Link to="/register"></Link>
          </nav>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
