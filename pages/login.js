// pages/login.js
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const user = await res.json();
      localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage
      router.push('/'); // Redirect to home page
    } else {
      const errorData = await res.json();
      setError(errorData.message || 'Invalid credentials');
    }
  };

  return (
    <div>
      <Head>
        <title>The Feed || Login</title>
        <meta name="description" content='A Blogging Platform'></meta>
        </Head>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Slab:wght@100..900&display=swap');
          </style><Header />
    
    <div className='main-content'>
      <h2 className='welcome-title'>Login</h2>
      {error && <p className='error-message'>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label className='form-label'>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='form-input'
          />
        </div>
        <div>
          <label className='form-label'>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='form-input'
          />
        </div>
        <button type="submit" className='button'>Login</button>
        <label className='join-label'>Don't Have an Account? <a href='/register'>Join us Here</a></label>
      </form>
    </div>
    <Footer />
    </div>
  );
};





export default Login;