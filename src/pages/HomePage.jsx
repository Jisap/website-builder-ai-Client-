import React from 'react'

const HomePage = () => {
  return (
    <div className='h-screen overflow-y-scroll text-white font-sans bg-[url("/bg-img.png")] bg-cover bg-center bg-no-repeat'>
      {/* Nav */}
      <nav className='sticky top-0 z-10 flex items-center justify-between px-6 py-4'>
        <div className='flex items-center gap-2'>
          <img
            src="/logo.svg"
            alt='logo'
            className='size-6'
          />

          <span className='text-xl font-semibold tracking-tight'>BuilderAI</span>
        </div>
      </nav>
    </div>
  )
}

export default HomePage