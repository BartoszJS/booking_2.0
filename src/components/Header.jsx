import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';
import { GiHamburgerMenu } from 'react-icons/gi';

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '+100%' },
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
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
          className='cursor-pointer text-white text-xl flex justify-center items-center'
          onClick={() => navigate('/')}
        >
          <HiHome /> HOME
        </div>
        <div>
          <ul className='flex justify-center items-center space-x-10'>
            <li
              onClick={() => navigate('/')}
              className={`header_content cursor-pointer py-4 text-base font-semibold text-white/70 border-b-[3px] border-b-transparent ${
                pathMatchRoute('/') && 'text-white/100 border-b-red-500'
              }`}
            >
              Strona główna
            </li>
            <li
              onClick={() => navigate('/offers')}
              className={`header_content cursor-pointer py-4 text-base font-semibold text-white/70 border-b-[3px] border-b-transparent ${
                pathMatchRoute('/offers') && 'text-white/100 border-b-red-500'
              }`}
            >
              Oferty
            </li>
            <li
              onClick={() => navigate('/profile')}
              className={`header_content cursor-pointer py-4 text-base font-semibold text-white/70 border-b-[3px] border-b-transparent 
                ${
                  pathMatchRoute('/sign-in') || pathMatchRoute('/profile')
                    ? 'text-white/100 border-b-red-500'
                    : 'border-0'
                }`}
            >
              {pageState}
            </li>

            <li className='hamburger py-4' onClick={() => setIsOpen(!isOpen)}>
              <GiHamburgerMenu />
            </li>
          </ul>
        </div>
      </header>
      <motion.nav animate={isOpen ? 'open' : 'closed'} variants={variants}>
        <div className='hamburger bg-black/50 backdrop-blur-sm w-full border-b shadow-sm fixed z-50'>
          <div
            onClick={() => {
              navigate('/');
              setIsOpen(false);
            }}
            className={`cursor-pointer py-4 text-base font-semibold text-white/70 border-b-[3px] border-b-transparent flex justify-center ${
              pathMatchRoute('/') && 'text-white/100 border-b-red-500'
            }`}
          >
            Strona główna
          </div>
          <div
            onClick={() => {
              navigate('/offers');
              setIsOpen(false);
            }}
            className={`cursor-pointer py-4 text-base font-semibold text-white/70 border-b-[3px] border-b-transparent flex justify-center ${
              pathMatchRoute('/offers') && 'text-white/100 border-b-red-500'
            }`}
          >
            Oferty
          </div>
          <div
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className={`cursor-pointer py-4 text-base font-semibold text-white/70 border-b-[3px] border-b-transparent flex justify-center
                ${
                  pathMatchRoute('/sign-in') || pathMatchRoute('/profile')
                    ? 'text-white/100 border-b-red-500'
                    : 'border-0'
                }`}
          >
            {pageState}
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default Header;
