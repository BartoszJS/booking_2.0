import React from 'react';
import spinner from '../assets/svg/spinner.svg';

const Spinner = () => {
  return (
    <div className='flex items-center justify-center fixed left-0 right-0 top-0 bottom-0 '>
      <div>
        <img src={spinner} alt='Loading...' className='h-24' />
      </div>
    </div>
  );
};

export default Spinner;
