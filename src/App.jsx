import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddDoctors from "./pages/Doctor/addDoctors"; 
import DisDoctors from "./pages/Doctor/disDoctors"; 

function App() {

  return (
    <Router>
      <div>
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} /> */}

          //sanduni


          //jithma
          <Route path="/doctors" element={<AddDoctors />} />
          <Route path="/disdoctors" element={<DisDoctors />} />



          //lakshitha


          //primal
        </Routes>
      </div>
    </Router>
  );
}

export default App;
