import React, { useEffect, useState } from 'react'
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PropertyCardSmall from './PropertyCardSmall';
import propertyImage from "../assets/homeimg.jpg";
import { useDispatch, useSelector } from 'react-redux';
import { setPropertiesList } from '../features/BasicSlice'
import { api } from '../axiosConfig';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";



const RelevantCards = ({ relevantProperties }) => {
    const [properties, setProperties] = useState([])
    const slidesToShow = Math.min(relevantProperties?.length || 1, 4); // Max 4 slides

//    useEffect(()=>{
// console.log('relevantProperties',relevantProperties.original.data)
//    },[])

    const { propertiesList, filter } = useSelector(store => store.basic);
    const dispatch = useDispatch()
    const SearchFetch = async () => {
        try {
            const response = await api.get('/buyer/wishlist');
            //   dispatch(setPropertiesList(response.data))
            setProperties(response.data.data)
        } catch (error) {
            console.error('Failed to fetch property details:', error);
        }

    }

    
const NextArrow = ({ onClick }) => (
  <div
    className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
    onClick={onClick}
  >
    <FaArrowRight className="text-gray-600 w-8 h-8 bg-white p-2 rounded-full shadow-md" />
  </div>
);

// Custom Prev Arrow
const PrevArrow = ({ onClick }) => (
  <div
    className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
    onClick={onClick}
  >
    <FaArrowLeft className="text-gray-600 w-8 h-8 bg-white p-2 rounded-full shadow-md" />
  </div>
);
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
          autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // 2 seconds between slides
      cssEase: "linear", // Smooth animation
      pauseOnHover: true, // Pause when user hovers
    pauseOnFocus: true, // Pause when focused
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                     autoplay: true,
                autoplaySpeed: 5000,
                pauseOnHover: true,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                     autoplay: true,
                autoplaySpeed: 2500, // Slightly slower on tablet
                pauseOnHover: true,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                autoplaySpeed: 3000, // Slower on mobile for better readability
                pauseOnHover: false, // No pause on mobile for better touch experience
                swipe: true,
                touchMove: true,
                },
            },
        ],
    };
    return (
        <section className="py-4 ">
            <div className="max-w-7xl mx-auto">
                <Slider {...settings}>
                   
                    {relevantProperties && relevantProperties.original && relevantProperties.original.data && relevantProperties.original.data.map((property) => (
                        <div key={property.id} className=' grid gap-4'>
                            <PropertyCardSmall key={property.id} property={property} />
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    )

}

export default RelevantCards