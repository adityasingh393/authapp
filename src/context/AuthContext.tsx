import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { useLocalForage } from '../hooks/useLocalForage';
import { User } from '../types/User';

type AuthState = {
  users: User[];
  currentUser: User | null;
};

type AuthAction =
  | { type: 'REGISTER'; payload: User }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_CURRENT_USER'; payload: User | null };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  updateUsers: (users: User[]) => Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}>({
  state: { users: [], currentUser: null },
  dispatch: () => null,
  updateUsers: async () => {},
  setLoading: () => {},
  loading: false,
});

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'REGISTER':
      return { ...state, users: [...state.users, action.payload] };
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [storedUsers, setStoredUsers] = useLocalForage<User[]>('users', []);
  const [state, dispatch] = useReducer(authReducer, {
    users: [],
    currentUser: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch({ type: 'SET_USERS', payload: storedUsers });
  }, [storedUsers]);

  const updateUsers = async (users: User[]) => {
    setLoading(true);
    setTimeout(async () => {
      await setStoredUsers(users);
      dispatch({ type: 'SET_USERS', payload: users });
      setLoading(false);
    }, 2000);
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, updateUsers, setLoading, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
