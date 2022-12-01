import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../firebase';

const Contact = ({ userRef, listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error('Nie można wykonać operacji');
      }
    };
    getLandlord();
  }, [userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div>
      {landlord && (
        <div className='flex flex-col w-full'>
          <p className='text-white'>
            Skontaktuj się z {landlord.name} w sprawie "
            {listing.name.toLowerCase()}"
          </p>
          <div className='mt-3 mb-3'>
            <textarea
              name='message'
              id='message'
              rows='3'
              value={message}
              onChange={onChange}
              className='w-full px-4 py-2 text-xl text-white bg-[#26212c] border border-gray-300 rounded transition duration-150 ease-in-out focus:text-white focus:bg-[#322c3a] focus:border-slate-600 resize-none'
            />
          </div>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button
              className='px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-700 active:shadow-lg transition duration-150 ease-in-out w-full text-center'
              type='button'
            >
              Wyślij wiadomość
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Contact;
