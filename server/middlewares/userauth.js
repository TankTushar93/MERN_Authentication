import jwt from 'jsonwebtoken';

//an middlaware For Ann User ID From The Token Using cookies
const userAuth = async (req,res,next)=>{

    const {token} = req.cookies;
    if(!token){
        return res.send({success:false,message:"Not Authorized. Login Again"});
    }

    try {
       const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);

       if(tokenDecode.id){
        req.body.userId = tokenDecode.id;
       }else{
        return res.send({success:false,message:'Not Authorized Login Again'});
       }

       next();
    } catch (error) {
        return res.send({success:false,message:error.message})
    }
}

export default userAuth;