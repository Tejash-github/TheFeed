// components/Header.js
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Header = () => {
  const [user, setUser ] = useState(null);

  useEffect(() => {
      const storedUser  = localStorage.getItem('user');
      if (storedUser ) {
        setUser (JSON.parse(storedUser));

      const interval = setInterval(() => {
        window.location.reload();
      }, 60000);

      return () => clearInterval(interval);
    }

    

    const fetchUser = async () =>{
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const userData = await fetch('/api/iser?id=${user._id');
        const userInfo = await userData.json();
        setUser (JSON.parse(storedUser));
      }
    };

    fetchUser ();
 }, []);

  const handleProfileClick = () => {
    if (user) {
      // Redirect to profile page if logged in
      window.location.href = '/myprofile'; // Change this to your profile page path
    } else {
      // Redirect to login page if not logged in
      window.location.href = '/login'; // Change this to your login page path
    }
  };

  
  return (
    <header className="header">
      <div className="header-container">
        <div className="nav-left">
          <Link href="/">Home</Link>
          <Link href="./explore">Explore</Link>
          <Link href="/create-post">Post</Link>
          <div className="divider"></div>
        </div>
        <div className="logo">
          <img src="/logo.png" alt="Logo" /> {/* Adjust width and height as needed */}
        </div>
        <div className="nav-right">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="#">Nothing</Link>
          <div className="divider"></div>
        </div>
        <div className="profile-pic" onClick={handleProfileClick}>
          <img
            src={user ? user.profilePicture : './default-profile.png'} // Default image if not logged in
            alt="Profile"
            className="profile-image"
          />
        </div>
      </div>

      
    </header>
  );
};

export default Header;