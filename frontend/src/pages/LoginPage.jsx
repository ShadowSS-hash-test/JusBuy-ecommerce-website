import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '../stores/useUserStore';

const LoginPage = () => {
const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
 const {loading,login} = useUserStore()

  const handleSubmit = (e) => {
    e.preventDefault();
     login(formData)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-center text-3xl font-extrabold text-black mb-6">
         Login to your Account
        </h2>
      </motion.div>

      <motion.div
        className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
       

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email address
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400" />
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black text-black"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400" />
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black text-black"
              />
            </div>
          </div>

         

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-black rounded-md text-black hover:bg-black hover:text-white transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
               Login
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-black hover:underline flex items-center justify-center"
          >
            Signup here <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage