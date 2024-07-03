import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Profile: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { state } = useAuth();
  const user = state.users.find(u => u.uid === uid);
  const currentUser = state.currentUser;

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (!user || (currentUser.role !== 'admin' && currentUser.uid !== user.uid)) {
    navigate('/login');
    return null;
  }

  return (
    <div className='container'>
      <h2>Profile</h2>
      <div>
        <label>Name:</label>
        <span>{user.name}</span>
      </div>
      <div>
        <label>Email:</label>
        <span>{user.email}</span>
      </div>
      <div>
        <label>Role:</label>
        <span>{user.role}</span>
      </div>
    </div>
  );
};

export default Profile;
