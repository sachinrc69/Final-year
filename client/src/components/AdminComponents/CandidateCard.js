import React from 'react';

const CandidateCard = ({ candidate }) => {
  return (
    <div className="candidate-card">
      <div className="candidate-info">
        <h3>{candidate.name}</h3>
        <p><strong>Description:</strong> {candidate.description}</p>
      </div>
    </div>
  );
};

export default CandidateCard;