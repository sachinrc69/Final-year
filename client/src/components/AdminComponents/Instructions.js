import React from 'react';
import '../../styles/Instructions.css';

const Instructions = () => {
  return (
    <div className="container">
      <h1>Admin Manual</h1>
      <p>Welcome</p>
      <p>These are a few guidelines for admins:</p>
      
      <h2>1. Managing Candidates</h2><br />
      <h3>Adding Candidates</h3>
      <p>
        The admin can add candidates for the election during the candidate registration phase.
        To add a candidate, navigate to the "Add Candidates" section in the admin panel.
        Enter the candidate's name, age, qualification, role, description, and profile image in the provided form.
        Click the "Add Candidate" button to register the candidate for the election.
      </p>
      <h3>Removing Candidates</h3>
      <p>
        The admin can remove candidates if necessary.
        Navigate to the "Manage Candidates" section in the admin panel.
        Select the candidate you wish to remove and click the "Remove Candidate" button.
      </p>
      
      <h2>2. Managing the Voting Process</h2><br />
      <h3>Initializing Phases</h3>
      <p>
        The voting process is divided into three phases: Registration, Voting, and Result.
        The admin is responsible for initializing and terminating each phase.
        Navigate to the "Manage Election" section in the admin panel to control the phases.
      </p>
      <h3>Registration Phase</h3>
      <p>
        During this phase, users can register to vote.
        Ensure that the registration phase is active before users attempt to register.
        Navigate to the "Register Voters" section in the admin panel to register voters using their wallet addresses.
      </p>
      <h3>Voting Phase</h3>
      <p>
        After the registration phase, the admin can initialize the voting phase.
        During this phase, registered users can cast their votes.
        Ensure that the voting phase is active for users to vote.
      </p>
      <h3>Live Monitoring</h3>
      <h5>Monitoring the Election</h5>
      <p>
        The admin can monitor the election process in real-time.
        Navigate to the "Live Monitoring" section in the admin panel.
        This section provides a live update of the election, including the number of votes each candidate has received.
      </p>
      <h3>Result Phase</h3>
      <p>
        After the voting phase, the admin can initialize the result phase.
        During this phase, the results of the election will be displayed.
        The results will be automatically calculated and displayed based on the votes cast during the voting phase.
        The admin can announce the results to the users.
        Ensure that the result phase is active and the results are visible to all users.
      </p>
      
      
      <h2>3. Logging Out</h2>
      <h5>Logging Out of the Admin Panel</h5>
      <p>
        To log out of the admin panel, click the "Logout" button located in the sidebar.
        This will securely log you out of the admin panel.
      </p>
    </div>
  );
};

export default Instructions;