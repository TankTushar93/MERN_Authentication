import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { toast } from 'react-toastify';
import { AppContent } from '../Context/AppContext.jsx';
import axios from 'axios';

const EmailVerify = () => {

  axios.defaults.withCredentials = true;
  const { backendurl, isloggedin, userData, getUserData } = useContext(AppContent);
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

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');


      const { data } = await axios.post(backendurl + '/api/auth/verify-account', { otp });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    isloggedin && userData.isAccountVerified && navigate('/');
  }, [isloggedin,userData]);

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-600'>
      <img src={assets.logo} alt="" onClick={() => { navigate('/') }} className='absolute cursor-pointer left-5 sm:left-20 top-5 w-28 sm:w-32' />

      <form onSubmit={onSubmitHandler} className='p-8 text-sm rounded-lg bg-slate-900 shadow-3xl w-96'>
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
        <button className='w-full py-3 text-white rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900'>Verify Email</button>
      </form>
    </div>
  )
}

export default EmailVerify