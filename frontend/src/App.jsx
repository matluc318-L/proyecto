import { Navigate, Route, Routes } from "react-router-dom";
import PreAccessQRPage from "./pages/PreAccessQRPage";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import ReceiptPage from "./pages/ReceiptPage";
import StaffLoginPage from "./pages/StaffLoginPage";
import StaffRecordsPage from "./pages/StaffRecordsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PreAccessQRPage />} />
      <Route path="/inicio" element={<LandingPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/comprobante/:codigo" element={<ReceiptPage />} />
      <Route path="/login-personal" element={<StaffLoginPage />} />
      <Route path="/panel-registros" element={<StaffRecordsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
