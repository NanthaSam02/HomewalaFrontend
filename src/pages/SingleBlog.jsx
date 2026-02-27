import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "./../components/Navbar";
import Footer from "./../components/Footer";

const SingleBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the current post
        let response = await axios.get(
          `https://blog.homewala.com/wp-json/wp/v2/posts?slug=${slug}&_embed=1`
        );

        // Fallback if direct slug query doesn't work
        if (!response.data || response.data.length === 0) {
          const allResponse = await axios.get(
            'https://blog.homewala.com/wp-json/wp/v2/posts?_embed=1&per_page=100'
          );
          const foundPost = allResponse.data.find(p => p.slug === slug);
          if (foundPost) {
            response.data = [foundPost];
          }
        }

        if (!response.data || response.data.length === 0) {
          throw new Error('Blog post not found');
        }

        const postData = response.data[0];
        
        setPost({
          id: postData.id,
          title: postData.title?.rendered || 'Untitled Post',
          content: postData.content?.rendered || 'No content available',
          image: postData._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
          author: postData._embedded?.author?.[0]?.name || 'Unknown Author',
          date: new Date(postData.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          categories: postData._embedded?.['wp:term']?.[0]?.map(cat => cat.name) || []
        });

        // Fetch recent posts (excluding the current one)
        const recentResponse = await axios.get(
          `https://blog.homewala.com/wp-json/wp/v2/posts?_embed=1&per_page=4&exclude=${postData.id}`
        );

        setRecentPosts(recentResponse.data.map(post => ({
          id: post.id,
          title: post.title?.rendered || 'Untitled Post',
          slug: post.slug,
          image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
          date: new Date(post.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          excerpt: post.excerpt?.rendered || ''
        })));

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || 'Failed to load post');
        setTimeout(() => navigate('/blogs'), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, navigate]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">       
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 max-w-2xl mx-auto">
          <p>{error}</p>
          <p>Redirecting to blog list...</p>
          <Link 
            to="/blogs" 
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back Now
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Post data not available</p>
        <Link 
          to="/blogs" 
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Blog List
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="z-50">
        <Navbar />
      </div>
      <div className='min-h-screen flex flex-col relative page-content'>
        <main className="relative">
          <div className='relative rounded-lg'>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
                {/* Main Content */}
                <div className='lg:col-span-3'>
                  <article className="bg-white rounded-lg shadow-md overflow-hidden">
                    {post.image && (
                      <div className="h-96 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                    )}
                    
                    <div className="p-6 md:p-8">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories.map((category, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-6">
                        <span className="mr-4">By {post.author}</span>
                        <span>{post.date}</span>
                      </div>
                      
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>
                  </article>
                </div>

                {/* Sidebar */}
                <div className='lg:col-span-1'>
                  <div className='sticky top-24 space-y-8'>
                    {/* Recent Posts */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h2 className="text-2xl font-medium mb-6 pb-2 border-b border-gray-200">Recent Posts</h2>
                      <div className="space-y-4">
                        {recentPosts.map(recentPost => (
                          <Link 
                            key={recentPost.id} 
                            to={`/blog/${recentPost.slug}`}
                            className="block group transition-colors pb-2 border-b border-gray-200"
                          >
                            <div className="flex items-start gap-4 hover:bg-gray-50 p-2 rounded-lg">
                              {recentPost.image && (
                                <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded">
                                  <img 
                                    src={recentPost.image} 
                                    alt={recentPost.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none' }}
                                  />
                                </div>
                              )}
                              <div>
                                <p className="text-xs">
                                  {recentPost.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{recentPost.date}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    {post.categories.length > 0 && (
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">Categories</h2>
                        <div className="flex flex-wrap gap-2">
                          {post.categories.map((category, index) => (
                            <Link
                              key={index}
                              to={`/blogs?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                              className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
                            >
                              {category}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="mt-8 text-center">
                <Link 
                  to="/blogs" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to All Articles
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default SingleBlog;