
import { useEffect, useRef } from 'react';

const useClickOutside = (handler) => {
  const domNodeRef = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      if (domNodeRef.current && !domNodeRef.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', maybeHandler);
    return () => {
      document.removeEventListener('mousedown', maybeHandler);
    };
  }, [handler]);

  return domNodeRef;
};

export default useClickOutside;