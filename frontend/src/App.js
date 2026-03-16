import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Help from "./pages/Help";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminDashboard from "./pages/AdminDashboard";
import ShoppingCart from "./pages/ShoppingCart";
import AddressPage from "./pages/AddressPage";
import MyOrders from "./pages/MyOrders";
import Register from "./pages/Register";
import NotFoundPage from "./pages/NotFoundPage";
import ProductDetails from "./pages/ProductDetails";
import WishlistPage from "./pages/WishlistPage";
import AdminLogin from "./pages/AdminLogin";

function App() {

  /* GET LOGGED USER */
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser);

  /* CART PER USER */
  const [cart, setCart] = useState(
    storedUser
      ? JSON.parse(localStorage.getItem(`cart_${storedUser._id}`)) || []
      : []
  );

  /* WISHLIST PER USER */
  const [wishlist, setWishlist] = useState(
    storedUser
      ? JSON.parse(localStorage.getItem(`wishlist_${storedUser._id}`)) || []
      : []
  );

  /* LOAD FROM BACKEND WHEN USER LOGIN */
  useEffect(() => {
    const fetchUserData = async () => {

      const token = localStorage.getItem("token");

      if (token && user) {
        try {

          const res = await axios.get(
            "https://nexgen-yg2a.onrender.com/api/users/profile",
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (res.data.success) {

            if (res.data.data.cart) {
              setCart(res.data.data.cart);
              localStorage.setItem(
                `cart_${user._id}`,
                JSON.stringify(res.data.data.cart)
              );
            }

            if (res.data.data.wishlist) {
              setWishlist(res.data.data.wishlist);
              localStorage.setItem(
                `wishlist_${user._id}`,
                JSON.stringify(res.data.data.wishlist)
              );
            }

          }

        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      }
    };

    fetchUserData();

  }, [user]);

  /* SAVE CART */
  useEffect(() => {

    if (user) {
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(cart));
    }

    const token = localStorage.getItem("token");

    if (token && user) {

      axios.put(
        "https://nexgen-yg2a.onrender.com/api/users/sync-cart",
        { cart },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      ).catch(err => console.error("Cart sync failed", err));

    }

  }, [cart, user]);

  /* SAVE WISHLIST */
  useEffect(() => {

    if (user) {
      localStorage.setItem(`wishlist_${user._id}`, JSON.stringify(wishlist));
    }

    const token = localStorage.getItem("token");

    if (token && user) {

      axios.put(
        "https://nexgen-yg2a.onrender.com/api/users/sync-wishlist",
        { wishlist },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      ).catch(err => console.error("Wishlist sync failed", err));

    }

  }, [wishlist, user]);

  /* UPDATE CART QTY */
  const updateCartQuantity = (id, amount) => {

    setCart((prevCart) => {

      return prevCart.map((item) => {

        if (item._id === id) {

          const newQty = item.qty + amount;

          return {
            ...item,
            qty: newQty < 1 ? 1 : newQty
          };

        }

        return item;

      });

    });

  };

  /* REMOVE CART ITEM */
  const removeFromCart = (id) => {

    setCart((prevCart) =>
      prevCart.filter((item) => item._id !== id)
    );

  };

  /* ADD TO CART */
  const addToCart = (product) => {

    setCart((prevCart) => {

      const existing = prevCart.find(
        (item) => item._id === product._id
      );

      if (existing) {

        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );

      }

      return [...prevCart, { ...product, qty: 1 }];

    });

  };

  /* TOGGLE WISHLIST */
  const toggleWishlist = (product) => {

    setWishlist((prevWishlist) => {

      const exists = prevWishlist.find(
        (item) => item._id === product._id
      );

      if (exists) {

        return prevWishlist.filter(
          (item) => item._id !== product._id
        );

      }

      return [...prevWishlist, product];

    });

  };

  return (

    <BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      <Routes>

        <Route
          path="/"
          element={
            <HomePage
              cart={cart}
              addToCart={addToCart}
              updateCartQuantity={updateCartQuantity}
              setCart={setCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          }
        />

        <Route
          path="/products"
          element={
            <HomePage
              cart={cart}
              addToCart={addToCart}
              updateCartQuantity={updateCartQuantity}
              setCart={setCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetails
              cart={cart}
              setCart={setCart}
              addToCart={addToCart}
              updateCartQuantity={updateCartQuantity}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/help" element={<Help />} />

        <Route path="/admin-add" element={<AdminAddProduct />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route
          path="/cart"
          element={
            <ShoppingCart
              cart={cart}
              setCart={setCart}
              removeFromCart={removeFromCart}
              updateCartQuantity={updateCartQuantity}
            />
          }
        />

        <Route
          path="/wishlist"
          element={
            <WishlistPage
              cart={cart}
              addToCart={addToCart}
              updateCartQuantity={updateCartQuantity}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          }
        />

        <Route
          path="/address"
          element={
            <AddressPage
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route path="/orders" element={<MyOrders />} />

        <Route path="*" element={<NotFoundPage />} />

      </Routes>

    </BrowserRouter>

  );
}

export default App;
