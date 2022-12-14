import { getAuth, updateProfile } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { FcHome } from 'react-icons/fc';
import ListingItem from '../components/ListingItem.jsx';

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;

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

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingRef = collection(db, 'listings');
      const q = query(
        listingRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setLoading(false);
      setListings(listings);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onDelete = async (listingID) => {
    if (window.confirm('Czy na pewno chcesz usunać?')) {
      await deleteDoc(doc(db, 'listings', listingID));
      const updateListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updateListings);
      toast.success('Udało sie usunąć!');
    }
  };
  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  };

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-white text-center font-bold pt-20'>
          Profil
        </h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            <input
              type='text'
              id='name'
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`w-full px-4 py-2 text-xl text-white bg-[#322c3a] border-[#322c3a] rounded transition duration-150 ease-in-out mb-6 ${
                changeDetail && 'bg-[#322c3a] focus:bg-[#322c3a]'
              }`}
            />
            <input
              type='email'
              id='email'
              value={email}
              disabled={!changeDetail}
              onChange={onChange}
              className='w-full px-4 py-2 text-xl text-white bg-[#322c3a] border-[#322c3a] rounded transition duration-150 ease-in-out mb-6'
            />

            <div>
              <p className='flex justify-between whitespace-nowrap'>
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className='cursor-pointer  text-black bg-green-500 rounded p-2  text-center hover:bg-green-600 transition duration-200 ease-in-out hover:text-white'
                >
                  {changeDetail ? 'Zastosuj zmiany' : 'Edytuj'}
                </span>
                <span
                  onClick={onLogout}
                  className='cursor-pointer  text-black bg-red-500 rounded p-2 text-center hover:bg-red-600 transition duration-200 ease-in-out hover:text-white'
                >
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
      <div className='max-w-6xl px-3 mt-6 mx-auto'>
        {!loading && listings.length > 0 && (
          <>
            <h2 className='text-2xl text-white text-center font-semibold'>
              Moje dodane
            </h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6 mb-6'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
