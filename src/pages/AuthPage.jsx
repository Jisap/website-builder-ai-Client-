import React, { useState } from 'react'
import LoginLeft from '../components/LoginLeft';
import { Link } from 'react-router-dom';

const AuthPage = ({ mode }) => {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  return (
    <div className='min-h-screen bg-white flex text-zinc-900 font-sans'>
      {/* Left Panel - Branding */}
      <LoginLeft />

      {/* Right Panel - Form  */}
      <div className='flex-1 flex items-center justify-center p-8'>
        <div className='w-full max-w-sm'>
          <div className='mb-10'>
            <h1 className='text-3xl font-medium transition-tight text-zinc-900 mb-1.5 font-sans'>
              {isLogin ? "Sign in" : "Create an account"}
            </h1>

            <p className='text-sm text-zinc-600 '>
              {isLogin ? "Enter your credentials to access your website builder." : "Get started by entering your registration details."}
            </p>
          </div>

          {error && (
            <div className='mb-6 p-3 border border-red-200 bg-red-50 text-red-700 text-xs rounded'>
              {error}
            </div>
          )}

          <form className='space-y-6'>

          </form>

          <p>
            {isLogin ? (
              <>
                New to BuilderAI?{" "}
                <Link to="/register" className='text-zinc-900 font-medium hover:underline'>
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/login" className='text-zinc-900 font-medium hover:underline'>
                  Sign in here
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage