import React from 'react'
import BannerImg from '../../assets/banner.png'; 

// define hero section of the home page
const Banner = () => {
  return (
    <div className='flex flex-col md:flex-row-reverse py-16 items-center justify-between gap-12'>
        <div className='md:w-1/2 w-full flex items-center md:justify-end'>
               {/* Banner image */}
              <img src={BannerImg} alt=""/>
       </div>
      
       <div className='md:w-1/2 w-full '>
          <h1 className='md:text-5xl text-2xl font-medium mb-7'>New Arrives This Week</h1>
          <p className='mb-10'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quia, optio cumque, qui repellendus ad ducimus necessitatibus, voluptas tempora voluptatibus magnam reiciendis?
             Deserunt beatae incidunt, sequi excepturi amet laborum autem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio temporibus facere dignissimos, iusto quod a placeat porro dolore iure ipsam rerum,
             velit labore adipisci sequi ratione soluta excepturi impedit! A.</p>
       
            <button className='btn- bg-primary  px-12 py-2 rounded-md text-base font-secondary font-bold hover:bg-secondary hover:text-white transition-all duration-200 cursor-pointer'>Subscribe</button>
       </div>
       
      
    </div>

  )
}

export default Banner
