import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { db } from '../firebase';

const CreateListing = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error('Zniżka musi być niższa niż cena');
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error('Maksymalnie 6 zdjęć');
      return;
    }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');

            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error('Brak zdjęć lub za duży rozmiar');
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
    setLoading(false);
    toast.success('Pozycja dodana');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center font-bold pt-20 text-white'>
        Dodaj ogłoszenie
      </h1>
      <form onSubmit={onSubmit}>
        <p className='text-lg mt-6 font-semibold text-white'>
          Sprzedaj / Wynajmij
        </p>
        <div className='flex'>
          <button
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover: shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === 'rent'
                ? 'bg-[#1F1B24] text-white border border-gray-400'
                : 'bg-[#322c3a] text-white border-2 border-blue-800'
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
                ? 'bg-[#1F1B24] text-gray-400 border border-gray-400'
                : 'bg-[#322c3a] text-white border-2 border-blue-800'
            }`}
            id='type'
            value='rent'
            type='button'
            onClick={onChange}
          >
            WYNAJMIJ
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold text-white'>Nazwa</p>
        <input
          type='text'
          id='name'
          value={name}
          onChange={onChange}
          maxLength='32'
          minLength='5'
          required
          className='w-full px-4 py-2 text-xl text-gray-300 bg-[#1F1B24] border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-300 focus:bg-[#1F1B24] focus:border-slate-600 mb-6'
        />
        <div className='flex space-x-6 justify-center mb-6'>
          <div>
            <p className='text-lg font-semibold text-white'>Sypialnie</p>
            <input
              type='number'
              id='bedrooms'
              value={bedrooms}
              onChange={onChange}
              min='1'
              max='50'
              required
              className='w-full px-4 py-2 text-xl text-gray-300 bg-[#1F1B24] border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-300 focus:bg-[#1F1B24] focus:border-slate-600'
            />
          </div>
          <div>
            <p className='text-lg font-semibold text-white'>Łazienki</p>
            <input
              type='number'
              id='bathrooms'
              value={bathrooms}
              onChange={onChange}
              min='1'
              max='50'
              required
              className='w-full px-4 py-2 text-xl text-gray-300 bg-[#1F1B24] border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-300 focus:bg-[#1F1B24] focus:border-slate-600'
            />
          </div>
        </div>
        <p className='text-lg mt-6 font-semibold text-white'>
          Miejsce parkingowe
        </p>
        <div className='flex'>
          <button
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover: shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !parking
                ? 'bg-[#1F1B24] text-gray-400 border border-gray-400'
                : 'bg-[#322c3a] text-white border-2 border-blue-800'
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
              parking
                ? 'bg-[#1F1B24] text-gray-400 border border-gray-400'
                : 'bg-[#322c3a] text-white border-2 border-blue-800'
            }`}
            id='parking'
            value={false}
            type='button'
            onClick={onChange}
          >
            Nie
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold text-white'>Umeblowane</p>
        <div className='flex'>
          <button
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover: shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !furnished
                ? 'bg-[#1F1B24] text-gray-400 border border-gray-400'
                : 'bg-[#322c3a] text-white border-2 border-blue-800'
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
              furnished
                ? 'bg-[#1F1B24] text-gray-400 border border-gray-400'
                : 'bg-[#322c3a] text-white border-2 border-blue-800'
            }`}
            id='furnished'
            value={false}
            type='button'
            onClick={onChange}
          >
            Nie
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold text-white'>Adres</p>
        <textarea
          type='text'
          id='address'
          value={address}
          onChange={onChange}
          required
          className='w-full px-4 py-2 text-xl text-gray-300 bg-[#1F1B24] border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-300 focus:bg-[#1F1B24] focus:border-slate-600 '
        />

        <p className='text-lg mt-6 font-semibold text-white'>Opis</p>
        <textarea
          type='text'
          id='description'
          value={description}
          onChange={onChange}
          required
          className='w-full px-4 py-2 text-xl text-gray-300 bg-[#1F1B24] border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-300 focus:bg-[#1F1B24] focus:border-slate-600 mb-2'
        />
        <p className='text-lg mt-6 font-semibold text-white'>Zniżka</p>
        <div className='flex mb-6'>
          <button
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover: shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !offer
                ? 'bg-[#1F1B24] text-gray-400 border border-gray-400'
                : 'bg-[#322c3a] text-white border-2 border-blue-800'
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
              offer
                ? 'bg-[#1F1B24] text-gray-400 border border-gray-400'
                : 'bg-[#322c3a] text-white border-2 border-blue-800'
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
            <p className='text-lg font-semibold text-white'>Cena</p>
            <div className='flex justify-center items-center'>
              <input
                type='number'
                id='regularPrice'
                value={regularPrice}
                onChange={onChange}
                min='50'
                max='400000000'
                required
                className='w-full px-4 py-2 text-lg text-gray-300 bg-[#1F1B24] border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-300 focus:bg-[#1F1B24] focus:border-slate-600 text-center'
              />
              {type === 'rent' && (
                <div className='ml-2'>
                  <p className='text-md w-full whitespace-nowrap text-white'>
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
              <p className='text-lg font-semibold text-white'>Cena po zniżce</p>
              <div className='flex justify-center items-center'>
                <input
                  type='number'
                  id='discountedPrice'
                  value={discountedPrice}
                  onChange={onChange}
                  min='50'
                  max='400000000'
                  required={offer}
                  className='w-full px-4 py-2 text-lg text-gray-300 bg-[#1F1B24] border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-300 focus:bg-[#1F1B24] focus:border-slate-600 text-center'
                />

                {type === 'rent' && (
                  <div className='ml-2'>
                    <p className='text-md w-full whitespace-nowrap text-white'>
                      zł / Miesiąc
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className='mb-6'>
          <p className='text-lg font-semibold text-white'>Zdjęcia</p>
          <p className='text-gray-200'>
            Pierwsze zdjecie bedzie zdjęciem głownym(max 6)
          </p>
          <input
            type='file'
            id='images'
            onChange={onChange}
            accept='.jpg, .png, .jpeg'
            multiple
            required
            className='w-full px-3 py-1.5 text-gray-300 bg-[#1F1B24] border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-[#1F1B24] focus:border-slate-600'
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
