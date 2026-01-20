import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import popUpImg from "../assets/popImg.jpg"

const NewsletterModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('beigeloPopupSeen');

    if (!hasSeenPopup) {

      const timer = setTimeout(() => {
        setShowModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);

    localStorage.setItem('beigeloPopupSeen', 'true');
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      
      <div className="relative w-full max-w-xl bg-transparent rounded-xl overflow-hidden shadow-2xl">
        
        {/* Top Right Cross Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 bg-white/80 text-gray-800 rounded-full p-2 hover:bg-white hover:text-red-600 transition-all duration-300 shadow-sm"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <Link to={'/collection'}>
        <img 
          src={popUpImg}
          alt="Beigelo First Visit Offer"
          className="w-full h-auto object-cover block hover:scale-105 transition-transform duration-700 "
          // চাইলে ইমেজে ক্লিক করলেও মডাল বন্ধ হওয়ার অপশন রাখতে পারেন নিচের লাইনটি আনকমেন্ট করে:
          // onClick={handleClose}
        />
        </Link>
        
      </div>
    </div>
  );
};

export default NewsletterModal;