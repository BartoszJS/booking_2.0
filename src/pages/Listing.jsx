import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from 'swiper';
import 'swiper/css/bundle';
import Contact from '../components/Contact';

const Listing = () => {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactLandlord, setContactLandlord] = useState(false);
  const [sharedLink, setSharedLink] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: 'progressbar' }}
        effect='fade'
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                backgroundImage: `url("${listing.imgUrls[index]}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className='relative w-full h-[600px] overflow-hidden '
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className='fixed top-[11%] right-[3%] z-10 bg-[#1F1B24] cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setSharedLink(true);
          setTimeout(() => {
            setSharedLink(false);
          }, 2000);
        }}
      >
        <FaShare className='text-lg text-slate-200' />
      </div>
      {sharedLink && (
        <p className='fixed top-[18%] right-[4%] font-semibold border-2 border-gray-400 rounded-md bg-[#1F1B24] z-10 p-1 text-white'>
          Skopiowano
        </p>
      )}
      <div className='m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg border-3 shadow-lg bg-[#1F1B24] lg:space-x-5'>
        <div className='w-full'>
          <p className='text-2xl font-bold mb-3 text-blue-200'>
            {listing.name}{' '}
            {listing.offer ? listing.discountedPrice : listing.regularPrice}z??
            {listing.type === 'rent' ? ' / Miesi??c' : ''}
          </p>
          <p className='flex text-white items-center mt-6 mb-3 font-semibold'>
            <FaMapMarkerAlt className='text-green-700 mr-1' />
            {listing.address}
          </p>
          <div className='flex justify-start items-center space-x-4 w-[75%]'>
            <p className='bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md'>
              {listing.type === 'rent' ? 'Na wynajem' : 'Na sprzeda??'}
            </p>
            {listing.offer && (
              <p className='w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold'>
                {+listing.regularPrice - +listing.discountedPrice}z?? zni??ki
              </p>
            )}
          </div>
          <p className='mt-3 mb-3 text-white'>
            <span className='font-semibold'> Opis - </span>
            {listing.description}
          </p>
          <ul className='grid grid-cols-2 sm:space-x-3 sm:flex sm:items-center text-sm font-semibold text-white'>
            <li className='flex items-center whitespace-nowrap'>
              <FaBed className='text-lg mr-1 text-green-600' />
              ??????ka: {+listing.bedrooms}
            </li>
            <li className='flex items-center whitespace-nowrap'>
              <FaBath className='text-lg mr-1 text-green-600' />
              ??azienki: {+listing.bathrooms}
            </li>
            <li className='flex items-center whitespace-nowrap'>
              <FaParking className='text-lg mr-1 text-green-600' />
              {listing.parking ? 'Parking' : 'Brak parkingu'}
            </li>
            <li className='flex items-center whitespace-nowrap'>
              <FaChair className='text-lg mr-1 text-green-600' />
              {listing.furnished ? 'Umeblowane' : 'Nieumeblowane'}
            </li>
          </ul>
        </div>
        <div className='w-full'>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className='mt-6'>
              <button
                onClick={() => setContactLandlord(true)}
                className='w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg text-center transition duration-150'
              >
                Skontaktuj si?? z
                {listing.type === 'rent' ? ' wynajmuj??cym' : ' sprzedaj??cym'}
              </button>
            </div>
          )}
          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>
      </div>
    </main>
  );
};

export default Listing;
