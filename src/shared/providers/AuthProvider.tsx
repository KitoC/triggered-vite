import { createContext, useContext } from 'react';

const authContext = createContext({});

interface AuthProviderProps {
  children: JSX.Element;
}

const useAuth = () => useContext(authContext);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const value = {};

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export { useAuth };
export default AuthProvider;
