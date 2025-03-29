import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//Sanduni
import PharmacyDashboard from './pages/Parmacy_Management/PharmacyDashboard';
import InventoryForm from './pages/Parmacy_Management/InventoryForm';
import InventryDetails from './pages/Parmacy_Management/InventryDetails';
import BillForm from './pages/Parmacy_Management/BillForm';
import BillDetails from './pages/Parmacy_Management/BillDetails';



function App() {

  return (
    <Router>
      <div>
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} /> */}

          //sanduni
          <Route path = "/parmacyhome" element = {<PharmacyDashboard/>}></Route>
          <Route path = "/inventory" element = {<InventoryForm/>}></Route>
          <Route path = "/inventoryDetails" element = {<InventryDetails/>}></Route>
          <Route path = "/billing" element = {<BillForm/>}></Route>
          <Route path = "/billingDetails" element = {<BillDetails/>}></Route>

          //jithma


          //lakshitha


          //primal
        </Routes>
      </div>
    </Router>
  );
}

export default App;
