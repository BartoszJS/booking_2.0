import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { db } from '../firebase';
const OAuth = () => {
  const navigate = useNavigate();
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (error) {
      toast.error('Nie można zalogować przrz Google');
    }
  };
  return (
    <button
      type='button'
      onClick={onGoogleClick}
      className='flex items-center justify-center w-full bg-red-700/70 text-white py-3 px-7 rounded hover:bg-red-800 active:bg-red-900 shadow-md transition duration-150 ease-in-out'
    >
      <FcGoogle className='text-2xl bg-white rounded-full mr-2' />
      ZALOGUJ SIE PRZEZ GOOGLE
    </button>
  );
};

export default OAuth;
