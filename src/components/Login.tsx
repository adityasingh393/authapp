import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = state.users.find(u => u.email === email && u.password === password);
    console.log('Attempting login with email:', email, 'and password:', password);
    console.log('All users:', state.users);
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
      console.log('Logged in user:', user);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(`/profile/${user.uid}`);
      }
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className='container'>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email*:</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password*:</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={()=>{navigate('/')}}>goto register</button>
    </div>

  );
};

export default Login;
