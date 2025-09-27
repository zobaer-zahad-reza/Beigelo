import React from 'react';
import { ClockLoader } from 'react-spinners';

const Spinner = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
      {/* <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div> */}
      <ClockLoader />
    </div>
  );
};

export default Spinner;