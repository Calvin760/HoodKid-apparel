import React, { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Product from './pages/Product'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import WishList from './pages/WishList'
import Account from './pages/Account'
import Sales from './pages/Sales'
import Admin from './pages/Admin'
import AdminOrders from './pages/AdminOrders'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import Profile from './pages/Profile'

import Navbar from './components/Navbar'
import TopBar from './components/TopBar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ScrollToTop from './components/ScrollToTop'
import AdminRoute from './components/AdminRoute'

import './index.css'
import { ToastContainer } from 'react-toastify'

const App = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'

  /* ================= CLEAN CLERK REDIRECT URLS ================= */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const hasAuthParams =
      params.has("code") ||
      params.has("id")

    if (hasAuthParams) {
      // clean URL after Clerk redirect
      navigate(window.location.pathname, { replace: true })
    }
  }, [navigate])

  return (
    <div>

      {/* ================= TOP BAR ================= */}
      <ToastContainer />
      <TopBar />

      {/* ================= NAVBAR ================= */}
      <div className='sticky top-0 z-50 bg-white px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Navbar />
        <SearchBar />
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <div className={isHome ? '' : 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'}>
        <ScrollToTop />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/profile' element={<Profile />} />

          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/wishlist' element={<WishList />} />
          <Route path='/account' element={<Account />} />
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

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  )
}

export default App