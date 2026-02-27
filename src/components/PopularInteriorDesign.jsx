import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import banner from "../assets/interior-banner.jpg";
import { api } from "../axiosConfig";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaRupeeSign, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { IoMdShareAlt } from "react-icons/io";
import { Height } from "@mui/icons-material";
import { submitInteriorEnquiry, transformFormDataForAPI } from "../services/interiorEnquiry";
import { Helmet } from "react-helmet-async";




// Form validation schema
const enquirySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  message: z.string().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
});

const PopularInteriorDesign = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInteriorPage = location.pathname === "/interior";

  const [interiorDesigns, setInteriorDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagenation, setPagenation] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(enquirySchema),
  });

  const fetchData = async () => {
    try {
      const response = await api.post("/interior/home", { pagenation });
      const newData = response?.data?.data || [];
      setHasMore(response.data.show_more);

      setInteriorDesigns((prev) => {
        const existingNames = new Set(prev.map((item) => item.name));
        const filtered = newData.filter((item) => !existingNames.has(item.name));
        return [...prev, ...filtered];
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const seoData = {
  title: "Interior Design Services in Chennai | Homewala",
  description:
    "Explore modern interior design ideas for homes in Chennai. Modular kitchen, bedroom, living room & full home interior solutions by Homewala.",
  keywords:
    "interior design chennai, home interior chennai, modular kitchen chennai, bedroom interior design, living room interiors",
  canonical: "https://homewala.com/interior",
  robots: "index, follow",
  author: "Homewala",
  publisher: "Homewala Real Estate & Interiors",
};

  useEffect(() => {
    fetchData();
  }, [pagenation]);

  // Generate CAPTCHA
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion(`${num1} + ${num2}`);
    setCaptchaAnswer((num1 + num2).toString());
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const addPagenation = () => {
    setPagenation((prev) => prev + 1);
  };

  const handleDesignClick = async (design) => {
    if (!isInteriorPage) {
      navigate("/interior");
      return;
    }

    // Simply open the modal with the selected design without fetching gallery
    // Since you don't want to use design IDs, we'll just show the contact form
    setSelectedDesign(design);
    setGalleryImages([design.image]); // Use the main design image
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    if (userCaptchaInput !== captchaAnswer) {
      toast.error("Incorrect CAPTCHA answer!");
      return;
    }
    
    if (!termsAccepted) {
      toast.error("Please accept the terms");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const enquiryData = transformFormDataForAPI(data);
      
      if (selectedDesign) {
        enquiryData.propertyname = selectedDesign.name || 'Interior Design Enquiry';
      }
      
      const response = await submitInteriorEnquiry(enquiryData);
      
      if (response.status === 201 || response.status === 200) {
        toast.success("Enquiry submitted successfully!");
        setSubmitSuccess(true);
        reset();
        setUserCaptchaInput("");
        setTermsAccepted(false);
        generateCaptcha();
        setTimeout(() => {
          setSubmitSuccess(false);
          setModalOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach(key => {
          toast.error(backendErrors[key][0]);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to submit enquiry");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image navigation
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  if (loading && pagenation === 1) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Gallery Modal Component
  const GalleryModal = () => {
    if (!modalOpen) return null;

    return (
      
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-99999 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center p-4 border-b">
          
            <h4 className="text-lg font-medium">Get a Free Consultation</h4>
            <button 
              onClick={() => setModalOpen(false)} 
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Gallery Images */}
            <div className="space-y-4">
                
              <div className="relative">
                <img
                  src={galleryImages[activeImageIndex]}
                  alt={`Gallery ${activeImageIndex + 1}`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {activeImageIndex + 1} / {galleryImages.length}
                </div>
              </div>
              <h3 className="text-xl font-semibold pt-5">
              {selectedDesign?.name || 'Interior Design Gallery'}
            </h3>
            <p>Interior design turns a new house into a stylish, functional home that reflects your personality and maximizes comfort.</p>
              {/* <div className="grid grid-cols-4 gap-2">
                {galleryImages.slice(0, 4).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-full h-20 object-cover rounded cursor-pointer ${
                      index === activeImageIndex ? 'ring-2 ring-blue-500' : ''
                    }`}
                  />
                ))}
              </div> */}
            </div>
            
            {/* Contact Form */}
            <div className="bg-gray-50 p-4 rounded-lg">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Thank you!</h3>
                  <p className="mt-1 text-gray-500">Your enquiry has been submitted successfully.</p>
                </div>
              ) : (
                <>
                  {/* <h4 className="text-lg font-medium mb-4">Get a Free Consultation</h4> */}
                  {/* <p className="text-sm text-gray-600 mb-4">
                    Interested in this design? Fill out the form and we'll get back to you soon.
                  </p> */}
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      {/* <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name *
                      </label> */}
                      <input
                        type="text"
                        placeholder="Name"
                        id="name"
                        {...register("name")}
                        className={`mt-1 block w-full border ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        required
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      {/* <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email *
                      </label> */}
                      <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        {...register("email")}
                        className={`mt-1 block w-full border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      {/* <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label> */}
                      <input
                        type="tel"
                        id="phone"
                        placeholder="Phone Number"
                        {...register("phone")}
                        className={`mt-1 block w-full border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        required
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                    
                    <div>
                      {/* <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message (Optional)
                      </label> */}
                      <textarea
                        id="message"
                        placeholder="Message (Optional)"
                        {...register("message")}
                        rows="3"
                        className={`mt-1 block w-full border ${
                          errors.message ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        style={{ height: "45px" }}
                      ></textarea>
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>
                    
                    {/* CAPTCHA */}
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          <small>Solve CAPTCHA:</small>
                        </label>
                        <button
                          type="button"
                          onClick={generateCaptcha}
                          className="text-blue-600 text-sm flex items-center hover:text-blue-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refresh
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-full flex-1 bg-white px-4 py-2 rounded border border-gray-300 font-medium text-center">
                          {captchaQuestion}
                        </div>
                        <input
                          type="text"
                          value={userCaptchaInput}
                          onChange={(e) => setUserCaptchaInput(e.target.value)}
                          className="w-full flex-1 px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="Your answer"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Terms Checkbox */}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                        <small>I agree to be contacted via WhatsApp, SMS, Phone, Email etc.</small>
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                        isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                      } transition-colors`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main content
  const content = (
    <>
    
    {/* Banner Section */}

      {/* Banner Section */}
      {isInteriorPage && (
        
        <div className="container mx-auto mt-5">
          <div 
            className="bg-cover bg-center relative bg-gray-50 rounded-lg"
            style={{ backgroundImage: `url(${banner})`, padding: '180px 0px' }}
          >
            <Helmet>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <meta name="robots" content={seoData.robots} />
      <meta name="author" content={seoData.author} />
      <meta name="publisher" content={seoData.publisher} />
      <link rel="canonical" href={seoData.canonical} />
    </Helmet>

            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center text-white">
              <h1 className="font-bold text-4xl">Interior Design</h1>
            </div>          
          </div>
        </div>
      )}

      {/* Interior Design Section */}
      <section className="home-interior pb-5">
        <div className="container mx-auto pb-5">
          <h2 className="text-[28px] font-light text-center mb-4">
            Popular{" "}
            <span className="text-black font-medium">
              Interior Design
            </span>
          </h2>
          <p className="text-center text-gray-600 mb-8 tracking-widest">
            Interior design enhances spaces by blending style and functionality
          </p>

          {/* Design Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {(isInteriorPage ? interiorDesigns : interiorDesigns.slice(0, 6)).map((design, index) => (
              <div
                key={design.name || index}
                onClick={() => handleDesignClick(design)}
                className={`relative rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow ${
                  index === 0 || index === 5 || index === interiorDesigns.length - 1 ? "md:col-span-2" : ""
                }`}
              >
                <img
                  src={design.image || "/path/to/fallback-image.png"}
                  alt={design.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent text-white w-full p-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{design.name}</p>
                    {/* <div className="flex gap-2">
                      <IoMdShareAlt
                        size={18}
                        className="text-white bg-blue-500 p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                      />
                      {design.isFavourites ? (
                        <AiFillHeart className="text-red-500 text-xl" />
                      ) : (
                        <AiOutlineHeart className="text-white text-xl" />
                      )}
                    </div> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {isInteriorPage && (
            <div className="flex justify-center my-6">
              <button
                disabled={!hasMore}
                onClick={addPagenation}
                className={`text-white rounded-md px-6 py-2 transition ${
                  !hasMore ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {hasMore ? 'Show More' : 'No More Designs'}
              </button>
            </div>
          )}
        </div>
      </section>

      <GalleryModal />
    </>
  );

  return isInteriorPage ? <Layout>{content}</Layout> : content;
};

export default PopularInteriorDesign;