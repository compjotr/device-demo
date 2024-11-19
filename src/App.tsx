import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBarComponent";
import HomePage from "./pages/HomePageComponent";
import DevicesPage from "./pages/DevicePageComponent";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />

        <main className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/devices" element={<DevicesPage />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
