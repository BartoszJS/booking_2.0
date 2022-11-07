import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  useEffect(() => {
    console.log(formData);
  }, []);

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const { name, email } = formData;
  return (
    <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className='text-3xl text-center font-bold pt-20'>Profil</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form>
          <input
            type='text'
            id='name'
            value={name}
            disabled
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'
          />
          <input
            type='email'
            id='email'
            value={email}
            disabled
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'
          />

          <div>
            <p className='flex justify-between whitespace-nowrap'>
              <span className='cursor-pointer'>Edytuj</span>
              <span onClick={onLogout} className='cursor-pointer'>
                Wyloguj się
              </span>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;
