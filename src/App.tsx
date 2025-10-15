import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Terms from "./pages/Terms";
import Contribute from "./pages/Contribute";
import Y1F from "./pages/Y1F";
import Y1W from "./pages/Y1W";
import Y2F from "./pages/Y2F";
import Y2W from "./pages/Y2W";
import CIV102 from "./pages/y1f/CIV102";
import ESC103 from "./pages/y1f/ESC103";
import ESC180 from "./pages/y1f/ESC180";
import ESC194 from "./pages/y1f/ESC194";
import PHY180 from "./pages/y1f/PHY180";
import ECE159 from "./pages/y1w/ECE159";
import ESC190 from "./pages/y1w/ESC190";
import ESC195 from "./pages/y1w/ESC195";
import MAT185 from "./pages/y1w/MAT185";
import MSE160 from "./pages/y1w/MSE160";
import AER210 from "./pages/y2f/AER210";
import CHE260 from "./pages/y2f/CHE260";
import ECE253 from "./pages/y2f/ECE253";
import MAT292 from "./pages/y2f/MAT292";
import PHY293 from "./pages/y2f/PHY293";
import ECE259 from "./pages/y2w/ECE259";
import MIE286 from "./pages/y2w/MIE286";
import PHY294 from "./pages/y2w/PHY294";

// Problems pages
import ESC180Problems from "./pages/y1f/problems/ESC180";
import CIV102Problems from "./pages/y1f/problems/CIV102";
import MIE286Problems from "./pages/y2w/problems/MIE286";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/y1f" element={<Y1F />} />
            <Route path="/y1w" element={<Y1W />} />
            <Route path="/y2f" element={<Y2F />} />
            <Route path="/y2w" element={<Y2W />} />
            <Route path="/y1f/civ102" element={<CIV102 />} />
            <Route path="/y1f/esc103" element={<ESC103 />} />
            <Route path="/y1f/esc180" element={<ESC180 />} />
            <Route path="/y1f/esc194" element={<ESC194 />} />
            <Route path="/y1f/phy180" element={<PHY180 />} />
            <Route path="/y1w/ece159" element={<ECE159 />} />
            <Route path="/y1w/esc190" element={<ESC190 />} />
            <Route path="/y1w/esc195" element={<ESC195 />} />
            <Route path="/y1w/mat185" element={<MAT185 />} />
            <Route path="/y1w/mse160" element={<MSE160 />} />
            <Route path="/y2f/aer210" element={<AER210 />} />
            <Route path="/y2f/che260" element={<CHE260 />} />
            <Route path="/y2f/ece253" element={<ECE253 />} />
            <Route path="/y2f/mat292" element={<MAT292 />} />
            <Route path="/y2f/phy293" element={<PHY293 />} />
            <Route path="/y2w/ece259" element={<ECE259 />} />
            <Route path="/y2w/mie286" element={<MIE286 />} />
            <Route path="/y2w/phy294" element={<PHY294 />} />

            {/* Problems routes */}
            <Route path="/y1f/civ102/problems" element={<CIV102Problems />} />
            <Route path="/y1f/esc180/problems" element={<ESC180Problems />} />
            <Route path="/y2w/mie286/problems" element={<MIE286Problems />} />

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
