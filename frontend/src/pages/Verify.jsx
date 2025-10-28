import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Verify = () => {

  const { navigate, token, setCartItems, backendUrl, setBuyNowItem } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {

      const headersConfig = { headers: {} };
      if (token) {

        headersConfig.headers['Authorization'] = `Bearer ${token}`; 
      }

      const response = await axios.post(
        backendUrl + "/api/order/verifyStripe",
        { success, orderId },
        headersConfig
      );

      if (response.data.success) {
        toast.success(response.data.message || "Payment Verified!");
        
        setCartItems({});
        setBuyNowItem(null);
        

        if (token) {
          navigate("/orders");
        } else {
          navigate("/");
        }

      } else {
        toast.error(response.data.message || "Payment Failed");
        
        if (token) {
          navigate("/cart");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Verification Failed");
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className='min-h-[80vh] flex flex-col justify-center items-center gap-4'>
        <div className='w-16 h-16 border-4 border-dashed border-gray-400 rounded-full animate-spin'></div>
        <p className='text-gray-600'>Verifying your payment, please wait...</p>
    </div>
  );
};

export default Verify;