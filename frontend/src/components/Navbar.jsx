import React from 'react'

const Navbar = () => {
  return (
  <>
            <header className='max-w-screen-2x1 mx-auto px-4 py-6'>
                    <nav className='flex justify-between items-center'>
                    {/* left side dive */}
                        <div>
                            <Link to="/">Logo</Link>
                        </div>

                        {/* right side dive */}
                        <div>
                            nav items
                        </div>
                    </nav>
            </header>
  
  
  
  </>
  )
}

export default Navbar;
