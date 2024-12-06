import Head from 'next/head';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Post from '../components/Post';

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null); // State for the selected post
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);
  

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Head>
        <title>Explore - The Feed</title>
        <meta name="description" content="Explore new posts" />
      </Head>
      <Header/>
      <main className="main-content">
        <div className="explore-header">
        <h2 className="explore-title">Explore</h2>
        <input
            type='text'
            placeholder='Search for posts...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
            />
        </div>
        <div className="grid">
            {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                    <Post key={post.id} post={post} />  
            ))
        ) : (
            <p>No posts found.</p>
        )}
          
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default Explore;