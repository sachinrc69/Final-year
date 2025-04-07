import React, { useContext, useEffect, useState } from "react";
// import deployContract from "../../deployContract";
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from "../../providers/AuthProvider";
import UserInstructions from "./UserInstructions";
import VoterRegistration from "./VoterRegistration";
import VotingArea from "./VotingArea";
import Results from "./Results";
import "../../styles/Sidebar.css";
import { toast, ToastContainer } from "react-toastify";
import { BlockchainContext } from "../../providers/BlockChainProvider";

const UserPanel = () => {
  // const UserPanel = ({ setContractAddress }) => {
  // const [candidates, setCandidates] = useState([]);
  // const [candidateName, setCandidateName] = useState("");
  // const [isDeploying, setIsDeploying] = useState(false);

  // const addCandidate = () => {
  //   if (candidateName.trim() !== "") {
  //     setCandidates([...candidates, candidateName]);
  //     setCandidateName("");
  //   }
  // };

  // const deployVotingContract = async () => {
  //   if (candidates.length === 0) {
  //     alert("Please add at least one candidate before deploying.");
  //     return;
  //   }

  //   setIsDeploying(true);
  //   const contract = await deployContract(candidates);
  //   if (contract) {
  //     setContractAddress(contract.options.address);
  //   }
  //   setIsDeploying(false);
  // };

  // return (
  //   <div className="container">
  //     <h2>Admin Panel</h2>
  //     <input
  //       type="text"
  //       value={candidateName}
  //       onChange={(e) => setCandidateName(e.target.value)}
  //       placeholder="Enter candidate name"
  //     />
  //     <button onClick={addCandidate}>Add Candidate</button>

  //     <ul>
  //       {candidates.map((c, index) => (
  //         <li key={index}>{c}</li>
  //       ))}
  //     </ul>

  //     <button onClick={deployVotingContract} disabled={isDeploying}>
  //       {isDeploying ? "Deploying..." : "Deploy Contract"}
  //     </button>
  //   </div>
  // );
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("Instructions");
  const { logout } = useAuth();
  const { initWeb3 } = useContext(BlockchainContext);

  useEffect(() => {
    initWeb3();

  }, [])

  function handleLogout() {
    toast.success("Logout successful! Redirecting...", { autoClose: 2000 });
    setTimeout(() => {
      navigate("/")
      logout()
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
                {[
                  "Instructions",
                  "Voter Registration",
                  "Voting Area",
                  "Results",
                ].map((tab) => (
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
              <button className="btn btn-primary m-3 " onClick={handleLogout}>Logout</button>
            </div>
          </div>

          {/* Main Content (80% width) */}
          <div className="col-md-9 col-lg-10">
            <div className="content p-3">
              {activeTab === "Instructions" && <UserInstructions />}
              {activeTab === "Voter Registration" && <VoterRegistration />}
              {activeTab === "Voting Area" && <VotingArea />}
              {activeTab === "Results" && <Results candidates={[
                { name: "Alice", votes: 120 },
                { name: "Bob", votes: 95 },
                { name: "Charlie", votes: 150 }
              ]}
                electionStatus="completed"
              />}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
};

export default UserPanel;
