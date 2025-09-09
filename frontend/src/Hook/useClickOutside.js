// src/hooks/useClickOutside.js
import { useEffect, useRef } from 'react';

const useClickOutside = (handler) => {
  const domNodeRef = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      // যদি রেফারেন্স করা নোড এবং তার ভেতরের কোনো অংশে ক্লিক না হয়...
      if (domNodeRef.current && !domNodeRef.current.contains(event.target)) {
        handler(); // তাহলে পাস করা ফাংশনটি (setVisible(false)) কল করো
      }
    };

    // ইভেন্ট লিসেনার যোগ করা হচ্ছে
    document.addEventListener('mousedown', maybeHandler);

    // কম্পোনেন্ট আনমাউন্ট হলে ইভেন্ট লিসেনার রিমুভ করা হচ্ছে
    return () => {
      document.removeEventListener('mousedown', maybeHandler);
    };
  }, [handler]);

  return domNodeRef;
};

export default useClickOutside;