// pages/admin.js
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { users } from '../data';

const AdminPanel = () => {
  const [user, setUser] = useState([null]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState([true]); 

  useEffect(() => {
    const fetchData = async () => {
      const usersResponse = await fetch('/api/users');
      const postsResponse = await fetch('/api/posts');
      const userData = await usersResponse.json();
      const postsData = await postsResponse.json();
      setUser(userData);
      setPosts(postsData);
    };
    const storedUser = localStorage.getItem('user');
    if (storedUser){
        setUser (JSON.parse(storedUser));
    } else {
        window.location.href = '/adminLogin';
    }

    const fetchUsers = async () => {
        try {
          const response = await fetch('/api/users');
          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }
          const data = await response.json();
          setUsers(data); 
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false); 
        }
      };

    fetchData(), fetchUsers();
  }, []);


  if (!Array.isArray(users)) {
    console.error('Users is not an array:', users);
    return <p>Error: Users data is not available.</p>;
  }

  const handleDeleteUser   = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/user/${id}`, {
          method: 'DELETE',
        });
        
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    setPosts(posts.filter(post => post._id !== postId));
  };



  return (
    <div>
      <Head>
        <title>Admin Panel</title>
        <meta name="description" content="Admin panel for managing users and posts" />
      </Head>
      <Header />
      <main className="main-content">
        <h2>Admin Panel</h2>
        <h3>Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} - {user.email}
              <button onClick={() => handleDeleteUser (user._id)}>Delete</button>
            </li>
          ))}
        </ul>
        <h3 > Posts</h3>
        <ul>
          {posts.map(post => (
            <li key={post._id}>
              {post.title}
              <button onClick={() => handleDeletePost(post._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;