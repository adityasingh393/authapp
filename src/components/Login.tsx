import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import '../App.css';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

const Login: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });
  const navigate = useNavigate();
  const { state, dispatch, setLoading, loading } = useAuth();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setLoading(true);
    setTimeout(() => {
      const user = state.users.find(u => u.email === data.email && u.password === data.password);
      if (user) {
        dispatch({ type: 'LOGIN', payload: user });
        setLoading(false);
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(`/profile/${user.uid}`);
        }
      } else {
        setLoading(false);
        alert('Invalid email or password');
      }
    }, 2000);
  };

  return (
    <div className='container'>
      {loading && <Loader />}
      {!loading && (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <button className="button" type="submit">Login</button>
          </form>
          <button className='button' onClick={() => navigate('/')}>Go to Register</button>
        </>
      )}
    </div>
  );
};

export default Login;
