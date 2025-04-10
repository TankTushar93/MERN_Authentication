import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../Context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const Login = () => {

  const navigate = useNavigate();

  const { backendurl, setIsloggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      if (state === 'Sign Up') {

        const { data } = await axios.post(backendurl + '/api/auth/register', { name, email, password });

        if (data.success) {
          setIsloggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message)

        }

      } else {
        const { data } = await axios.post(backendurl + '/api/auth/login', { email, password });

        if (data.success) {
          setIsloggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)

    }
  }


  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-600'>
      <img src={assets.logo} alt="" onClick={() => { navigate('/') }} className='absolute cursor-pointer left-5 sm:left-20 top-5 w-28 sm:w-32' />
      <div className='w-full p-10 text-sm text-indigo-300 rounded-lg shadow-3xl bg-slate-900 sm:w-96'>

        <h2 className='mb-3 text-3xl font-semibold text-center text-white'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>

        <p className='mb-6 text-sm text-center'>{state === 'Sign Up' ? 'Create Your Account' : 'Login To Your Account'}</p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className='flex items-center w-full gap-3 px-5 mb-4 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="" />
              <input className='bg-transparent outline-none cursor-pointer' onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Full Name' required />
            </div>
          )}

          <div className='flex items-center w-full gap-3 px-5 mb-4 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input className='bg-transparent outline-none cursor-pointer' onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email ID' required />
          </div>

          <div className='flex items-center w-full gap-3 px-5 mb-4 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input className='bg-transparent outline-none cursor-pointer' onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required />
          </div>

          <p onClick={() => { navigate('/reset-password') }} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-900 text-white font-medium'>{state}</button>

        </form>

        {state === 'Sign Up'
          ?
          (<p className='mt-4 text-xs text-center text-gray-400 cursour-pointer'>Already Have An Account?{''}
            <span onClick={() => { setState('Login') }} className='text-blue-400 underline cursor-pointer'>Login Here</span>
          </p>)
          :
          (<p className='mt-4 text-xs text-center text-gray-400 cursour-pointer'>Don't Have An Account?{''}
            <span onClick={() => { setState('Sign Up') }} className='text-blue-400 underline cursor-pointer'>Sign Up</span>
          </p>)}



      </div>
    </div>
  )
}

export default Login