import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Product from './pages/Product'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import './index.css'
import WishList from './pages/WishList'
import TopBar from './components/TopBar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {

  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
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
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/wishlist' element={<WishList />} />
        </Routes>
      </div>
    <Footer/>
    </div>
  )
}

export default App