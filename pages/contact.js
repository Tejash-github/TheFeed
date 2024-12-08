import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    console.log('Form Data:', formData);
    alert('Your message has been sent!');
  };

  return (
    <div>
      <Head>
        <title>Contact Us</title>
        <meta name="description" content="Get in touch with The Feed team." />
      </Head>
      <Header />
      <main className="main-content">
        <h2 className="welcome-title">Contact Us</h2>
        <p>If you have any questions, feedback, or inquiries, feel free to reach out to us using the form below:</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="form-textarea"
            />
          </div>
          <button type="submit" className="button">Send Message</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;