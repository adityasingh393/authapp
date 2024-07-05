import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { User } from '../types/User';
import Loader from './Loader';
import '../App.css';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type FormData = {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};


const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
    .required('Password is required'),
  role: yup
    .string()
    .oneOf(['user', 'admin'], 'Invalid role')
    .required('Role is required'),
});


const Register: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });
  const navigate = useNavigate();
  const { state, dispatch, updateUsers, loading, setLoading } = useAuth();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    const newUser: User = { uid: uuidv4(), ...data };
    const updatedUsers = [...state.users, newUser];
    setTimeout(async () => {
      await updateUsers(updatedUsers);
      dispatch({ type: 'REGISTER', payload: newUser });
      console.log('Registered user:', newUser);
      console.log('All users:', state.users);
      setLoading(false);
      navigate('/login');
    }, 2000);
  };

  return (
    <div className='container'>
      {loading && <Loader />}
      {!loading && (
        <>
          <h2>Register</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Name*:</label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => <input {...field} />}
              />
              {errors.name && <span>{errors.name.message}</span>}
            </div>
            <div>
              <label>Email*:</label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => <input type="email" {...field} />}
              />
              {errors.email && <span>{errors.email.message}</span>}
            </div>
            <div>
              <label>Password*:</label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => <input type="password" {...field} />}
              />
              {errors.password && <span>{errors.password.message}</span>}
            </div>
            <div>
              <label>Role*:</label>
              <Controller
                name="role"
                control={control}
                defaultValue="user"
                render={({ field }) => (
                  <select {...field}>
                    
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
              />
              {errors.role && <span>{errors.role.message}</span>}
            </div>
            <button  className="button" type="submit">Register</button>
          </form>
          <button className='button' onClick={() => { navigate('/login') }}>Go To Login</button>
        </>
      )}
    </div>
  );
};

export default Register;
