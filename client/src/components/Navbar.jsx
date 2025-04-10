import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

  const navigate = useNavigate();
  const { userData, backendurl, setUserData, setIsloggedin } = useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendurl + '/api/auth/send-verify-otp');

      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logOut = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendurl + '/api/auth/logout');

      data.success && setIsloggedin(false);
      data.success && setUserData(false);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='absolute top-0 flex items-center justify-between w-full p-4 sm:p-6 sm:px-24'>
      <img src={assets.logo} alt="" className='w-28 sm:w-32' />
      {userData ?
        <div className='relative flex items-center justify-center w-8 h-8 font-semibold text-white bg-blue-500 rounded-full group'>
          {userData.name[0].toUpperCase()}
          <div className='absolute top-0 right-0 z-10 hidden pt-10 text-black rounded group-hover:block'>
            <ul className='p-2 m-0 text-sm list-none bg-gray-100 w-[150px] p-3 mb-6 text-center '>
              {!userData.isAccountVerified &&
                <li onClick={sendVerificationOtp} className='px-2 py-1 cursor-pointer hover:bg-gray-200 hover:rounded-3xl'>Verify Email</li>
              }

              <li onClick={logOut} className='px-2 py-1 cursor-pointer hover:bg-gray-200 hover:rounded-3xl'>Logout</li>
            </ul>
          </div>
        </div> :
        <button onClick={() => { navigate('/login') }}
          className='flex items-center gap-2 px-6 py-2 text-gray-800 transition-all border border-gray-500 rounded-full hover:bg-gray-100'>
          Login<img src={assets.arrow_icon} alt='hello' /></button>}

    </div>
  )
}

export default Navbar