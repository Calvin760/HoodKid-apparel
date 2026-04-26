import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetterBox from '../components/NewsLetterBox'
import FreshDrop from '../components/FreshDrop'
import Headwear from '../components/Headwear'

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
      <Headwear />
      <FreshDrop/>
      
      {/* <OurPolicy/> */}
      {/* <NewsLetterBox/> */}
    </div>
  )
}

export default Home