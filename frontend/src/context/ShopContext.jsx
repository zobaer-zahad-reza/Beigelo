// src/context/ShopContext.jsx
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "৳ ";
  const delivery_fee = 80;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null); // store logged-in user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  const navigate = useNavigate();

  // ----------------- Cart & Product Functions -----------------

  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) setProducts(res.data.products);
      else toast.error(res.data.message);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const getUserCart = async () => {
    if (!token || !user) return;
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) setCartItems(res.data.cartData);
      else toast.error(res.data.message);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const addToCart = async (itemId, size = "default") => {
    if (!user) return toast.error("Please login first");

    let cartData = structuredClone(cartItems);
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    setCartItems(cartData);

    try {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { userId: user._id, itemId, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    if (!user) return toast.error("Please login first");

    let cartData = structuredClone(cartItems);
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    try {
      await axios.post(
        `${backendUrl}/api/cart/update`,
        { userId: user._id, itemId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const getCartCount = () => {
    let count = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        count += cartItems[itemId][size] || 0;
      }
    }
    return count;
  };

  const getCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (!product) continue;
      for (const size in cartItems[itemId]) {
        total += product.price * cartItems[itemId][size];
      }
    }
    return total;
  };

  // ----------------- Effects -----------------

  useEffect(() => {
    getProductsData();
  }, []);

  // Load user & cart from token
  useEffect(() => {
    const loadUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setUser(res.data.user);
          setName(res.data.user.name);
          setEmail(res.data.user.email);
          setAvatar(res.data.user.avatar);
          getUserCart(); // fetch cart from DB
        } else {
          setToken("");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        console.log(err);
        setToken("");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    loadUser();
  }, [token]);

  // ----------------- Context Value -----------------

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    user,
    name,
    setName,
    email,
    setEmail,
    avatar,
    setAvatar,
    getUserCart,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
