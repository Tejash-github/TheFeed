// pages/create-post.js
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CreatePost = () => {
  const [user, setUser ] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser  = localStorage.getItem('user');
    if (storedUser ) {
      setUser (JSON.parse(storedUser ));
    } else {
      router.push('/login'); // Redirect to login if not logged in
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, author: user.name }), // Use user's name as author
    });

    if (res.ok) {
      const newPost = await res.json();
      console.log('Post created:', newPost);
      router.push('/'); // Redirect to home or posts page after successful creation
    } else {
      console.error('Failed to create post');
    }
  };

  return (
    <div>
      <Head>
        <title>Create Post</title>
        <meta name="description" content="Create a new post" />
      </Head>
      <Header />
      <main className="main-content">
        <h2 className="welcome-title">Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="form-textarea"
              maxLength={2000}
            />
            <p>{content.length}/2000 characters</p>
          </div>
          <button type="submit" className="button">Create Post</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CreatePost;