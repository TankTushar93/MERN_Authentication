import React from 'react'
import { useContext, useEffect } from 'react'
import {assets} from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AppContent } from '../Context/AppContext.jsx';
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const {backendurl} = useContext(AppContent);
  axios.defaults.withCredentials = true;
  
  const [email,setEmail] = useState('');
  const [newPassword,setNewPassword] = useState('');
  const [isEmailSent,setIsEmailSent] = useState('');
  const [otp,setOtp] = useState(0);
  const [isOtpSubmitted,setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlepaste = (e) => {
    const paste = e.clipboardData.getData('Text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const navigate = useNavigate();

  const onSubmitEmail = async (e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendurl + '/api/auth/send-reset-otp',{email});

      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message);
    }
  }

  const onSubmitOtp = async (e)=>{
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  }

  const onSubminNewPassword = async (e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.post(backendurl + '/api/auth/reset-password',{email,otp,newPassword});
      
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  }
  
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-600'>
        <img src={assets.logo} alt="" onClick={() => { navigate('/') }} className='absolute cursor-pointer left-5 sm:left-20 top-5 w-28 sm:w-32' />

    {/* Enter email Id*/}
    {!isEmailSent && 
      <form onSubmit={onSubmitEmail} className='p-8 text-sm rounded-lg bg-slate-900 shadow-3xl w-96'>
      <h1 className='mb-4 text-2xl font-semibold text-center text-white'>Reset Password</h1>
        <p className='mb-6 text-center text-indigo-300'>Enter Your Registered Email Address.</p>
        
        <div className="flex items-center w-full gap-3 px-5 mb-4 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.mail_icon} alt="" className="w-3 h-3" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email id" className="text-white bg-transparent outline-none" />
        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">Submit</button>
      </form>
    }
    
      {/*otp input form */}
      
    {!isOtpSubmitted && isEmailSent && 
      <form onSubmit={onSubmitOtp} className='p-8 text-sm rounded-lg bg-slate-900 shadow-3xl w-96'>
        <h1 className='mb-4 text-2xl font-semibold text-center text-white'>Email Verify OTP</h1>
        <p className='mb-6 text-center text-indigo-300'>Enter The 6-digit Code Sent To Your Email id.</p>

        <div className='flex justify-between mb-8' onPaste={handlepaste}>
          {Array(6).fill(0).map((_, index) => (
            <input type='text' maxLength='1' key={index} required className='w-12 h-12 text-xl text-center text-white bg-[#333A5C] rounded-md '
              ref={(e) => inputRefs.current[index] = e}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)} />
          ))}
        </div>
        <button className='w-full text-white rounded-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900'>Submit</button>
      </form>
  }
  
      {/* Enter New Password */}
      {isOtpSubmitted && isEmailSent && 
      <form onSubmit={onSubminNewPassword} className='p-8 text-sm rounded-lg bg-slate-900 shadow-3xl w-96'>
      <h1 className='mb-4 text-2xl font-semibold text-center text-white'>New Password</h1>
        <p className='mb-6 text-center text-indigo-300'>Enter The New Password Below </p>
        
        <div className="flex items-center w-full gap-3 px-5 mb-4 py-2.5 rounded-full bg-[#333A5C]">
          <img src={assets.lock_icon} alt="" className="w-3 h-3" />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Password" className="text-white bg-transparent outline-none" />
        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">Submit</button>
      </form>
      }
    </div>
  )
}

export default ResetPassword