import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.send({ success: false, message: "Please Fill Full Details!!" });
    }

    try {
        const existinguser = await userModel.findOne({ email });
        if (existinguser) {
            return res.send({ success: false, message: "User Already Exists!!" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedpassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Service',
            text: `Welcome To My WebSite. Your Account has been created with email id:${email}`
        };

       await transporter.sendMail(mailOptions)
            .then(() => {
                res.send({ success: true, message: "User Registered Successfully!!" });
            })
            .catch((error) => {
                console.error("Email sending failed:", error);
                res.send({ success: true, message: "User Registered, but email not sent!" });
            });

       
    } catch (error) {
        return res.send({ success: false, message: error.message });
    }
};


export const login = async (req,res)=>{
    const {email,password} = req.body;

    if(!email|| !password){
        return res.send({success:false,message:"Please Fill Full Details!!"});
    }

    try {
       
       const user = await userModel.findOne({email});
       if(!user){
            return res.send({success:false,message:"User Not Found!!"});
       } 

       const isMatch = await bcrypt.compare(password,user.password);

       if(!isMatch){
            return res.send({success:false,message:"Incorrect Password!!"});
       }

       const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn: '7d'});

       res.cookie('token',token,{httpOnly:true,secure:process.env.NODE_ENV === 'production',sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',maxAge:7*24*60*60*1000});

       res.send({success:true,message:"User Logged In Successfully!!"});
    } catch (error) {
        res.send({success:false,message:error.message});
    }
}


export const logout = async  (req,res)=>{
    try {
        res.clearCookie('token',{httpOnly:true,secure:process.env.NODE_ENV === 'production',sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict'});
      return res.send({success:true,message:"User Logged Out Successfully!!"});
    } catch (error) {
        return res.send({success:false,message:error.message}); 
    }
}


//Send verification Otp to user email
export const sendverifyOtp = async (req,res)=>{
    try {

        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.send({success:false,message:"Your Account is Already Verified!!"});
        }

       const otp = String(Math.floor(100000 + Math.random() * 900000));

       user.verifyOtp = otp;
         user.verifyotpexpireat = Date.now() + 24*60*1000; //5 minutes

         await user.save();

         const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification OTP',
           // text: `Your Otp is ${otp}. Verify Your Account using This OTP.`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
         }

         await transporter.sendMail(mailOption);

         return res.send({success:true,message:"Verification OTP Sent On Email"});

    } catch (error) {
        return res.send({success:false,message:error.message});
        
    }
}


//Verify Otp and verify user account
 export const  verifyEmail = async (req,res)=>{
     const {userId,otp} = req.body;
     if(!userId || !otp){
         res.send({success:false,message:"Missing Details!!!"})
     }
    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.send({success:false,message:"User Not Found!!"});
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.send({success:false,message:"InCorrect Otp!"});
        }
        if(user.verifyotpexpireat < Date.now()){
            return res.send({success:false,message:"Otp Expired!!"});
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyotpexpireat = 0; //Reset Otp and expire time
        await user.save();
        return res.send({success:true,message:"Email Verified Successfully!!"});
    } catch (error) {
        return res.send({success:false,message:error.message});
    }
 }


 //Check If User Is Authenticated
 export const isAuthenticated = async (req,res)=>{
    try 
    {
        return res.send({success:true,message:"User Is Authenticated!!"});  
    } catch (error) {

        return res.send({success:false,message:error.message});
    }
 }

 //send password reset otp
export const sendResetOtp = async (req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.send({success:false,message:"Email Is Required!"});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.send({success:false,messahe:"Uase Not Found!"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

       user.resetOtp = otp;
         user.resetOtpExpireAt = Date.now() + 15*60*1000; //15 minutes

         await user.save();

         const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            // text: `Your Otp For Resseting Your Password is ${otp}. 
            // Use This OTP To Proceed With Resetting Your Password.`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)

         }

         await transporter.sendMail(mailOption);

         return res.send({success:true,message:"OTP Sent To Your Email"});
    } catch (error) {
       return res.send({success:false,message:error.message});
        
    }
}

//Reset Password
export const resetPassword = async (req,res)=>{
    const {email,otp,newPassword}= req.body;

    if(!email || !otp || !newPassword){
        return res.send({success:false,message:"Email, OTP, and New Password are Required!"});
    }
    try {
       
        const user = await userModel.findOne({email});
        if(!user){
            return res.send({success:false,message:"User Not Found!"});
        }
        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.send({success:false,message:"InCorrect Otp!"});
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.send({success:false,message:"Otp Expired!!"});
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0; //Reset Otp and expire time
        await user.save();
        return res.send({success:true,message:"Password Has Been Reset Successfully!!"});

    } catch (error) {
        return res.send({success:false,message:error.message});
        
    }
}