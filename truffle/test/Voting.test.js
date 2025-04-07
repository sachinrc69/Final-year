const Voting = artifacts.require("Voting");
const { expect } = require("chai");

contract("Voting", (accounts) => {
  let votingInstance;
  const admin = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];

  before(async () => {
    votingInstance = await Voting.new({ from: admin });
  });

  describe("--> Contract Deployment", () => {
    it("should deploy correctly and set admin", async () => {
      expect(await votingInstance.admin()).to.equal(admin);
    });

    it("should initialize in the Registration phase", async () => {
      const phase = await votingInstance.currentPhase();
      expect(phase.toString()).to.equal("0"); // Phase.Registration
    });
  });

  describe("--> Election Setup", () => {
    it("should allow admin to create an election", async () => {
      await votingInstance.createElection("Presidential Election", "Election for the new president", { from: admin });
      const details = await votingInstance.electionDetails();
      expect(details.electionName).to.equal("Presidential Election");
    });

    it("should not allow non-admins to create an election", async () => {
      try {
        await votingInstance.createElection("Test Election", "Test Description", { from: voter1 });
      } catch (err) {
        expect(err.reason).to.equal("Only admin can perform this action");
      }
    });
  });

  describe("--> Candidate Management", () => {
    it("should allow admin to add candidates", async () => {
      await votingInstance.addCandidate("Alice", "Candidate 1", { from: admin });
      await votingInstance.addCandidate("Bob", "Candidate 2", { from: admin });

      const candidate1 = await votingInstance.candidateDetails(0);
      const candidate2 = await votingInstance.candidateDetails(1);

      expect(candidate1.candidateName).to.equal("Alice");
      expect(candidate2.candidateName).to.equal("Bob");
    });

    it("should not allow non-admins to add candidates", async () => {
      try {
        await votingInstance.addCandidate("Charlie", "Candidate 3", { from: voter1 });
      } catch (err) {
        expect(err.reason).to.equal("Only admin can perform this action");
      }
    });
  });

  describe("--> Voter Registration", () => {
    it("should allow users to register as voters", async () => {
      await votingInstance.registerVoter("Voter1", "123456789012", { from: voter1 });
      await votingInstance.registerVoter("Voter2", "987654321098", { from: voter2 });

      const voter1Data = await votingInstance.voterDetails(voter1);
      const voter2Data = await votingInstance.voterDetails(voter2);

      expect(voter1Data.isRegistered).to.be.true;
      expect(voter2Data.isRegistered).to.be.true;
    });

    it("should not allow duplicate Aadhaar registration", async () => {
      try {
        await votingInstance.registerVoter("Voter3", "123456789012", { from: accounts[3] });
      } catch (err) {
        expect(err.reason).to.equal("This Aadhaar is already registered with another account.");
      }
    });
  });

  describe("--> Voter Verification", () => {
    it("should allow admin to verify voters", async () => {
      await votingInstance.verifyVoter(voter1, true, { from: admin });
      await votingInstance.verifyVoter(voter2, true, { from: admin });

      const voter1Data = await votingInstance.voterDetails(voter1);
      const voter2Data = await votingInstance.voterDetails(voter2);

      expect(voter1Data.isVerified).to.be.true;
      expect(voter2Data.isVerified).to.be.true;
    });

    it("should not allow non-admins to verify voters", async () => {
      try {
        await votingInstance.verifyVoter(accounts[3], true, { from: voter1 });
      } catch (err) {
        expect(err.reason).to.equal("Only admin can perform this action");
      }
    });
  });

  describe("--> Election Phases", () => {
    it("should allow admin to change to Voting phase", async () => {
      await votingInstance.changePhase({ from: admin });
      const phase = await votingInstance.currentPhase();
      expect(phase.toString()).to.equal("1"); // Phase.Voting
    });

    it("should not allow non-admins to change the phase", async () => {
      try {
        await votingInstance.changePhase({ from: voter1 });
      } catch (err) {
        expect(err.reason).to.equal("Only admin can perform this action");
      }
    });
  });

  describe("--> Voting Process", () => {
    it("should allow verified voters to vote", async () => {
      await votingInstance.vote(0, { from: voter1 });
      await votingInstance.vote(1, { from: voter2 });

      const candidate1 = await votingInstance.candidateDetails(0);
      const candidate2 = await votingInstance.candidateDetails(1);

      expect(candidate1.voteCount.toNumber()).to.equal(1);
      expect(candidate2.voteCount.toNumber()).to.equal(1);
    });

    it("should not allow unverified voters to vote", async () => {
      try {
        await votingInstance.vote(0, { from: accounts[3] });
      } catch (err) {
        expect(err.reason).to.equal("Only verified voters can vote.");
      }
    });

    it("should not allow voters to vote twice", async () => {
      try {
        await votingInstance.vote(0, { from: voter1 });
      } catch (err) {
        expect(err.reason).to.equal("Already voted");
      }
    });
  });

  describe("--> Election Completion", () => {
    it("should allow admin to change to Results phase", async () => {
      await votingInstance.changePhase({ from: admin });
      const phase = await votingInstance.currentPhase();
      expect(phase.toString()).to.equal("2"); // Phase.Results
    });

    it("should allow admin to end the election", async () => {
      await votingInstance.changePhase({ from: admin });
      const phase = await votingInstance.currentPhase();
      expect(phase.toString()).to.equal("3"); // Phase.Ended
    });

    it("should return election results", async () => {
      const results = await votingInstance.getResults();
      expect(results.length).to.equal(2);
    });
  });
});
