import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8800/");
        console.log(res.data);
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllUsers();

    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="home-hero">
        <h1>Welcome to She’s Sustainable 👗</h1>
        <p>Your go-to platform for sustainable maternity fashion.</p>

        <div className="home-hero__buttons">
          <Link to="/product">
            <button className="btn btn-primary">Browse Products</button>
          </Link>
          <Link to="/login">
            <button className="btn btn-primary">Login</button>
          </Link>
          <Link to="/signup">
            <button className="btn btn-primary">Sign Up</button>
          </Link>
        </div>
      </section>

      {/* About Us Section */}
        <section className="home-about-section">
          <h2 className="about-us-heading">About Us</h2>
          <hr className="about-us-line" />
          <div className="home-about-grid">
            {/* Mission */}
            <div className="home-about-card" data-aos="fade-up">
              <img src="https://via.placeholder.com/150" alt="Mission" />
              <h3>Our Mission</h3>
              <p>To redefine maternity fashion by making it sustainable, stylish, and accessible.</p>
            </div>

            {/* Vision */}
            <div className="home-about-card" data-aos="fade-up">
              <img src="https://via.placeholder.com/150" alt="Vision" />
              <h3>Our Vision</h3>
              <p>To become the leading platform where motherhood meets mindful living.</p>
            </div>

            {/* Values */}
            <div className="home-about-card" data-aos="fade-up">
              <img src="https://via.placeholder.com/150" alt="Values" />
              <h3>Our Values</h3>
              <p>Inclusivity, sustainability, comfort, and community.</p>
            </div>
          </div>
        </section>
    </div>
  );
};

export default Home;
