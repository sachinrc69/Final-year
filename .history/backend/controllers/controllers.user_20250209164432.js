const {userModel}=require("../models/models.user")

async function getUserByAadhar(req,res){
    const {aadharid}=req.params
    try{
        const user=await userModel.findOne({"aadharid":aadharid})
        res.status(200).json(user)
    }
    catch(err){
        res.status(500).json({message:"Error in getting user details"})
    }
}

async function getUserMailByAadhar(req,res) {
    const {aadharid}=req.params
    try{
        const user=await userModel.findOne({"aadharid":aadharid})
        console.log(user,"\n",user.email)
        res.status(200).json(user.email)
    }
    catch(err){
        res.status(500).json({message:"Error in getting user details"})
    }
}


const SaveUser = async (req, res) => {
    try {
      const existingUser = await userModel.findOne({ aadharid: req.body.aadharid });
      if (existingUser) {
        return res.json({ message: "User already exists" });
      } else {
        const user = new userModel(req.body);
        await user.save();
        res
          .status(200)
          .json({ message: "User signed in successfully", success: true, user });
      }
    } catch (error) {
      console.error(error);
    }
  };

module.exports = {getUserByAadhar, getUserMailByAadhar,SaveUser}