import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';
import { User } from '../types/User';

const Profile: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const { state, editUser } = useAuth();
  const user = state.users.find(u => u.uid === uid);
  const currentUser = state.currentUser;

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (!user || (currentUser.role !== 'admin' && currentUser.uid !== user.uid)) {
    navigate('/login');
    return null;
  }

  const handleChange = (field: keyof User, value: string) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    const updatedUser = { ...user, ...editData } as User;
    await editUser(updatedUser);
    setEditMode(false);
  };

  return (
    <div className='container'>
      <h2>Profile</h2>
      <div>
        <span>Name: </span>
        {editMode ? (
          <input
            type="text"
            value={editData.name || user.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        ) : (
          <span>{user.name}</span>
        )}
      </div>
      <div>
        <span>Email: </span>
        {editMode ? (
          <input
            type="email"
            value={editData.email || user.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        ) : (
          <span>{user.email}</span>
        )}
      </div>
      <div>
        <span>Role: </span>
        {editMode ? (
          <select
            value={editData.role || user.role}
            onChange={(e) => handleChange('role', e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        ) : (
          <span>{user.role}</span>
        )}
      </div>
      {editMode ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button className="button" onClick={() => setEditMode(true)}>Edit</button>
      )}
    </div>
  );
};

export default Profile;
