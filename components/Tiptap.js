// pages/create-post.js
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


const Tiptap = dynamic(() => import('../components/Tiptap'), { ssr: false });

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

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  return (
    <div>
      <main className="main-content">
        <h2 className="welcome-title">Create a New Post</h2>
        <form onSubmit={handleSubmit} className ="post-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <Tiptap onChange={handleContentChange} content={content} />
          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  );
};

export default CreatePost;