import React from 'react'
import Banner from './Banner'
import Topsellers from './Topsellers'
import Recommened from './Recommened'
import News from './News'
const Home = () => {
  return (
    <div>
        <Banner/>
        <Topsellers/>
        <Recommened/>
        <News/>
    </div>
  )
}

export default Home
