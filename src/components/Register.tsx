import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { User } from '../types/User';
import '../App.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const navigate = useNavigate();
  const { state, dispatch, updateUsers } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = { uid: uuidv4(), name, email, password, role };
    const updatedUsers = [...state.users, newUser];
    await updateUsers(updatedUsers);
    dispatch({ type: 'REGISTER', payload: newUser });
    console.log('Registered user:', newUser);
    console.log('All users:', state.users);
    navigate('/login');
  };

  return (
    <div className='container'>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Name*:</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Email*:</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password*:</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Role*:</label>
          <select value={role} onChange={(e) => setRole(e.target.value as 'user' | 'admin')}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      <button onClick={()=>{navigate('/login')}}>Go To Login</button>
    </div>
  );
};

export default Register;
