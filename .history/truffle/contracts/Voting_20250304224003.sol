// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;
    uint256 public candidateCount;
    uint256 public voterCount;
    uint256 public verifiedVoterCount;
    uint256 public votedVoterCount;
    bool public start;
    bool public end;

    enum Phase { Registration, Voting, Results, Ended }
    Phase public currentPhase;

    struct Candidate {
        uint256 candidateId;
        string candidateName;
        string description;
        uint256 voteCount;
    }
    mapping(uint256 => Candidate) public candidateDetails;

    struct ElectionDetails {
        string electionName;
        string description;
    }
    ElectionDetails public electionDetails;

    struct Voter {
        address voterAddress;
        string name;
        bytes32 aadhaarHash;
        bool isVerified;
        bool hasVoted;
        bool isRegistered;
    }
    mapping(address => Voter) public voterDetails;
    address[] public voters;

    event ElectionCreated(string name, string description);
    event PhaseChanged(Phase newPhase);
    event CandidateAdded(uint256 candidateId, string name);
    event VoterRegistered(address voter, string name);
    event VoterVerified(address voter, bool verified);
    event VoteCast(address voter, uint256 candidateId);
    event ElectionEnded();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyVerifiedVoter() {
        require(voterDetails[msg.sender].isVerified, "Only verified voters can vote.");
        _;
    }

    constructor() {
        admin = msg.sender;
        currentPhase = Phase.Registration;
    }

    function createElection(string memory _name, string memory _description) public onlyAdmin {
        electionDetails = ElectionDetails(_name, _description);
        start = true;
        end = false;
        currentPhase = Phase.Registration;
        emit ElectionCreated(_name, _description);
    }

    function addCandidate(string memory _candidateName, string memory _description) public onlyAdmin {
        require(currentPhase == Phase.Registration, "Can only add candidates during Registration phase.");
        candidateDetails[candidateCount] = Candidate(candidateCount, _candidateName, _description, 0);
        emit CandidateAdded(candidateCount, _candidateName);
        candidateCount++;
    }

    function registerVoter(string memory _name, string memory _aadhaar) public {
        require(!voterDetails[msg.sender].isRegistered, "Voter already registered");
        bytes32 aadhaarHash = keccak256(abi.encodePacked(_aadhaar));
        voterDetails[msg.sender] = Voter(msg.sender, _name, aadhaarHash, false, false, true);
        voters.push(msg.sender);
        voterCount++;
        emit VoterRegistered(msg.sender, _name);
    }

    function verifyVoter(address voterAddress, bool _verifiedStatus) public onlyAdmin {
        require(voterDetails[voterAddress].isRegistered, "Voter not registered");
        require(!voterDetails[voterAddress].isVerified, "Voter is already verified");

        voterDetails[voterAddress].isVerified = _verifiedStatus;
        
        if (_verifiedStatus) {
            verifiedVoterCount++; // Increment verified voter count
        }

        emit VoterVerified(voterAddress, _verifiedStatus);
    }

    function vote(uint256 candidateId) public onlyVerifiedVoter {
        require(currentPhase == Phase.Voting, "Voting phase has not started.");
        require(!voterDetails[msg.sender].hasVoted, "Already voted");
        require(candidateId < candidateCount, "Invalid candidate ID");

        candidateDetails[candidateId].voteCount++;
        voterDetails[msg.sender].hasVoted = true;
        votedVoterCount++; // Increment voted voter count

        emit VoteCast(msg.sender, candidateId);
    }

    function changePhase() public onlyAdmin {
        require(currentPhase != Phase.Ended, "Election already ended.");

        if (currentPhase == Phase.Registration) {
            require(candidateCount > 1, "Add minimum of 2 candidates before starting voting phase.");
            currentPhase = Phase.Voting;
        } else if (currentPhase == Phase.Voting) {
            currentPhase = Phase.Results;
        } else if (currentPhase == Phase.Results) {
            currentPhase = Phase.Ended;
            start = false;
            end = true;
            emit ElectionEnded();
        }

        emit PhaseChanged(currentPhase);
    }

    function getCurrentPhase() public view returns (string memory) {
        if (currentPhase == Phase.Registration) return "Registration";
        if (currentPhase == Phase.Voting) return "Voting";
        if (currentPhase == Phase.Results) return "Results";
        return "Election Ended";
    }

    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory candidates = new Candidate[](candidateCount);
        for (uint256 i = 0; i < candidateCount; i++) {
            candidates[i] = candidateDetails[i];
        }
        return candidates;
    }

    function getVoters() public view returns (Voter[] memory) {
        Voter[] memory voterList = new Voter[](voterCount);
        for (uint256 i = 0; i < voterCount; i++) {
            voterList[i] = voterDetails[voters[i]];
        }
        return voterList;
    }

    function getTotalVoter() public view returns (uint256) {
        return voterCount;
    }

    function getRegisteredVoterCount() public view returns (uint256) {
        return voterCount;
    }

    function getVerifiedVoterCount() public view returns (uint256) {
        return verifiedVoterCount;
    }

    function getVotedVoterCount() public view returns (uint256) {
        return votedVoterCount;
    }

    function getResults() public view returns (Candidate[] memory) {
        require(currentPhase == Phase.Results || currentPhase == Phase.Ended, "Results are not available yet.");
        Candidate[] memory results = new Candidate[](candidateCount);
        for (uint256 i = 0; i < candidateCount; i++) {
            results[i] = candidateDetails[i];
        }
        return results;
    }
}
