import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import { toast } from "react-toastify";
import Swal from 'sweetalert2'

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod');
    const {
        navigate,
        backendUrl,
        token,
        cartItems,
        setCartItems,
        getCartAmount,
        products,
        currency,
        buyNowItem,
        setBuyNowItem
    } = useContext(ShopContext);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    });

    const delivery_fee = formData.city === "" ? 0 : formData.city === "Dhaka" ? 80 : 120;
    const [isOrdering, setIsOrdering] = useState(false);

    const isBuyNowMode = buyNowItem !== null;

    const subtotal = isBuyNowMode
        ? buyNowItem.price * buyNowItem.quantity
        : getCartAmount();
    // (subtotal > 0 ? delivery_fee : 0)
    const total = subtotal + delivery_fee;

    useEffect(() => {
        if (!isBuyNowMode && getCartAmount() === 0 && !isOrdering) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Your cart is empty.`,
            });
            navigate('/cart');
        }
    }, [isBuyNowMode, getCartAmount, isOrdering, navigate]);


    const cartItemsList = Object.entries(cartItems).flatMap(([itemId, sizes]) => {
        const productData = products.find(p => p._id === itemId);
        if (!productData) return [];
        return Object.entries(sizes).map(([size, quantity]) => {
            if (quantity <= 0) return null;
            return {
                productData: productData,
                size: size,
                quantity: quantity,
                _id: itemId
            };
        }).filter(Boolean);
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsOrdering(true);

        let orderItems = [];
        if (isBuyNowMode) {
            orderItems.push(buyNowItem);
        } else {
            if (!token) {
                toast.error("You must be logged in to order from cart.");
                setIsOrdering(false);
                navigate("/login");
                return;
            }
            orderItems = cartItemsList.map(item => ({
                ...item.productData,
                quantity: item.quantity,
                size: item.size
            }));
        }

        if (orderItems.length === 0) {
            toast.error("There are no items to order.");
            setIsOrdering(false);
            navigate('/');
            return;
        }

        const orderData = {
            address: formData,
            items: orderItems,
            amount: total
        };

        const headersConfig = { headers: {} };
        if (token) {
            headersConfig.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            switch (method) {
                case 'cod': {
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, headersConfig);
                    if (response.data.success) {
                        if (isBuyNowMode) {
                            setBuyNowItem(null);
                        } else {
                            setCartItems({});
                        }
                        Swal.fire({
                            title: "Order Placed Successfully!",
                            icon: "success",
                            draggable: false
                        });

                        if (token) {
                            navigate('/orders');
                        } else {
                            navigate('/');
                        }

                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `${response.data.message}`,
                        });
                        setIsOrdering(false);
                    }
                    break;
                }
                case 'stripe': {
                    const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, headersConfig);
                    if (responseStripe.data.success) {
                        if (isBuyNowMode) {
                            setBuyNowItem(null);
                        } else {
                            setCartItems({});
                        }
                        const { session_url } = responseStripe.data;
                        window.location.replace(session_url);
                    } else {
                        toast.error(responseStripe.data.message);
                        setIsOrdering(false);
                    }
                    break;
                }
                case 'bkash': {
                    const responseBkash = await axios.post(backendUrl + '/api/order/bkash', orderData, headersConfig);
                    if (responseBkash.data.success) {
                        if (isBuyNowMode) {
                            setBuyNowItem(null);
                        } else {
                            setCartItems({});
                        }
                        const { session_url } = responseBkash.data;
                        window.location.replace(session_url);
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `${responseBkash.data.message}`,
                        });
                        setIsOrdering(false);
                    }
                    break;
                }
                default:
                    setIsOrdering(false);
                    break;
            }
        } catch (error) {
            console.error("Order placement error:", error);
            toast.error(error.response?.data?.message || "Something went wrong.");
            setIsOrdering(false);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

            {/*-------Left Side-------*/}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First Name' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last Name' />
                </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email Address' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                    <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                </div>
                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Phone' />
            </div>

            {/*-------Right Side-------*/}
            <div className='mt-8'>
                <div className='mt-8 min-w-80'>
                    <Title text1={'REVIEW YOUR'} text2={'ITEMS'} />
                    <div className='flex flex-col gap-2 my-4 max-h-60 overflow-y-auto pr-2'>
                        {isBuyNowMode && buyNowItem ? (
                            <div className="py-4 border-t border-b text-gray-700 flex items-center gap-4">
                                <img
                                    className="w-16 sm:w-20 rounded"
                                    src={buyNowItem.image[0]}
                                    alt={buyNowItem.name}
                                />
                                <div className="flex-1">
                                    <p className="text-lg font-bold">
                                        {buyNowItem.name}
                                    </p>
                                    <div className="flex items-center gap-5 mt-2 text-sm">
                                        <p>{currency}{buyNowItem.price}</p>
                                        <p className="px-2 py-1 border bg-slate-50 rounded">{buyNowItem.size}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-gray-600">Qty: {buyNowItem.quantity}</p>
                            </div>
                        ) : (
                            cartItemsList.map((item, index) => (
                                <div key={index} className="py-4 border-t border-b text-gray-700 flex items-center gap-4">
                                    <img
                                        className="w-16 sm:w-20 rounded"
                                        src={item.productData.image[0]}
                                        alt={item.productData.name}
                                    />
                                    <div className="flex-1">
                                        <p className="text-lg font-bold">
                                            {item.productData.name}
                                        </p>
                                        <div className="flex items-center gap-5 mt-2 text-sm">
                                            <p>{currency}{item.productData.price}</p>
                                            <p className="px-2 py-1 border bg-slate-50 rounded">{item.size}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-gray-600">Qty: {item.quantity}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className='flex flex-col gap-4 mt-8'>
                        <Title text1={'ORDER'} text2={'SUMMARY'} />
                        <hr className='mt-2' />
                        <div className='flex justify-between'>
                            <p>Subtotal</p>
                            <p>{currency}{subtotal}</p>
                        </div>
                        <hr />
                        <div className='flex justify-between'>
                            <p>Delivery Fee</p>
                            <p>{currency}{subtotal > 0 ? delivery_fee : 0}</p>
                        </div>
                        <hr />
                        <div className='flex justify-between font-bold text-lg'>
                            <p>Total</p>
                            <p>{currency}{total}</p>
                        </div>
                    </div>
                </div>
                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('bkash')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'bkash' ? 'bg-green-400' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.bkash_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>
                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder;