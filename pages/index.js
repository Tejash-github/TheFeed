import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Declare isPopupOpen state
  const [selectedPost, setSelectedPost] = useState(null);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleTitleClick = (post) => {
    setSelectedPost(post);
    setIsPopupOpen(true);
};

const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedPost(null);
};

  return (
    <div>
      <Head>
        <title>The Feed</title>
        <meta name="description" content="A blogging platform" />
      </Head>
      <style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Slab:wght@100..900&display=swap');
</style>
      <Header/>
      <main className="main-content">
        <h2 className="welcome-title">Welcome to The Feed</h2>
        <p className="greats">Your go-to place for insightful articles and blogs.</p>
        <h3 className="blog-posts-title">Blog Posts</h3>
        <div className="grid">
          {posts.map((post) => (
            <div key={post._id} className="post-card" onClick={() => handleTitleClick(post)}>
              <div className="post-card-content">
                <h2 className="post-title">{truncateText(post.title, 30)}</h2>
                <p className="post-content">{truncateText(post.content, 100)}</p>
                <p className="post-author">{truncateText(post.author, 20)}</p>
              </div>
            </div>
          ))}
        </div>
        {isPopupOpen && selectedPost && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2 className="popup-title">{selectedPost.title}</h2>
              <button className="popup-close" onClick={closePopup}>
                &times;
              </button>
              <p className="popup-text">{selectedPost.content}</p>
              <p className="popup-author">
                <strong>Author:</strong> {selectedPost.author}
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};


export default Home;