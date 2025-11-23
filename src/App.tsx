import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateTour from "./pages/CreateTour";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create-tour" element={<CreateTour />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
