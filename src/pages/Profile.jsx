import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { FcHome } from 'react-icons/fc';

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
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
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success('Dane zaktualizowne');
    } catch (error) {
      console.log(error);
      toast.error('Nie można zakutalizować');
    }
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
            disabled={!changeDetail}
            onChange={onChange}
            className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6 ${
              changeDetail && 'bg-red-200 focus:bg-red-200'
            }`}
          />
          <input
            type='email'
            id='email'
            value={email}
            disabled={!changeDetail}
            onChange={onChange}
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'
          />

          <div>
            <p className='flex justify-between whitespace-nowrap'>
              <span
                onClick={() => {
                  changeDetail && onSubmit();
                  setChangeDetail((prevState) => !prevState);
                }}
                className='cursor-pointer'
              >
                {changeDetail ? 'Zastosuj zmiany' : 'Edytuj'}
              </span>
              <span onClick={onLogout} className='cursor-pointer'>
                Wyloguj się
              </span>
            </p>
          </div>
        </form>
        <button
          type='submit'
          className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 mt-5'
        >
          <Link
            to='/create-listing'
            className='flex justify-center items-center'
          >
            <FcHome className='mr-2 text-3xl bg-red-20 rounded-full p-1' />
            Sprzedaj lub wynajmij mieszkanie
          </Link>
        </button>
      </div>
    </section>
  );
};

export default Profile;
