// pages/register.js
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profilePicture: null,
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData({ ...formData, profilePicture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    const response = await fetch('/api/register', {
      method: 'POST',
      body: formDataToSend,
    });

    const data = await response.json();

    if (response.ok) {
      router.push('/login');
    } else {
      alert(`Registration failed: ${data.message}`);
    }
  };

  return (
    <div>
      <Head>
        <title>The Feed || Register</title>
        <meta name="description" content="A blogging platform" />
      </Head>
      <Header />
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Slab:wght@100..900&display=swap');
      </style>
      <main className='main-content'>
        <h2 className='welcome-title'>Register</h2>
        <form onSubmit={handleSubmit}>
          <label className='form-label'>Name</label>
          <input type="text" className='form-input' name="name" placeholder="Name" onChange={handleChange} required />
          <label className='form-label'>Email</label>
          <input type="email" className='form-input' name="email" placeholder="Email" onChange={handleChange} required />
          <label className='form-label'>Password</label>
          <input type="password" className='form-input' name="password" placeholder="Password" onChange={handleChange} required />
          <label className='form-label'>Upload your Profile Photo</label>
          <input type="file" className='form-input' name="profilePicture" onChange={handleChange} required />
          <button type="submit" className='button'>Register</button>
        </form>
        <label className='join-label'>Already Have an Account?<a href='/login'>Login Here</a></label>
      </main>
      {showOtpModal && (
        <OTPModal onClose={() => setShowOtpModal(false)} onVerify={handleVerifyOtp} />
      )}
      <Footer />
    </div>
  );
}