import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import location1 from "../assets/OurPartners/1.png";
import location2 from "../assets/OurPartners/2.png";
import location3 from "../assets/OurPartners/3.png";
import location4 from "../assets/OurPartners/4.png";
import location5 from "../assets/OurPartners/5.png";
import location6 from "../assets/OurPartners/6.png";
import { api } from "../axiosConfig";

const OurPartners = () => {
  const [partners, setPartners] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await api.get("/get-our-partners"); // Use the correct endpoint
        if (response.data.status === "success") {
          setPartners(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };

    fetchPartners();
  }, []);

   // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);


const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 right-[10px] transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-50 ${
      window.innerWidth < 1024 || isHovering ? "opacity-100" : "opacity-0"
    } transition-opacity duration-300`}
  >
    <FaArrowRight className="text-black text-lg" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 left-[10px] transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-50 ${
      window.innerWidth < 1024 || isHovering ? "opacity-100" : "opacity-0"
    } transition-opacity duration-300`}
  >
    <FaArrowLeft className="text-black text-lg" />
  </button>
);

  // // Custom arrow components that only show when hovering
  // const NextArrow = (props) => {
  //   const { className, style, onClick } = props;
  //   return (
  //     <div
  //       className={`${className} ${
  //         windowWidth < 1024 ? "opacity-100" : (isHovering ? "opacity-100" : "opacity-0")
  //       } transition-opacity duration-300 z-50`}
  //       style={{ ...style, display: "block" }}
  //     >
  //       <button
  //         onClick={onClick}
  //         className="absolute top-1/2 right-[10px] transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-50"
  //       >
  //         <FaArrowRight className="text-black text-lg" />
  //       </button>
  //     </div>

  //     // <div
  //     //     className={`${className} ${isHovering ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 z-50`}
  //     //     style={{ ...style, display: "block" }}
  //     //     onClick={onClick}
  //     // >
  //     //     <FaArrowRight color='black' className="text-gray-600 bg-white shadow-md w-6 h-6 p-1 -ml-10 -mt-18 rounded-full" />
  //     // </div>
  //   );
  // };

  // const PrevArrow = (props) => {
  //   const { className, style, onClick } = props;
  //   return (
  //     <div
  //       className={`${className} ${
  //         windowWidth < 1024 ? "opacity-100" : (isHovering ? "opacity-100" : "opacity-0")
  //       } transition-opacity duration-300 z-50`}
  //       style={{ ...style, display: "block" }}
  //     >
  //       <button
  //         onClick={onClick}
  //         className="absolute top-1/2 left-[10px] transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-50"
  //       >
  //         <FaArrowLeft className="text-black text-lg" />
  //       </button>
  //     </div>
  //     // <div
  //     //     className={`${className} ${isHovering ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 z-50`}
  //     //     style={{ ...style, display: "block" }}
  //     //     onClick={onClick}
  //     // >
  //     //     <FaArrowLeft color='black' className="text-gray-600 bg-white shadow-md w-6 h-6 p-1 ml-10 -mt-18 rounded-full" />
  //     // </div>
  //   );
  // };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    autoplay: true, 
  autoplaySpeed: 2000,
  cssEase: "linear",
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  // Check if we should use slider or static grid
  const shouldUseSlider = () => {
    // Always use slider on mobile/tablet (screen width < 1024px) or when we have more than 6 items
    return windowWidth < 1024 || partners.length > 6;
  };


 // Dynamic slider settings based on number of items
  const getSliderSettings = () => {
    const baseSettings = {
      dots: false,
      infinite: partners.length > 1, // Enable infinite if we have more than 1 item
      speed: 500,
      autoplay: shouldUseSlider() && partners.length > 1, // Enable autoplay when using slider
      autoplaySpeed: 2000,
      cssEase: "linear",
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      centerMode: false,
      centerPadding: "0px",
      swipe: true, // Enable touch/swipe
      touchMove: true, // Enable touch move
      swipeToSlide: true, // Allow swiping to any slide
      pauseOnHover: true, // Pause autoplay on hover
      pauseOnFocus: true, // Pause autoplay on focus
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(4, partners.length),
            slidesToScroll: 1,
            infinite: partners.length > 1,
            autoplay: partners.length > 1, // Enable autoplay on tablet
            swipe: true,
            touchMove: true,
            pauseOnHover: true,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(2, partners.length),
            slidesToScroll: 1,
            infinite: partners.length > 1,
            autoplay: partners.length > 1, // Enable autoplay on tablet
            swipe: true,
            touchMove: true,
            pauseOnHover: true,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: partners.length > 1,
            autoplay: partners.length > 1, // Enable autoplay on mobile
            swipe: true,
            touchMove: true,
            centerMode: false,
            pauseOnHover: false, // Don't pause on mobile
          },
        },
      ],
    };

    // Adjust slidesToShow based on number of items for desktop
    if (windowWidth >= 1024) {
      if (partners.length <= 6) {
        baseSettings.slidesToShow = partners.length;
        baseSettings.centerMode = true;
        baseSettings.autoplay = false; // Disable autoplay on desktop when showing static grid
      } else {
        baseSettings.slidesToShow = 6;
        baseSettings.autoplay = true; // Enable autoplay on desktop when using slider
      }
    } else {
      // For mobile/tablet, always use appropriate slidesToShow
      baseSettings.slidesToShow = 6;
    }

    return baseSettings;
  };




  // If we have 6 or fewer items, render them in a simple grid instead of slider
  const renderStaticGrid = () => {
    return (
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
          {partners.map((partner) => (
            <div key={partner.id} className="text-center p-2">
              <div className="bg-[#E2FFF147] px-6 py-5 rounded">
                <img
                  className="w-auto h-20 mx-auto object-contain"
                  src={partner.image}
                  alt={partner.name}
                />
                <p className="text-sm text-gray-500 pt-4">
                  {partner.projects}+ Projects
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <section className="">
      <div
        className="max-w-7xl mx-auto relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {partners.length > 1 ? (
          <div className="w-full overflow-hidden px-4">
            {shouldUseSlider() ? (
              // Use slider for mobile/tablet or when we have many items
              <Slider {...getSliderSettings()}>
                {partners.map((partner) => (
                  <div key={partner.id} className="text-center p-2">
                    <div className="bg-[#E2FFF147] px-6 py-5 rounded">
                      <img
                        className="w-auto h-20 mx-auto object-contain"
                        src={partner.image}
                        alt={partner.name}
                      />
                      <p className="text-sm text-gray-500 pt-4">
                        {partner.projects}+ Projects
                      </p>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              // Render static grid only on desktop with 6 or fewer items
              renderStaticGrid()
            )}
          </div>
        ) : (
          partners[0] && (
            <div className="text-center p-4 flex justify-center">
              <div className="bg-[#F8FFE2] px-6 py-5 rounded">
                <img
                  className="w-auto h-24 mx-auto object-contain"
                  src={partners[0].image}
                  alt={partners[0].name}
                />
                <p className="text-sm text-gray-500 pt-4">
                  {partners[0].projects}+ Projects
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>

  );
};

export default OurPartners;
