import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from 'swiper';
import 'swiper/css/bundle';
import { useNavigate } from 'react-router-dom';

const Slider = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchListings();
  }, []);
  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: 'progressbar' }}
        module={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listings.map(({ data, id }) => (
          <SwiperSlide
            key={id}
            onClick={() => navigate(`/category/${data.type}/${id}`)}
          >
            {console.log(data.imgUrls[0])}
            <div
              style={{
                backgroundImage: `url("${data.imgUrls[0]}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className='relative w-full h-[600px] overflow-hidden cursor-pointer'
            ></div>
            <p className='text-[#f1faee] absolute left-1 top-20 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-80 p-2 rounded'>
              {data.name}
            </p>
            <p className='text-[#f1faee] absolute left-1 bottom-3 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-80 p-2 rounded'>
              {!data.offer ? data.regularPrice : data.discountedPrice} zł
              {data.type === 'sale' ? '' : ' / Miesiąc'}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

    // <div>
    //   {listings.map(({ data, id }) => (
    //     <div
    //       key={id}
    //       style={{
    //         backgroundImage: `url("${data.imgUrls[0]}")`,
    //         backgroundSize: 'cover',
    //       }}
    //       onClick={() => navigate(`/category/${data.type}/${id}`)}
    //       className='relative w-full h-[500px] overflow-hidden cursor-pointer'
    //     ></div>
    //   ))}
    // </div>
  );
};

export default Slider;
