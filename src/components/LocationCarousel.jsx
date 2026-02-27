import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { api } from "../axiosConfig";
import { setFilterdData } from "../features/BasicSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LocationCarousel = () => {
  const [locations, setLocations] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filter } = useSelector((store) => store.basic);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/get-property-places-count");
        const fetchedImages = response.data.data;
        setLocations(fetchedImages);
      } catch (error) {
        console.error("Failed to fetch property areas:", error);
      }
    };

    fetchLocations();
  }, []);

  const slidesToShow = Math.min(locations.length, 6);


 const handleSearch = (value) => {
  const updatedFilter = {
    ...filter,
    property_area: [value.name], // ✅ FIX
    paginate: 1,
  };

  dispatch(setFilterdData(updatedFilter));
  navigate("/properties-for-sale-in-chennai");
};
  // const NextArrow = (props) => {
  //   const { className, style, onClick } = props;
  //   return (
  //     <div
  //       className={`${className} ${
  //         isHovering ? "opacity-100" : "opacity-0"
  //       } transition-opacity duration-300 z-50`}
  //       style={{ ...style, display: "block" }}
  //     >
  //       <button
  //         onClick={onClick}
  //         className="absolute top-[-20px] right-[40px] transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-50"
  //       >
  //         <FaArrowRight className="text-black text-lg" />
  //       </button>
  //     </div>
  //     //   <div
  //     //     className={`${className} ${
  //     //       isHovering ? "opacity-100" : "opacity-0"
  //     //     } transition-opacity duration-300 z-50`}
  //     //     style={{ ...style, display: "block" }}
  //     //     onClick={onClick}
  //     //   >
  //     //     <FaArrowRight className="text-gray-500 bg-white shadow-md w-6 h-6 p-1 -ml-12 -mt-10 rounded-full" />
  //     //   </div>
  //   );
  // };

  // const PrevArrow = (props) => {
  //   const { className, style, onClick } = props;
  //   return (
  //     <div
  //       className={`${className} ${
  //         isHovering ? "opacity-100" : "opacity-0"
  //       } transition-opacity duration-300 z-50`}
  //       style={{ ...style, display: "block" }}
  //     >
  //       <button
  //         onClick={onClick}
  //         className="absolute top-[-20px] left-[40px] transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-50"
  //       >
  //         <FaArrowLeft className="text-black text-lg" />
  //       </button>
  //     </div>
  //     //   <div
  //     //     className={`${className} ${
  //     //       isHovering ? "opacity-100" : "opacity-0"
  //     //     } transition-opacity duration-300 z-50`}
  //     //     style={{ ...style, display: "block" }}
  //     //     onClick={onClick}
  //     //   >
  //     //     <FaArrowLeft className="text-gray-500 bg-white shadow-md w-6 h-6 p-1 ml-14 -mt-10 rounded-full" />
  //     //   </div>
  //   );
  // };

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="
      absolute 
      top-[22%] 
      right-2 md:right-[-30px] 
      bg-white p-3 rounded-full shadow-md hover:bg-gray-100 
      z-50
    "
  >
    <FaArrowRight className="text-black text-lg" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="
      absolute 
      top-[22%] 
      left-2 md:left-[-30px] 
      bg-white p-3 rounded-full shadow-md hover:bg-gray-100 
      z-50
    "
  >
    <FaArrowLeft className="text-black text-lg" />
  </button>
);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,          // Enable auto-scrolling
    autoplaySpeed: 3000,     // Set auto-scroll interval to 3 seconds
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
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <section className="py-10 px-10 overflow-x-hidden pl-3">
      <h2 className="text-[28px] text-center mb-10 font-light">
        Popular
        <span className="text-black font-medium font-heading"> Areas in Chennai</span>
      </h2>
      <div className="max-w-7xl mx-auto relative">
        {locations.length > 1 ? (
<Slider {...settings}>
  {locations.map((location) => (
    <div
      key={location.id}
      className="text-center cursor-pointer"
      onClick={() => handleSearch(location)}
    >
      <img
        className="w-32 h-32 rounded-full mx-auto"
        src={location.image}
        alt={location.name}
      />
      <div className="w-fit flex flex-col justify-center items-center mx-auto">
        <h2 className="text-lg font-medium mt-2">{location.name}</h2>
        <p className="text-sm text-gray-500">
          {location.properties} Properties
        </p>
      </div>
    </div>
  ))}
</Slider>


        ) : (
          locations[0] && (
            <div className="text-center">
              <img
                className="w-32 h-32 rounded-full mx-auto"
                src={locations[0].image}
                alt={locations[0].name}
              />
              <h1 className="text-lg font-medium mt-2">{locations[0].name}</h1>
              <p className="text-sm text-gray-500">
                {locations[0].properties} Properties
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default LocationCarousel;