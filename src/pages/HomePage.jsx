import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Portfolio from '../components/Portfolio';
import Packages from '../components/Packages';
import Testimonials from '../components/Testimonials';
import Blog from '../components/Blog';

const HomePage = () => {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => observer.observe(reveal));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Hero />
      <About />
      <Portfolio />
      <Packages />
      <Testimonials />
      <Blog />
    </>
  );
};

export default HomePage;
