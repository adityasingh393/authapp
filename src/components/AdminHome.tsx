import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { User } from '../types/User';

const AdminHome: React.FC = () => {
  const { state, editUser } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editData, setEditData] = useState<{ [key: string]: Partial<User> }>({});

  const handleEdit = (uid: string) => {
    setEditMode({ ...editMode, [uid]: true });
    const user = state.users.find(user => user.uid === uid);
    if (user) {
      setEditData({ ...editData, [uid]: user });
    }
  };

  const handleSave = async (uid: string) => {
    const updatedUser = { ...editData[uid] } as User;
    await editUser(updatedUser);
    setEditMode({ ...editMode, [uid]: false });
  };

  const handleChange = (uid: string, field: keyof User, value: string) => {
    setEditData({
      ...editData,
      [uid]: { ...editData[uid], [field]: value },
    });
  };

  return (
    <div className='container'>
      <h2>Admin Home</h2>
      <ol>
        {state.users.map(user => (
          <li key={user.uid}>
            <div>
              <span>Name: </span>
              {editMode[user.uid] ? (
                <input
                  type="text"
                  value={editData[user.uid]?.name || ''}
                  onChange={(e) => handleChange(user.uid, 'name', e.target.value)}
                />
              ) : (
                <span>{user.name}</span>
              )}
            </div>
            <div>
              <span>Email: </span>
              {editMode[user.uid] ? (
                <input
                  type="email"
                  value={editData[user.uid]?.email || ''}
                  onChange={(e) => handleChange(user.uid, 'email', e.target.value)}
                />
              ) : (
                <span>{user.email}</span>
              )}
            </div>
            <div>
              <span>Role: </span>
              {editMode[user.uid] ? (
                <select
                  value={editData[user.uid]?.role || ''}
                  onChange={(e) => handleChange(user.uid, 'role', e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <span>{user.role}</span>
              )}
            </div>
            <div>
              {editMode[user.uid] ? (
                <button  className="button" onClick={() => handleSave(user.uid)}>Save</button>
              ) : (
                <button  className="button" onClick={() => handleEdit(user.uid)}>Edit</button>
              )}
              <button  className="button" onClick={() => navigate(`/profile/${user.uid}`)}>View Profile</button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default AdminHome;
