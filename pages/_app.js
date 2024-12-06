// pages/_app.js
import '../styles/styles.css'; // Import your CSS file
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
    const [user, setUser ] = useState(null);

    useEffect(() => {
        const storedUser  = localStorage.getItem('user');
        if (storedUser ) {
          setUser (JSON.parse(storedUser ));
        }
      }, []);
  return (
  <SessionProvider session={pageProps.session}>
    <Component {...pageProps} user={user} />
  </SessionProvider>
  );
  
}

export default MyApp;