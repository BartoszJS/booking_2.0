import React from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';

const ListingItem = ({ listing, id, onEdit, onDelete }) => {
  return (
    <li className='relative bg-dark-primary flex flex-col justify-between items-center shadow-md hover:scale-105 transition-scale ease-in hover:bg-[#26212c] transition duration-150 rounded-md overflow-hidden  m-[10px]'>
      <Link className='contents' to={`/category/${listing.type}/${id}`}>
        <img
          className='h-[170px] w-full object-cover '
          loading='lazy'
          src={listing.imgUrls[0]}
          alt=''
        />
        <Moment
          className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg'
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className='w-full p-[10px]'>
          <div className='flex items-center space-x-1'>
            <MdLocationOn className='h-4 w-4 text-green-600' />
            <p className='font-semibold text-sm mb-[2px] text-gray-200 truncate'>
              {listing.address}
            </p>
          </div>
          <p className='text-white font-semibold mt-2 text-xl truncate'>
            {listing.name}
          </p>
          <p className='text-gray-200 mt-2 font-semibold'>
            {listing.offer ? listing.discountedPrice : listing.regularPrice}zł
            {listing.type === 'rent' && ' / Miesiąc'}
          </p>
          <div className='text-white flex items-center mt-[10px] space-x-3'>
            <div className='flex items-center space-x-1'>
              <p className='font-bold text-xs'>Łóżka : {listing.bedrooms}</p>
              <p className='font-bold text-xs'>
                Łazienki : {listing.bathrooms}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash
          className='absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500'
          onClick={() => onDelete(listing.id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className='absolute bottom-2 right-7 h-[16px] cursor-pointer text-slate-300'
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
};

export default ListingItem;
