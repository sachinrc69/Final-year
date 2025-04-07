import React, { useEffect, useState } from "react";
import CandidateCard from "./CandidateCard";
import axios from "axios"; // Make sure you have axios installed

const CandidateDetails = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // const res = await axios.get("http://api.example.com/candidates"); // Replace with your API URL
        // setCandidates(res.data)
        setCandidates([{},{},{},{},{},{}]);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div className="container">
      <h2 className="mb-4">Candidate Details</h2>
      <div className="row">
        {candidates.length > 0 ? (
          candidates.map((candidate, index) => (
            <div key={index} className="col-md-4 mb-5 d-flex justify-content-around">
              <CandidateCard {...candidate} />
            </div>
          ))
        ) : (
          <p>No candidates available</p>
        )}
      </div>
    </div>
  );
};

export default CandidateDetails;
