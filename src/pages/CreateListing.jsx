import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const CreateListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    image: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;
  const onChange = (e) => {
    let boolean = null;
    if (e.target.value === 'true') {
      boolean = true;
    }
    if (e.target.value === 'false') {
      boolean = false;
    }
    //files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    //text/boolean/number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error('Zniżka musi być niższa niż cena');
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error('Maksymalnie 6 zdjęć');
      return;
    }
    let geolocation = {};
    let location;
    if (geolocationEnabled) {
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center font-bold pt-20'>Dodaj ogłoszenie</h1>
      <form onSubmit={onSubmit}>
        <p className='text-lg mt-6 font-semibold'>Sprzedaj / Wynajmij</p>
        <div className='flex'>
          <button
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover: shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === 'rent'
                ? 'bg-white text-black'
                : 'bg-slate-600 text-white'
            }`}
            id='type'
            value='sale'
            type='button'
            onClick={onChange}
          >
            SPRZEDAJ
          </button>
          <button
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover: shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === 'sale'
                ? 'bg-white text-black'
                : 'bg-slate-600 text-white'
            }`}
            id='type'
            value='rent'
            type='button'
            onClick={onChange}
          >
            WYNAJMIJ
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Nazwa</p>
        <input
          type='text'
          id='name'
          value={name}
          onChange={onChange}
          placeholder='Nazwa'
          maxLength='32'
          minLength='10'
          required
          className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
        />
        <div className='flex space-x-6 justify-center mb-6'>
          <div>
            <p className='text-lg font-semibold'>Sypialnie</p>
            <input
              type='number'
              id='bedrooms'
              value={bedrooms}
              onChange={onChange}
              min='1'
              max='50'
              required
              className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
          <div>
            <p className='text-lg font-semibold'>Łazienki</p>
            <input
              type='number'
              id='bathrooms'
              value={bathrooms}
              onChange={onChange}
              min='1'
              max='50'
              required
              className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
        </div>
        <p className='text-lg mt-6 font-semibold'>Miejsce parkingowe</p>
        <div className='flex'>
          <button
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover: shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !parking ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
            id='parking'
            value={true}
            type='button'
            onClick={onChange}
          >
            Tak
          </button>
          <button
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover: shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              parking ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
            id='parking'
            value={false}
            type='button'
            onClick={onChange}
          >
            Nie
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Umeblowane</p>
        <div className='flex'>
          <button
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover: shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
            id='furnished'
            value={true}
            type='button'
            onClick={onChange}
          >
            Tak
          </button>
          <button
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover: shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
            id='furnished'
            value={false}
            type='button'
            onClick={onChange}
          >
            Nie
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Adres</p>
        <textarea
          type='text'
          id='address'
          value={address}
          onChange={onChange}
          placeholder='Adres'
          required
          className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 '
        />
        {!geolocationEnabled && (
          <div className='flex space-x-6 justify-center mb-6'>
            <div className=''>
              <p className='text-lg font-semibold'>Szerokość geograficzna</p>
              <input
                type='number'
                id='latitude'
                value={latitude}
                onChange={onChange}
                required
                min='-90'
                max='90'
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'
              />
            </div>
            <div className=''>
              <p className='text-lg font-semibold'>Długość geograficzna</p>
              <input
                type='number'
                id='longitude'
                value={longitude}
                onChange={onChange}
                required
                min='-180'
                max='180'
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'
              />
            </div>
          </div>
        )}
        <p className='text-lg mt-6 font-semibold'>Opis</p>
        <textarea
          type='text'
          id='description'
          value={description}
          onChange={onChange}
          placeholder='Opis'
          required
          className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2'
        />
        <p className='text-lg mt-6 font-semibold'>Zniżka</p>
        <div className='flex mb-6'>
          <button
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover: shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !offer ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
            id='offer'
            value={true}
            type='button'
            onClick={onChange}
          >
            Tak
          </button>
          <button
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover: shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              offer ? 'bg-white text-black' : 'bg-slate-600 text-white'
            }`}
            id='offer'
            value={false}
            type='button'
            onClick={onChange}
          >
            Nie
          </button>
        </div>
        <div className='flex justify-center mb-6'>
          <div>
            <p className='text-lg font-semibold'>Cena</p>
            <div className='flex justify-center items-center'>
              <input
                type='number'
                id='regularPrice'
                value={regularPrice}
                onChange={onChange}
                min='50'
                max='400000000'
                required
                className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
              />
              {type === 'rent' && (
                <div className='ml-2'>
                  <p className='text-md w-full whitespace-nowrap'>
                    zł / Miesiąc
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className='flex justify-center mb-6'>
            <div>
              <p className='text-lg font-semibold'>Wielkość zniżki</p>
              <div className='flex justify-center items-center'>
                <input
                  type='number'
                  id='discountedPrice'
                  value={discountedPrice}
                  onChange={onChange}
                  min='50'
                  max='400000000'
                  required={offer}
                  className='w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                />

                {type === 'rent' && (
                  <div className='ml-2'>
                    <p className='text-md w-full whitespace-nowrap'>
                      zł / Miesiąc
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className='mb-6'>
          <p className='text-lg font-semibold'>Zdjęcia</p>
          <p className='text-gray-600'>
            Pierwsze zdjecie bedzie zdjęciem głownym(max 6)
          </p>
          <input
            type='file'
            id='images'
            onChange={onChange}
            accept='.jpg, .png, .jpeg'
            multiple
            required
            className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600'
          />
        </div>
        <button
          type='submit'
          className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
        >
          Stwórz ofertę
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
