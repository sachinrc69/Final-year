import React, { useState, useContext, useEffect } from "react";
import deployContract from "../../deployContract";
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import Instructions from "./Instructions";
import ElectionDetails from "./ElectionDetails";
import AddCandidates from "./AddCandidates";
import ManageElection from "./ManageElection";
import VerifyVoters from "./VerifyVoters";
import CandidateDetails from "./CandidateDetails";
import LiveMonitoring from "./LiveMonitoring";
import "../../styles/Sidebar.css";
import { toast } from "react-toastify";
import { useAuth } from "../../providers/AuthProvider";
import { BlockchainContext } from "../../providers/BlockChainProvider";



const AdminPanel = ({ setContractAddress }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("Instructions");
  const { logout } = useAuth();

  const { initWeb3 } = useContext(BlockchainContext);

  useEffect(() => {
    initWeb3();
  }, [])

  const tabs = [
    "Instructions",
    "Election Details",
    // "Candidate Details",
    "Manage Election",
    "Add Candidates",
    "Verify Voters",
    "Live Monitoring",
  ];

  function handleLogout() {
    logout()
    toast.success("Logout successful! Redirecting...", { autoClose: 2000 });
    setTimeout(() => {
      navigate("/")
    }, 2000);
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-lg-2 bg-light vh-100">
            <div className="sidebar">
              <h1 style={{ color: "white" }} className="p-2 border-0">
                Voting App
              </h1>
              <hr style={{ color: "white" }} />
              <ul className="list-group list-group-flush">
                {tabs.map((tab) => (
                  <li
                    key={tab}
                    className={`list-group-item ${activeTab === tab ? "active" : ""
                      }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary m-3" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* Main Content (80% width) */}
          <div className="col-md-9 col-lg-10">
            <div className="content p-3">
              {activeTab === "Instructions" && <Instructions />}
              {activeTab === "Election Details" && <ElectionDetails />}
              {/* {activeTab === "Candidate Details" && <CandidateDetails />} */}
              {activeTab === "Manage Election" && <ManageElection />}
              {activeTab === "Add Candidates" && <AddCandidates />}
              {activeTab === "Verify Voters" && <VerifyVoters />}
              {activeTab === "Live Monitoring" && <LiveMonitoring />}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
};

export default AdminPanel;