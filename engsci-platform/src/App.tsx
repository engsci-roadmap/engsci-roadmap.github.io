import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import NavBar from "./components/home/NavBar";
import Footer from "./components/home/Footer";
import Y1F from "./pages/Y1F";
import Y1W from "./pages/Y1W";
import Y2F from "./pages/Y2F";
import Y2W from "./pages/Y2W";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/y1f" element={<Y1F />} />
            <Route path="/y1w" element={<Y1W />} />
            <Route path="/y2f" element={<Y2F />} />
            <Route path="/y2w" element={<Y2W />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
