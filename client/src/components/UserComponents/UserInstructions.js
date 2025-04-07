import React from 'react';
import '../../styles/UserInstructions.css'; // Import the CSS file

const UserInstructions = () => {
  return (
    <div className="container">
      <h1>User Manual</h1>
      <p>Welcome</p>
      <p>These are a few guidelines for users:</p>
      <h2>1. Voter Registration</h2>
      <p>
        For casting the vote, the user needs to first register. For this registration purpose, the user will be provided a voter registration form on this website.
        The voter can only register in the registration phase. After the registration phase is over, the user cannot register and thus will not be able to vote.
        For registration, the user will have to enter their Aadhar card number and the account address which they will be using for voting purposes.
      </p>
      <p>
        At the first stage, the user’s age will be checked. If the user is 18 or above 18 years of age, then only they are eligible to vote.
        The second stage is OTP verification. This stage is required to validate the voter. After entering the Aadhar number and successful age verification,
        the user will receive an OTP. After entering the correct OTP, the user will be successfully registered.
      </p>
      <h2>2. Voting Process</h2>
      <p>
        Overall, the voting process is divided into three phases, all of which will be initialized and terminated by the admin. Users have to participate in the process according to the current phase.
      </p>
      <h3>Registration Phase</h3>
      <p>
        During this phase, the registration of the users (who are going to cast the vote) will be carried out.
      </p>
      <h3>Voting Phase</h3>
      <p>
        After the initialization of the voting phase by the admin, users can cast their votes in the voting section. The casting of votes can be simply done by clicking on the “VOTE” button, after which a transaction will be initiated. After confirming the transaction, the vote will be successfully cast. After the voting phase is over, users will not be able to cast votes.
      </p>
      <h3>Result Phase</h3>
      <p>
        This is the final stage of the whole voting process during which the results of the election will be displayed in the “Result” section.
      </p>
    </div>
  );
};

export default UserInstructions;