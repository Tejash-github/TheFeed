import { useState } from 'react';
import Button from './Button'; // Ensure you import your Button component

const NewPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, author }),
    });
    if (res.ok) {
      const newPost = await res.json();
      console.log('Post created:', newPost);
      setTitle('');
      setContent('');
      setAuthor('');
    } else {
      console.error('Failed to create post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new-post-form">
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
        <p>{content.length}/2000 charecters</p>
      </div>
      <div>
        <label className="form-label">Author</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="form-input"
        />
      </div>
      <Button type="submit">Create Post</Button>
    </form>
  );
};

export default NewPostForm;