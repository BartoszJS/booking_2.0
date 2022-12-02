import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

const Offers = () => {
  const [listingsOffer, setListingsOffer] = useState(null);
  const [listingsSale, setListingsSale] = useState(null);
  const [listingsRent, setListingsRent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchListingOffer, setLastFetchListingOffer] = useState(null);
  const [lastFetchListingSale, setLastFetchListingSale] = useState(null);
  const [lastFetchListingRent, setLastFetchListingRent] = useState(null);
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    const fetchListingsOffers = async () => {
      try {
        const listingRef = collection(db, 'listings');
        const q = query(
          listingRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListingOffer(lastVisible);
        const listingsOffer = [];
        querySnap.forEach((doc) => {
          return listingsOffer.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListingsOffer(listingsOffer);
        setLoading(false);
      } catch (error) {
        toast.error('Nie można wyświetlić ofert');
      }
    };
    fetchListingsOffers();
    const fetchListingsSale = async () => {
      try {
        const listingRef = collection(db, 'listings');
        const q = query(
          listingRef,
          where('type', '==', 'sale'),
          orderBy('timestamp', 'desc'),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListingSale(lastVisible);
        const listingsSale = [];
        querySnap.forEach((doc) => {
          return listingsSale.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListingsSale(listingsSale);
        setLoading(false);
      } catch (error) {
        toast.error('Nie można wyświetlić ofert');
      }
    };
    fetchListingsSale();
    const fetchListingsRent = async () => {
      try {
        const listingRef = collection(db, 'listings');
        const q = query(
          listingRef,
          where('type', '==', 'rent'),
          orderBy('timestamp', 'desc'),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchListingRent(lastVisible);
        const listingsRent = [];
        querySnap.forEach((doc) => {
          return listingsRent.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListingsRent(listingsRent);
        setLoading(false);
      } catch (error) {
        toast.error('Nie można wyświetlić ofert');
      }
    };
    fetchListingsRent();
  }, []);

  const onFetchMoreListings = async () => {
    try {
      const listingRef = collection(db, 'listings');
      const q = query(
        listingRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchListingOffer),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListingOffer(lastVisible);
      const listingsOffer = [];
      querySnap.forEach((doc) => {
        return listingsOffer.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListingsOffer((prevState) => [...prevState, ...listingsOffer]);
      setLoading(false);
    } catch (error) {
      toast.error('Nie można wyświetlić ofert');
    }
  };
  const onFetchMoreListingsSale = async () => {
    try {
      const listingRef = collection(db, 'listings');
      const q = query(
        listingRef,
        where('type', '==', 'sale'),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchListingSale),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListingSale(lastVisible);
      const listingsSale = [];
      querySnap.forEach((doc) => {
        return listingsSale.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListingsSale((prevState) => [...prevState, ...listingsSale]);
      setLoading(false);
    } catch (error) {
      toast.error('Nie można wyświetlić ofert');
    }
  };
  const onFetchMoreListingsRent = async () => {
    try {
      const listingRef = collection(db, 'listings');
      const q = query(
        listingRef,
        where('type', '==', 'rent'),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchListingRent),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListingRent(lastVisible);
      const listingsRent = [];
      querySnap.forEach((doc) => {
        return listingsRent.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListingsRent((prevState) => [...prevState, ...listingsRent]);
      setLoading(false);
    } catch (error) {
      toast.error('Nie można wyświetlić ofert');
    }
  };

  return (
    <div>
      <div className='max-w-6xl mx-auto px-3'>
        {loading ? (
          <Spinner />
        ) : listingsOffer && listingsOffer.length > 0 ? (
          <>
            <h1 className='text-3xl text-center pt-20 mb-6 text-white'>
              Przecenione miejsca
            </h1>
            <main>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {listingsOffer.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                  />
                ))}
              </ul>
            </main>
            {lastFetchListingOffer && (
              <div className='flex justify-center items-center'>
                <button
                  onClick={onFetchMoreListings}
                  className='bg-blue-600 px-4 py-2 text-white mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out'
                >
                  Pokaż więcej
                </button>
              </div>
            )}
          </>
        ) : (
          <p className='text-white'>Brak ofert</p>
        )}
      </div>

      <div className='max-w-6xl mx-auto px-3'>
        {loading ? (
          <Spinner />
        ) : listingsSale && listingsSale.length > 0 ? (
          <>
            <h1 className='text-3xl text-center pt-20 mb-6 text-white'>
              Miejsca na sprzedaż
            </h1>
            <main>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {listingsSale.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                  />
                ))}
              </ul>
            </main>
            {lastFetchListingSale && (
              <div className='flex justify-center items-center'>
                <button
                  onClick={onFetchMoreListingsSale}
                  className='bg-blue-600 px-4 py-2 text-white mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out'
                >
                  Pokaż więcej
                </button>
              </div>
            )}
          </>
        ) : (
          <p className='text-white'>Brak ofert</p>
        )}
      </div>

      <div className='max-w-6xl mx-auto px-3'>
        {loading ? (
          <Spinner />
        ) : listingsRent && listingsRent.length > 0 ? (
          <>
            <h1 className='text-3xl text-center pt-20 mb-6 text-white'>
              Miejsca do wynajęcia
            </h1>
            <main>
              <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {listingsRent.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                  />
                ))}
              </ul>
            </main>
            {lastFetchListingRent && (
              <div className='flex justify-center items-center'>
                <button
                  onClick={onFetchMoreListingsRent}
                  className='bg-blue-600 px-4 py-2 text-white mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out'
                >
                  Pokaż więcej
                </button>
              </div>
            )}
          </>
        ) : (
          <p className='text-white'>Brak ofert</p>
        )}
      </div>
    </div>
  );
};

export default Offers;
