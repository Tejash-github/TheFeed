// pages/create-post.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CreatePost = () => {
  const [user, setUser ] = useState(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser  = localStorage.getItem('user');
    if (storedUser ) {
      setUser (JSON.parse(storedUser ));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        author: user.name,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      }),
    });

    if (res.ok) {
      const newPost = await res.json();
      console.log('Post created:', newPost);
      router.push('/'); 
    } else {
      const errorData = await res.json();
      console.error('Failed to create post:', errorData);
      alert('Failed to create post: ' + errorData.message);
    }
  };

  return (
    <div>
      <Header />
      <main className="main-content">
        <h2 className="welcome-title">Create a New Post</h2>
        <form onSubmit={handleSubmit} className="post-form">
          <label className='form-label'>Title</label>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className='form-input'
          />

          <label className='form-label'>Content</label>
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='form-input'
            required
          />

          <label className='form-label'>Tags</label>
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className='form-input'
          />
          <button type="submit">Submit</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CreatePost;