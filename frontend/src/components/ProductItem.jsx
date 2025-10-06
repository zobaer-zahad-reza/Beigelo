import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import OptimizedProductImage from './OptimizedProductImage';


const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  const publicId = getPublicIdFromUrl(image[0]);

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden'>
        {/* <<< ধাপ ৩: <img> ট্যাগটিকে OptimizedImage দিয়ে পরিবর্তন করুন */}
        {publicId && (
          <OptimizedProductImage
            className='hover:scale-110 transition ease-in-out'
            publicId={publicId}
            width={390}
            height={450}
            name={name}
          />
        )}
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency} {price}</p>
    </Link>
  );
};

export default ProductItem;