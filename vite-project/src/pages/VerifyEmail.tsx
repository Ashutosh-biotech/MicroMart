import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LuCircleCheckBig, LuCircleX, LuLoader } from 'react-icons/lu';
import { authService } from '../api/services/auth.services';
import { usePageTitle } from '../redux/hooks/usePageTitle';
import URLS from '../utils/URLS';

export const VerifyEmail: React.FC = () => {
  usePageTitle('Verify Email');
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    console.log(token);
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data || 'Verification failed. The link may be expired or invalid.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center"
      >
        {status === 'loading' && (
          <>
            <LuLoader className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h2>
            <p className="text-gray-600">Please wait while we verify your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <LuCircleCheckBig className="mx-auto mb-4 text-green-600" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to={URLS.SIGNIN}
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Sign In Now
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <LuCircleX className="mx-auto mb-4 text-red-600" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to={URLS.SIGNUP}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign Up Again
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};