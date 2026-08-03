import React from 'react'
import LoginLeft from '../components/LoginLeft';

const AuthPage = ({ mode }) => {

  const isLogin = mode === 'login';

  return (
    <div className='min-h-screen bg-white flex text-zinc-900 font-sans'>
      {/* Left Panel - Branding */}
      <LoginLeft />

      {/* Right Panel - Form  */}
    </div>
  )
}

export default AuthPage