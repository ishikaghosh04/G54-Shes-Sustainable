import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8800/home");
        console.log(res.data);
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllUsers();

    AOS.init({ duration: 1000 });
  }, []);

  const toggleAbout = () => {
    setShowAbout((prev) => !prev);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#e4e4e4' }}>
        <h1>Welcome to She’s Sustainable 👗</h1>
        <p>Your go-to platform for sustainable maternity fashion.</p>

        <Link to="/product">
          <button style={{ margin: '0.5rem' }}>Browse Products</button>
        </Link>
        <Link to="/login">
          <button style={{ margin: '0.5rem' }}>Login</button>
        </Link>
        <Link to="/signup">
          <button style={{ margin: '0.5rem' }}>Sign Up</button>
        </Link>
      </section>

      {/* About Us Toggle */}
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <h2
          style={{ cursor: 'pointer', display: 'inline-block' }}
          onClick={toggleAbout}
        >
          About Us {showAbout ? '▲' : '▼'}
        </h2>
      </div>

      {/* Show this only when dropdown is open */}
      {showAbout && (
        <section style={{ padding: '3rem 2rem', backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {/* Mission */}
            <div
              style={{ width: '300px', textAlign: 'center', marginBottom: '2rem' }}
              data-aos="fade-up"
              data-aos-delay="0"
              data-aos-anchor-placement="top-bottom"
            >
              <img src="https://via.placeholder.com/150" alt="Mission" />
              <h3>Our Mission</h3>
              <p>To redefine maternity fashion by making it sustainable, stylish, and accessible.</p>
            </div>

            {/* Vision */}
            <div
              style={{ width: '300px', textAlign: 'center', marginBottom: '2rem' }}
              data-aos="fade-up"
              data-aos-delay="0"
              data-aos-anchor-placement="top-bottom"
            >
              <img src="https://via.placeholder.com/150" alt="Vision" />
              <h3>Our Vision</h3>
              <p>To become the leading platform where motherhood meets mindful living.</p>
            </div>

            {/* Values */}
            <div
              style={{ width: '300px', textAlign: 'center', marginBottom: '2rem' }}
              data-aos="fade-up"
              data-aos-delay="0"
              data-aos-anchor-placement="top-bottom"
            >
              <img src="https://via.placeholder.com/150" alt="Values" />
              <h3>Our Values</h3>
              <p>Inclusivity, sustainability, comfort, and community.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
