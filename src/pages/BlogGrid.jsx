import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import arc1 from '../assets/arc1.png';
import arc2 from '../assets/arc2.png';
import arc3 from '../assets/arc3.png';
import Navbar from "./../components/Navbar";
import Footer from "./../components/Footer";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 9; // Articles per page

  // Fallback data if API fails
  const fallbackDesigns = [
    {
      id: 1,
      title: "3D printed house design 2025 : Made in India",
      description: "Check out the various 3D house design that are made in India.",
      image: arc1,
      author: "Homewala",
      date: "Jun 2025",
      slug: "3d-printed-house-design"
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
        setLoading(true);
        const response = await axios.get('https://blog.homewala.com/wp-json/wp/v2/posts', {
          params: {
            per_page: perPage,
            page: currentPage,
            _embed: true
          }
        });
        
        // Get total pages from headers
        const total = response.headers['x-wp-totalpages'] || 1;
        setTotalPages(parseInt(total));
        
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
        setError(null);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Showing sample content.");
        setArticles(fallbackDesigns);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
      >
        &laquo; Prev
      </button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="px-2">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="px-2">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
      >
        Next &raquo;
      </button>
    );

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        {pages}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
       <div className='min-h-screen flex flex-col relative page-content'>
        <main className="relative">
          <div className='relative rounded-lg'>
               <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {error && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link 
                to={`/blog/${article.slug}`} 
                key={article.id} 
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
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

                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <span className="font-medium">{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {renderPagination()}
        </div>
      </div>
            </div>
            </main>
            </div>
     
      <Footer />
    </div>
  );
};

export default Articles;