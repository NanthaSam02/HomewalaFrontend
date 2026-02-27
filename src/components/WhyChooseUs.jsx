import React, { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import bgImage from "../assets/Whychooseus/main.png";
import { api } from "../axiosConfig";

const WhyChooseUs = () => {
  const [features, setFeatures] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const fetchData = async () => {
    try {
      const response = await api.get("/why-choose-us");
      setFeatures(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === features.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? features.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide(); // Swipe left
    }

    if (touchStart - touchEnd < -50) {
      prevSlide(); // Swipe right
    }
  };

  // Auto-scroll to current slide
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: currentIndex * sliderRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  return (
    <section className="relative px-4 sm:px-6 py-12 why-choose">
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative z-10 rounded-3xl shadow-lg w-full max-w-screen-xl mx-auto overflow-hidden"
      >
        <div className="p-6 md:p-10 text-white bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-medium mb-1 font-heading">
              Why
            </h2>
            <h2 className="text-3xl md:text-4xl font-light font-heading">
              Choose Us
            </h2>
          </div>

          {/* Desktop Grid View */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>

          {/* Mobile Slider View */}
          <div className="md:hidden relative">
            <div
              ref={sliderRef}
              className="flex overflow-x-hidden scroll-snap-x-mandatory scroll-smooth"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="w-full flex-shrink-0 px-2 scroll-snap-align-start"
                >
                  <FeatureCard feature={feature} />
                </div>
              ))}
            </div>
            
            {/* Slider Controls */}
            {features.length > 1 && (
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition"
                  aria-label="Previous slide"
                >
                  <FaChevronLeft />
                </button>
                <div className="flex items-center space-x-2">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition ${
                        currentIndex === index
                          ? "bg-white w-4"
                          : "bg-white bg-opacity-40"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition"
                  aria-label="Next slide"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature }) => (
  <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center text-center h-full transition-transform">
    <img
      src={feature.icon}
      alt={feature.title}
      className="mb-3 w-12 h-12 object-contain"
    />
    <h3 className="text-sm font-bold text-gray-800 mb-2">{feature.title}</h3>
    <p className="text-gray-600 text-xs">{feature.description}</p>
  </div>
);

export default WhyChooseUs;