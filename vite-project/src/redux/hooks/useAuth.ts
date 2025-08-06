import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hook';
import { validateToken, logoutAsync } from '../slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, token, refreshToken, loading, error } = useAppSelector(state => state.auth);

  useEffect(() => {
    if ((token || refreshToken) && !isAuthenticated && !loading) {
      dispatch(validateToken());
    }
  }, [token, refreshToken, isAuthenticated, loading, dispatch]);

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    logout: handleLogout
  };
};