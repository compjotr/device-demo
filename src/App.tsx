import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBarComponent";
import HomePage from "./pages/Home";
import DevicesPage from "./pages/Device";
import { ROUTES } from "./constants/routes";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />

        <main className="container mx-auto px-4">
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.DEVICES} element={<DevicesPage />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
