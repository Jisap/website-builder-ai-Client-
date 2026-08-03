import React, { useState } from 'react'
import LoginLeft from '../components/LoginLeft';
import { Link } from 'react-router-dom';

const AuthPage = ({ mode }) => {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
            {/* Si estamos en /register mostramos el nombre */}
            {!isLogin && (
              <div>
                <label className='block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2'>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='John Doe'
                  required
                  className='w-full pl-2 py-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm
                   text-zinc-900 bg-transparent placeholder-zinc-300 transition-colors'
                />
              </div>
            )}

            <div>
              <label className='block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2'>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@example.com'
                required
                className='w-full pl-2 py-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm
                   text-zinc-900 bg-transparent placeholder-zinc-300 transition-colors'
              />
            </div>

            <div>
              <label className='block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2'>
                Password
              </label>
              <input
                type={showPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='********'
                required
                className='w-full pl-2 py-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm
                   text-zinc-900 bg-transparent placeholder-zinc-300 transition-colors'
              />
            </div>
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