import React from 'react';
import { FcGoogle } from 'react-icons/fc';
const OAuth = () => {
  return (
    <button className='flex items-center justify-center w-full bg-red-700 text-white py-3 px-7 rounded hover:bg-red-800 active:bg-red-900 shadow-md transition duration-150 ease-in-out'>
      <FcGoogle className='text-2xl bg-white rounded-full mr-2' />
      ZALOGUJ SIE PRZEZ GOOGLE
    </button>
  );
};

export default OAuth;
