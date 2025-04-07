import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminComponents/AdminPanel";
import UserPanel from "./components/UserComponents/UserPanel";
import Home from "./components/Home";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import UserLoginPage from "./components/UserComponents/UserLoginPage";
import SignUpPage from "./components/AdminComponents/SignUpPage";
import UserSignInPage from "./components/UserComponents/UserSignInPage";
function App() {
  const [contractAddress, setContractAddress] = useState("");

  return (
    <Router>
      <div className="container-fluid">
        <Routes>
          <Route path="/admin_panel" element={<AdminPanel />} />
          <Route path="/user_panel" element={<UserPanel />} />
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<UserLoginPage />} />
          <Route path="/admin-signin" element={<SignUpPage />} />
          <Route path="/sign-up" element={<UserSignInPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
