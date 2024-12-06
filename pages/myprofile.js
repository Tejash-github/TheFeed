// pages/myprofile.js
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

const MyProfile = () => {
    const [user, setUser ] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', profilePicture: null });
    const router = useRouter();

    useEffect(() => {
        const storedUser  = localStorage.getItem('user');
        if (storedUser ) {
            const userData = JSON.parse(storedUser );
            setUser (userData);
            setFormData({ name: userData.name, email: userData.email, profilePicture: userData.profilePicture });
        } else {
            router.push('/login'); // Redirect to login if not logged in
        }

        const interval = setInterval(() => {
            window.location.reload();
          }, 60000);
    
          return () => clearInterval(interval);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user'); // Remove user from localStorage
        router.push('/login'); // Redirect to login page
    };

    const handleEditClick = () => {
        setIsEditing(true); // Open the edit modal
    };

    const handleCloseModal = () => {
        setIsEditing(false); // Close the edit modal
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name == 'profilePicture') {
            setFormData({ ...formData, profilePicture: files[0] });
        } else {
            setFormData({ ...formData, [name]: value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        const formDataToSend = new FormData();
        formDataToSend.append('id', user._id);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        if (formData.profilePicture) {
            formDataToSend.append('profilePicture', formData.profilePicture);
        }

        try {
            const response = await fetch('/api/updateUser ', {
                method: 'PUT',
                body: formDataToSend,
            });

            if (response.ok) {
                const updatedUser  = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser )); // Update local storage
                setUser (updatedUser ); // Update user state
                setIsEditing(false); // Close the modal
            } else {
                const errorData = await response.json();
                console.error('Error updating user:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Head>
                <title>My Profile</title>
                <meta name="description" content="User  profile page" />
            </Head>
            <Header />
            <main className="main-content">
                <h2 className="welcome-title">My Profile</h2>
                {user ? (
                    <div className="profile-container">
                        <div className="edit-icon" onClick={handleEditClick}>
                            <span role="img" aria-label="Edit">✏️</span>
                        </div>
                        <div className="profile-pic-container">
                            <img src={user.profilePicture} alt="Profile" className="profile-image" />
                        </div>
                        <div className="profile-info">
                            <div className="profile-row">
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                <button onClick={handleLogout} className="button">Logout</button>
            </main>
            <Footer />

            {/* Edit Modal */}
            {isEditing && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Edit Profile</h2>
                        <form onSubmit={handleSubmit}>

                            <label className='form-label'>Name:</label>
                            <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className='form-input'
                            required />

                            <label className='form-label'>Email:</label>
                            <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className='form-input'
                            required />

                            <label className='form-label'>Profile Picture</label>
                            <input 
                            type="file" 
                            name="profilePicture"  
                            onChange={handleChange} />
                            <button type="submit" className="button">Save Changes</button>
                        </form>
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProfile;