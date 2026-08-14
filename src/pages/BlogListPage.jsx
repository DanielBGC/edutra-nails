import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogData';

const BlogListPage = () => {
  return (
    <div className="blog-page">
      <section className="blog-header">
        <div className="container">
          <Motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            Nosso Blog
          </Motion.h1>
          <p className="subtitle">Dicas, tendências e inspirações para o seu autocuidado.</p>
        </div>
      </section>

      <section className="blog-list">
        <div className="container">
          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <Motion.article 
                key={post.id} 
                className="blog-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="blog-img">
                  <img src={post.img} alt={post.title} />
                </div>
                <div className="blog-info">
                  <span>{post.date}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="read-more" rel="noopener noreferrer">Ler post completo <span>→</span></Link>
                </div>

              </Motion.article>
            ))}
          </div>
        </div>
      </section>

      <style jsx="true">{`
        .blog-page {
          padding-top: 120px;
          min-height: 100vh;
          background-color: var(--color-off-white);
        }
        .blog-header {
          text-align: center;
          margin-bottom: 60px;
        }
        .subtitle {
          color: var(--color-text-light);
          font-size: 1.2rem;
        }
        .blog-list {
          padding-bottom: 100px;
        }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        .blog-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .blog-img {
          height: 250px;
          width: 100%;
        }
        .blog-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .blog-info {
          padding: 30px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .blog-info span {
          font-size: 0.8rem;
          color: var(--color-gold);
          text-transform: uppercase;
          font-weight: 600;
        }
        .blog-info h3 {
          margin: 10px 0 15px;
          font-size: 1.4rem;
        }
        .blog-info p {
          color: var(--color-text-light);
          margin-bottom: 20px;
          font-size: 0.95rem;
          flex-grow: 1;
        }
        .read-more {
          color: var(--color-terracotta);
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        @media (max-width: 992px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogListPage;
