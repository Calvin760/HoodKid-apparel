import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Product from './pages/Product'
// import Login from './pages/Login'
// import Register from './pages/Register'

import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import './index.css'
import WishList from './pages/WishList'
import TopBar from './components/TopBar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import Account from './pages/Account'
import Sales from './pages/Sales'
import Admin from './pages/Admin'
import AdminRoute from './components/AdminRoute'
import AdminOrders from './pages/AdminOrders'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import ScrollToTop from './components/ScrollToTop'
import { ClerkProvider } from "@clerk/clerk-react";
import Login from './pages/SignIn'
import Register from './pages/SignUp'
import Profile from './pages/Profile'


const App = () => {

  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    // <ClerkProvider publishableKey={clerkPubKey}>
    <div>
      <div>
        <ToastContainer/>
        <TopBar />
      </div>
      {/* ✅ Navbar ALWAYS padded (consistent everywhere) */}
      <div className='sticky top-0 z-50 bg-white px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        
        <Navbar />
        <SearchBar />
      </div>

      {/* ✅ Only content changes */}
      <div className={isHome ? '' : 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'}>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          {/* <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} /> */}

          {/* <Route path='/signin' element={<Login />} />
          <Route path='/signup' element={<Register />} /> */}
          <Route path="/profile" element={<Profile />} />

          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/wishlist' element={<WishList />} />
          <Route path='/account' element={<Account/>} />
          <Route path='/sales' element={<Sales />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/cancel" element={<PaymentFailed />} />
        </Routes>
      </div>
    <Footer/>
    </div>
    // </ClerkProvider>
  )
}

export default App