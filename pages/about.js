import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div>
      <Head>
        <title>About Us</title>
        <meta name="description" content="Learn more about The Feed, our mission, and our team." />
      </Head>
      <Header />
      <main className="main-content">
        <h2 className="welcome-title">About Us</h2>
        <p>
          Welcome to The Feed! We are a passionate team dedicated to providing insightful articles and blogs that inform and inspire our readers. Our mission is to create a platform where meaningful connections can be made, and where diverse voices can be heard.
        </p>
        <p>
          At The Feed, we believe in the power of storytelling and the importance of sharing knowledge. Our team consists of writers, editors, and content creators who are committed to delivering high-quality content across various topics, including technology, lifestyle, health, and more.
        </p>
        <p>
          Join us on this journey as we explore new ideas, share experiences, and foster a community of engaged readers. Thank you for being a part of The Feed!
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default About;