import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { api } from '../axiosConfig';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const LandingCarousel = () => {
    const [locations, setLocations] = useState([]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        api.get('/banner-images')
            .then(response => {
                if (response.data.status === 'success') {
                    const fetchedImages = response.data.data;
                    setLocations(fetchedImages);
                }
            })
            .catch(error => console.error('Error fetching banner images:', error));
    }, []);

    const handleBannerClick = (redirectionLink, e) => {
        if (redirectionLink) {
            window.open(redirectionLink, '_blank', 'noopener,noreferrer');
        }
    };

    // Custom arrow components that prevent propagation
    const CustomPrevArrow = ({ onClick }) => (
        <button
            onClick={(e) => {
                e.stopPropagation(); // Prevent the click from reaching the banner
                onClick(e);
            }}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-gray-600 p-3 rounded-full z-10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
            <FaArrowLeft className="w-3 h-3" />
        </button>
    );

    const CustomNextArrow = ({ onClick }) => (
        <button
            onClick={(e) => {
                e.stopPropagation(); // Prevent the click from reaching the banner
                onClick(e);
            }}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-gray-600 p-3 rounded-full z-10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
            <FaArrowRight className="w-3 h-3" />
        </button>
    );

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
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

    return (
        <section
            className="mt-5 relative banner-section"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
              <Helmet>
      <meta property="og:title" content="Homewala - Explore Elite Properties" />
      <meta property="og:description" content="Find exclusive deals and top real estate listings in Chennai." />
      <meta property="og:image" content="/favicon.png" />
    </Helmet>
            <div className="container mx-auto">
                {locations.length === 0 ? (
                    // Skeleton Placeholder with rounded corners
                    <div className="w-full h-56 sm:h-72 md:h-96 bg-gray-300 animate-pulse rounded-lg"></div>
                ) : locations.length > 1 ? (
                    <div className="rounded-lg overflow-hidden">
                        <Slider {...settings}>
                            {locations.map((location) => (
                                <div
                                    key={location.id}
                                    className="outline-none focus:outline-none"
                                    onClick={(e) => handleBannerClick(location.redirection_link, e)}
                                    style={{ cursor: location.redirection_link ? 'pointer' : 'default' }}
                                >
                                    <div className="">
                                        <div className="relative rounded-lg overflow-hidden h-56 sm:h-72 md:h-96">
                                            <img
                                                className="banner-img w-full h-56 sm:h-72 md:h-96 object-cover md:object-contain bg-no-repeat transition-transform duration-300 transform scale-105"
                                                src={location.url}
                                                alt={`Location ${location.id}`}
                                                style={{ borderRadius: '0.5rem' }}
                                            />
                                            {location.redirection_link && (
                                                <div className="absolute bottom-4 right-4 hidden md:block">
                                                    {/* <span className="bg-white bg-opacity-80 text-xs px-2 py-1 rounded">
                                                        Click to visit
                                                    </span> */}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                ) : (
                    // Single image case with rounded corners
                    locations[0] && (
                        <div
                            className="relative rounded-lg overflow-hidden"
                            onClick={(e) => handleBannerClick(locations[0].redirection_link, e)}
                            style={{ cursor: locations[0].redirection_link ? 'pointer' : 'default' }}
                        >
                            <img
                                className="banner-img w-full h-56 sm:h-72 md:h-96 object-cover md:object-contain bg-no-repeat transition-transform duration-300 transform scale-105"
                                src={locations[0].url}
                                alt={`Location ${locations[0].id}`}
                                style={{ borderRadius: '0.5rem' }}
                            />
                            {locations[0].redirection_link && (
                                <div className="absolute top-4 right-4 hidden md:block">
                                    {/* <span className="bg-white bg-opacity-80 text-xs px-2 py-1 rounded">
                                        Click to visit
                                    </span> */}
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>
           
        </section>
    );
};

export default LandingCarousel;






















// import React, { useEffect, useState } from 'react';
// import Slider from 'react-slick';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import { api } from '../axiosConfig';
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
// const LandingCarousel = () => {
//     const [locations, setLocations] = useState([]);
//     const [isHovered, setIsHovered] = useState(false);

//     useEffect(() => {
//         api.get('/banner-images')
//             .then(response => {
//                 if (response.data.status === 'success') {
//                     const fetchedImages = response.data.data;
//                     setLocations(fetchedImages);
//                 }
//             })
//             .catch(error => console.error('Error fetching banner images:', error));
//     }, []);

//     const CustomPrevArrow = ({ onClick }) => (
//         <button
//             onClick={onClick}
//             className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-gray-600 p-3 rounded-full z-10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
//         >
//             <FaArrowLeft className="w-3 h-3" />
//         </button>
//     );

//     const CustomNextArrow = ({ onClick }) => (
//         <button
//             onClick={onClick}
//             className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-gray-600 p-3 rounded-full z-10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
//         >
//             <FaArrowRight className="w-3 h-3" />
//         </button>
//     );

//     const settings = {
//         dots: false,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         nextArrow: <CustomNextArrow />,
//         prevArrow: <CustomPrevArrow />,
//         responsive: [
//             {
//                 breakpoint: 1024,
//                 settings: {
//                     slidesToShow: 4,
//                     slidesToScroll: 1,
//                 },
//             },
//             {
//                 breakpoint: 768,
//                 settings: {
//                     slidesToShow: 2,
//                     slidesToScroll: 1,
//                 },
//             },
//             {
//                 breakpoint: 480,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1,
//                 },
//             },
//         ],
//     };

//     return (
//         <section
//             className="py-4 px-6 relative banner-section"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             <div className="max-w-7xl mx-auto">
//                 {locations.length === 0 ? (
//                     // Skeleton Placeholder with rounded corners
//                     <div className="w-full h-56 sm:h-72 md:h-96 bg-gray-300 animate-pulse rounded-lg"></div>
//                 ) : locations.length > 1 ? (
//                     <div className="rounded-lg overflow-hidden">
//                         <Slider {...settings}>
//                             {locations.map((location) => (
//                                 <div key={location.id} className="outline-none focus:outline-none">
//                                     <div className="">
//                                         <div className="relative rounded-lg overflow-hidden">
//                                             <img
//                                                 className="banner-img w-full h-56 sm:h-72 md:h-96 object-cover md:object-contain bg-no-repeat transition-transform duration-300 transform scale-105"
//                                                 src={location.url}
//                                                 alt={`Location ${location.id}`}
//                                                 style={{ borderRadius: '0.5rem' }}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </Slider>
//                     </div>
//                 ) : (
//                     // Single image case with rounded corners
//                     locations[0] && (
//                         <div className="relative rounded-lg overflow-hidden">
//                             <img
//                                 className="banner-img w-full h-56 sm:h-72 md:h-96 object-cover md:object-contain bg-no-repeat transition-transform duration-300 transform scale-105"
//                                 src={locations[0].url}
//                                 alt={`Location ${locations[0].id}`}
//                                 style={{ borderRadius: '0.5rem' }}
//                             />
//                         </div>
//                     )
//                 )}
//             </div>
//         </section>
//     );
// };

// export default LandingCarousel;
