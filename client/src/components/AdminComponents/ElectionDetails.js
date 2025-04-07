import { useEffect, useState, React } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ElectionDetails = () => {
  const [electionDetails, setElectionDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/getAllElections");
        console.log(res.data);
        setElectionDetails(res.data.elections);
        // setElectionDetails([{
        //   _id: "67c8a28b55830e6397eb4612",
        //   electionName: "TS Election",
        //   electionDescription: "dedewfewfesf",
        //   winner: "Dinesh Reddy Valipi",
        //   candidates: [
        //     {
        //       name: "Dinesh Reddy Valipi",
        //       votes: 0,
        //       _id: "67c8a28b55830e6397eb4613"
        //     },
        //     {
        //       name: "Dinesh",
        //       votes: 0,
        //       _id: "67c8a28b55830e6397eb4614"
        //     }
        //   ],
        //   createdAt: "2025-03-05T19:14:19.407Z"
        // },
        // {
        //   _id: "67c8a76755830e6397eb4633",
        //   electionName: "TS Election",
        //   electionDescription: "This is assembly election",
        //   winner: "Valipi Dinesh Reddy",
        //   candidates: [
        //     {
        //       name: "Valipi Dinesh Reddy",
        //       votes: 1,
        //       _id: "67c8a76755830e6397eb4634"
        //     },
        //     {
        //       name: "deepak",
        //       votes: 0,
        //       _id: "67c8a76755830e6397eb4635"
        //     }
        //   ],
        //   createdAt: "2025-03-05T19:35:03.258Z"
        // },
        // {
        //   _id: "67c92b387e26b0f5996e570a",
        //   electionName: "Test Elections",
        //   electionDescription: "testing done for voting process",
        //   winner: "sathwik",
        //   candidates: [
        //     {
        //       name: "Kartheek Bhai",
        //       votes: 0,
        //       _id: "67c92b387e26b0f5996e570b"
        //     },
        //     {
        //       name: "sathwik",
        //       votes: 1,
        //       _id: "67c92b387e26b0f5996e570c"
        //     }
        //   ],
        //   createdAt: "2025-03-06T04:57:28.571Z",
        // }])
      } catch (error) {
        console.error("Error fetching election details:", error);
      }
    };

    fetchElectionDetails();
  }, []);

  const handleViewDetails = (election) => {
    navigate(`/election/${election._id}`, { state: { election } });
  };

  return (
    <div className="container">
      <h2 className="mb-4">Election Details</h2>
      <div className="row">
        {electionDetails.length > 0 ? (
          electionDetails.map((election, index) => (
            <div
              key={index}
              className="col-md-4 mb-5 d-flex justify-content-around"
            >
              <div className="card shadow-sm" style={{ width: "18rem" }}>
                {/* <img
                  src="https://pixabay.com/vectors/elections-vote-sheet-paper-pen-536656/"
                  className="card-img-top"
                  alt="Dummy"
                  style={{ height: "200px", objectFit: "cover" }}
                /> */}
                <div className="card-body">
                  <h5 className="card-title">{election.electionName}</h5>
                  <p className="card-text">
                    <strong>Description:</strong> {election.electionDescription}
                  </p>
                  <br></br>
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => handleViewDetails(election)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No elections conducted</p>
        )}
      </div>
      {/* {selectedElection && (
        <div className="election-details mt-4">
          <h3>Selected Election Details</h3>
          <p>
            <strong>Name:</strong> {selectedElection.name}
          </p>
          <p>
            <strong>Description:</strong> {selectedElection.description}
          </p>
          <h2 className="text-center mb-4">Election Results</h2>
          <Row className="justify-content-center">
            {candidates.map((candidate, index) => (
              <Col key={index} md={4} className="mb-3">
                <Card className={winner && winner.name === candidate.name ? "bg-success text-white" : ""}>
                  <Card.Body>
                    <Card.Title>{candidate.name}</Card.Title>
                    <Card.Text>Votes: {candidate.votes}</Card.Text>
                    {winner && winner.name === candidate.name && <strong>🏆 Winner</strong>}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )} */}
    </div>
  );
};

export default ElectionDetails;