import userModel from "../models/userModel.js";

export const getUserData = async (req,res)=>{
    try {
        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if(!user){
            return res.send({success:false,message:"User Not Found!!"});
        }

        res.send({success:true,
            userData:{
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        res.send({success:false,message:error.message});
    }
}