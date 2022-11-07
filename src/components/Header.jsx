import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathMathRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };
  return (
    <div className='bg-black/50 w-full border-b shadow-sm fixed z-50'>
      <header className=' flex justify-between items-center px-3 max-w-6xl mx-auto '>
        <div
          className='cursor-pointer text-white'
          onClick={() => navigate('/')}
        >
          LOGO
        </div>
        <div>
          <ul className='flex space-x-10'>
            <li
              onClick={() => navigate('/')}
              className={`cursor-pointer py-4 text-base font-semibold text-white/70 border-b-[3px] border-b-transparent ${
                pathMathRoute('/') && 'text-white/100 border-b-red-500'
              }`}
            >
              Home
            </li>
            <li
              onClick={() => navigate('/offers')}
              className={`cursor-pointer py-4 text-base font-semibold text-white/70 border-b-[3px] border-b-transparent ${
                pathMathRoute('/offers') && 'text-white/100 border-b-red-500'
              }`}
            >
              Offers
            </li>
            <li
              onClick={() => navigate('/sign-in')}
              className={`cursor-pointer py-4 text-base font-semibold text-white/70 border-b-[3px] border-b-transparent ${
                pathMathRoute('/sign-in') && 'text-white/100 border-b-red-500'
              }`}
            >
              Sign In
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
