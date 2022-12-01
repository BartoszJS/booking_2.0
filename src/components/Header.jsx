import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState('Profil');
      } else {
        setPageState('Rejestracja');
      }
    });
  }, [auth]);

  const [pageState, setPageState] = useState('Rejestracja');
  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };
  return (
    <div className='bg-black/50 backdrop-blur-sm w-full border-b shadow-sm fixed z-50'>
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
                pathMatchRoute('/') && 'text-white/100 border-b-red-500'
              }`}
            >
              Home
            </li>
            <li
              onClick={() => navigate('/offers')}
              className={`cursor-pointer py-4 text-base font-semibold text-white/70 border-b-[3px] border-b-transparent ${
                pathMatchRoute('/offers') && 'text-white/100 border-b-red-500'
              }`}
            >
              Offers
            </li>
            <li
              onClick={() => navigate('/profile')}
              className={`cursor-pointer py-4 text-base font-semibold text-white/70 border-b-[3px] border-b-transparent ${
                pathMatchRoute('/sign-in') ||
                (pathMatchRoute('/profile') &&
                  'text-white/100 border-b-red-500')
              }`}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
