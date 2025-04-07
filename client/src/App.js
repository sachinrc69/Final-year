import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminComponents/AdminPanel";
import UserPanel from "./components/UserComponents/UserPanel";
import Home from "./components/Home";
import AuthProvider from "./providers/AuthProvider";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import UserLoginPage from "./components/UserComponents/UserLoginPage";
import AdminLoginPage from "./components/AdminComponents/AdminLoginPage";
import UserSignUpPage from "./components/UserComponents/UserSignUpPage";
import VoterProtectedRoute from "./middlewares/VoterProtectedRoutes"
import AdminProtectedRoute from "./middlewares/AdminProtectedRoutes";
import { ToastContainer } from "react-toastify";
import BlockchainProvider from "./providers/BlockChainProvider";
import UserLobby from "./components/UserComponents/UserLobby";
import ElectionDetails from "./components/AdminComponents/ElectionDetails";
import SingleElection from "./components/AdminComponents/SingleElection";
function App() {
  //const [contractAddress, setContractAddress] = useState("");

  return (
    <>
      <ToastContainer position="top-right" />
      <Router>
        <AuthProvider>
          <BlockchainProvider>
            <div className="container-fluid">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<UserLoginPage />} />
                <Route path="/admin-signin" element={<AdminLoginPage />} />
                <Route path="/sign-up" element={<UserSignUpPage />} />
                <Route path="/user_panel" element={<UserPanel />} />

                <Route element={<VoterProtectedRoute />}>
                  <Route path="/user_lobby" element={<UserLobby />} />
                </Route>

                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin_panel" element={<AdminPanel />} />
                  <Route path="/election/:id" element={<SingleElection />} />
                </Route>
              </Routes>
            </div>
          </BlockchainProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
