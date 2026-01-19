import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const currency = "৳ ";
  const delivery_fee = 80;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  // User Profile Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  // Search Functionality States
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Buy Now Logic with Session Storage
  const [buyNowItem, setBuyNowItem] = useState(() => {
    const storedItem = sessionStorage.getItem("buyNowItem");
    try {
      return storedItem ? JSON.parse(storedItem) : null;
    } catch (error) {
      console.error("Failed to parse buyNowItem from sessionStorage", error);
      sessionStorage.removeItem("buyNowItem");
      return null;
    }
  });

  const navigate = useNavigate();

  const updateBuyNowItem = (item) => {
    if (item) {
      sessionStorage.setItem("buyNowItem", JSON.stringify(item));
      setBuyNowItem(item);
    } else {
      sessionStorage.removeItem("buyNowItem");
      setBuyNowItem(null);
    }
  };

  // Fetch All Products
  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    }
  };

  // Fetch Cart Data
  const getUserCart = async (userToken) => {
    if (!userToken) return;
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } },
      );
      if (res.data.success) {
        setCartItems(res.data.cartData);
      }
    } catch (err) {
      console.error("Error fetching user cart:", err);
    }
  };

  // Add to Cart Function
  const addToCart = async (itemId, size) => {
    // if (!size) {
    //   toast.error("Please Select Product Size");
    //   return;
    // }

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login to add items to the cart!",
      });
      navigate("/login");
      return;
    }

    const productToAdd = products.find((product) => product._id === itemId);

    // Google Analytics / Data Layer Event
    if (productToAdd) {
      const priceToTrack =
        productToAdd.offerPrice &&
        productToAdd.offerPrice > 0 &&
        productToAdd.offerPrice < productToAdd.price
          ? productToAdd.offerPrice
          : productToAdd.price;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: "BDT",
          value: priceToTrack,
          items: [
            {
              item_id: itemId,
              item_name: productToAdd.name,
              price: priceToTrack,
              quantity: 1,
              variant: size,
            },
          ],
        },
      });
    }

    // Optimistic UI Update
    setCartItems((prev) => {
      const itemInfo = prev[itemId] || {};
      const newQuantity = (itemInfo[size] || 0) + 1;
      return { ...prev, [itemId]: { ...itemInfo, [size]: newQuantity } };
    });

    try {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Item added to cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to update cart");
    }
  };

  // Buy Now Function
  const buyNow = (itemId, size) => {
    // if (!size) {
    //   toast.error("Please Select Product Size");
    //   return;
    // }

    const product = products.find((p) => p._id === itemId);
    if (product) {
      const finalPrice =
        product.offerPrice &&
        product.offerPrice > 0 &&
        product.offerPrice < product.price
          ? product.offerPrice
          : product.price;

      const itemToBuy = {
        ...product,
        price: finalPrice,
        originalPrice: product.price,
        quantity: 1,
        size: size,
      };
      updateBuyNowItem(itemToBuy);
      navigate("/place-order");
    } else {
      console.error("Product not found for Buy Now:", itemId);
      toast.error("Product not found.");
    }
  };

  // Update Cart Quantity
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // Get Total Count of Items in Cart
  const getCartCount = () => {
    let count = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        try {
          if (cartItems[itemId][size] > 0) {
            count += cartItems[itemId][size];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return count;
  };

  // Get Total Amount
  const getCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        const priceToUse =
          product.offerPrice &&
          product.offerPrice > 0 &&
          product.offerPrice < product.price
            ? product.offerPrice
            : product.price;

        for (const size in cartItems[itemId]) {
          try {
            if (cartItems[itemId][size] > 0) {
              total += priceToUse * cartItems[itemId][size];
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
    return total;
  };

  // Initial Load
  useEffect(() => {
    getProductsData();
  }, []);

  // User Profile & Cart Load
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
    buyNowItem,
    setBuyNowItem: updateBuyNowItem,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
