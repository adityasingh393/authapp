import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';
const AdminHome: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='container'>
      <h2>Admin Home</h2>
      <ol>
        {state.users.map(user => (
          <li key={user.uid}>
          <div>
          <span>Name: {user.name}</span>
            </div> 
            <div>
            <span>Email: {user.email}</span>
            </div>
            <div>
            <span>Role: {user.role}</span>
            </div>
            <div>

            <button onClick={() => navigate(`/profile/${user.uid}`)}>View Profile</button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default AdminHome;
