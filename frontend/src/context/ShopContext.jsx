import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const currency = "৳ ";
  const delivery_fee = 80;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  const navigate = useNavigate();

  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const getUserCart = async (userToken) => {
    if (!userToken) return;
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (res.data.success) {
        setCartItems(res.data.cartData);
      }
    } catch (err) {
      console.error("Error fetching user cart:", err);
    }
  };

  const addToCart = async (itemId, size = "default") => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please login to add items to the cart!",
      });
      // toast.error("Please login to add items to the cart");
      navigate("/login");
      return;
    }
    setCartItems((prev) => {
      const itemInfo = prev[itemId] || {};
      const newQuantity = (itemInfo[size] || 0) + 1;
      return { ...prev, [itemId]: { ...itemInfo, [size]: newQuantity } };
    });
    try {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update cart!",
      });
      toast.error("Failed to update cart");
    }
  };

  // Buy Now
  const buyNow =() => {}

  const updateQuantity = async (itemId, size, quantity) => {
    if (!token) return;
    setCartItems((prev) => {
      const itemInfo = prev[itemId] || {};
      const updatedItemInfo = { ...itemInfo, [size]: quantity };
      if (quantity <= 0) {
        delete updatedItemInfo[size];
      }
      return { ...prev, [itemId]: updatedItemInfo };
    });
    try {
      await axios.post(
        `${backendUrl}/api/cart/update`,
        { itemId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
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
      if (product) {
        for (const size in cartItems[itemId]) {
          total += product.price * cartItems[itemId][size];
        }
      }
    }
    return total;
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      if (token) {
        try {
          const res = await axios.get(`${backendUrl}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.success) {
            const fetchedUser = res.data.user;
            setUser(fetchedUser);
            setName(fetchedUser.name);
            setEmail(fetchedUser.email);
            setAvatar(fetchedUser.avatar);
            await getUserCart(token);
          } else {
            localStorage.removeItem("token");
            setToken("");
            setUser(null);
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          setToken("");
          setUser(null);
        }
      }
    };
    loadUserData();
  }, [token]);

  const contextValue = {
    products,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    currency,
    delivery_fee,
    backendUrl,
    token,
    setToken,
    user,
    setUser,
    name,
    setName,
    email,
    setEmail,
    avatar,
    setAvatar,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    navigate,
    getUserCart,
    buyNow,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;