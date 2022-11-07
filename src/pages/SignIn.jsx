import React, { useState } from 'react';
import shareVideo from '../assets/share.mp4';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const navigate = useNavigate();
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Niepoprawne dane');
    }
  };
  return (
    <section>
      <div className='flex justify-start items-center flex-col h-screen'>
        <div className='relative w-full h-full'>
          <video
            src={shareVideo}
            type='video/mp4'
            loop
            controls={false}
            muted
            autoPlay
            className='w-full h-full object-cover'
          />
          <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
            <div className='text-center mt-6 font-semi-bold'>
              <h1 className='text-white text-3xl my-3'>Zaloguj się</h1>
              <form onSubmit={onSubmit}>
                <input
                  className='w-full px-4 py-2 text-xl text-grey-700 bg-white/50 border-gray-300 rounded transition ease-in-out  mb-4'
                  type='email'
                  id='email'
                  value={email}
                  onChange={onChange}
                  placeholder='E-mail'
                />
                <div className='relative'>
                  <input
                    className='w-full px-4 py-2 text-xl text-grey-700 bg-white/50 border-gray-300 rounded transition ease-in-out'
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    value={password}
                    onChange={onChange}
                    placeholder='Hasło'
                  />
                  {showPassword ? (
                    <AiFillEyeInvisible
                      className='absolute right-3 top-3 cursor-pointer'
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <AiFillEye
                      className='absolute right-3 top-3 cursor-pointer'
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>
                <div className='text-white my-3'>
                  <p>
                    Nie masz konta?
                    <Link className='font-bold' to='/sign-up'>
                      {' '}
                      Zarejestruj się!
                    </Link>
                  </p>
                  <p>
                    <Link to='/forgot-password'>Nie pamietasz hasła? </Link>
                  </p>
                </div>
                <button
                  className='w-full bg-blue-600/75 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'
                  type='submit'
                >
                  ZALOGUJ SIĘ
                </button>
                <div className='my-4 before:border-t flex before:flex-1 items-center before:border-gray-300 after:border-t flex after:flex-1 items-center after:border-gray-300 text-white'>
                  <p className='text-center font-semibold '>LUB</p>
                </div>
                <OAuth />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
