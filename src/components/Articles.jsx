import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom'; // Add this import
import axios from 'axios';
import arc1 from '../assets/arc1.png';
import arc2 from '../assets/arc2.png';
import arc3 from '../assets/arc3.png';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback data if API fails
  const fallbackDesigns = [
    {
      id: 1,
      title: "3D printed house design 2025 : Made in India",
      description: "Check out the various 3D house design that are made in India.",
      image: arc1,
      author: "Homewala",
      date: "Jun 2025",
      slug: "3d-printed-house-design" // Add slug for routing
    },
    {
      id: 2,
      title: "Modern Smart Home Concept",
      description: "Explore the latest smart home technologies for 2025.",
      image: arc2,
      author: "Homewala",
      date: "Jul 2025",
      slug: "modern-smart-home-concept"
    },
    {
      id: 3,
      title: "Sustainable Green Homes",
      description: "Eco-friendly homes built with sustainable materials.",
      image: arc3,
      author: "Homewala",
      date: "Aug 2025",
      slug: "sustainable-green-homes"
    },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('https://blog.homewala.com/wp-json/wp/v2/posts', {
          params: {
            per_page: 3,
            _embed: true
          }
        });
        
       const formattedArticles = response.data.map(post => {
  let imageUrl = post.featured_image_url || arc1;

  return {
    id: post.id,
    title: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 100) + '...',
    image: imageUrl,
    author: post._embedded?.author?.[0]?.name || 'Unknown Author',
    date: new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
    slug: post.slug
  };
});

        
        setArticles(formattedArticles);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Showing sample content.");
        setArticles(fallbackDesigns);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
        {articles.map((article) => (
          <Link 
            to={`/blog/${article.slug}`} 
            key={article.id} 
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
          >
            {/* Image Section */}
            <div className="h-48 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = arc1;
                }}
              />
            </div>

            {/* Content Section */}
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>

              {/* Footer Section */}
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <span className="font-medium">{article.author}</span>
                <span>{article.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link 
          to="/blogs" 
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          View All Articles
        </Link>
      </div>
    </div>
  );
};

export default Articles;