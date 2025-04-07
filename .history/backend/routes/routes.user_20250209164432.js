const express=require("express")
const routes=express.Router()

const {getUserByAadhar,getUserMailByAadhar, SaveUser}=require("../controllers/controllers.user")

routes.get("/:aadharid",getUserByAadhar)
routes.get("/mail/:aadharid",getUserMailByAadhar)
routes.post("/",SaveUser)

module.exports=routes