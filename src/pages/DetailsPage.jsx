import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import "../styles/detailsstyle.css";
import { FaFastForward } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import {
  FaMapMarkerAlt,
  FaRegHeart,
  FaBuilding,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDown,
} from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";

import {
  MdAttachMoney,
  MdOutlineStairs,
  MdChairAlt,
  MdAddchart,
} from "react-icons/md";
import ReCAPTCHA from "react-google-recaptcha";
import { GiTheaterCurtains } from "react-icons/gi";
import { IoMdDownload, IoMdShareAlt } from "react-icons/io";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BiBuildingHouse } from "react-icons/bi";
import propertyImage from "../assets/homeimg.jpg";
import floorImage from "../assets/floorplan.png";
import placeholderImage from "../assets/homeimg.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import RelevantCards from "../components/RelevantCards";
import EnquiryModel from "../components/Models/EnquiryModel";
import { useDispatch } from "react-redux";
import { setIsModalOpen } from "../features/BasicSlice";
import { api } from "../axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { FaFilePdf, FaFileExcel, FaFileWord, FaFileAlt } from "react-icons/fa";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "../styles/RichTextEditor.css";
import { Navigate,useParams } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaLink,
  FaTimes,
} from "react-icons/fa";
import {
  setIsNavbarModalOpen,
  setPropertiesList,
} from "../features/BasicSlice";
import "jspdf-autotable";
import DOMPurify from 'dompurify';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { Scrollbar } from 'swiper/modules';
import Seo from "../components/Seo";

const enquirySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name is too long"),
  email: z.string().email("Invalid email address"),
  countryCode: z.string().min(1, "Country code is required"),
  mobile: z
    .string()
    .regex(/^[0-9]{7,15}$/, "Mobile number must be between 7-15 digits"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

// Country codes data
const countryCodes = [
  { code: "+91", country: "IN" },   // India
  { code: "+61", country: "AU" },   // Australia
  { code: "+65", country: "SG" },   // Singapore
  { code: "+971", country: "AE" },  // United Arab Emirates
  { code: "+44", country: "GB" },   // United Kingdom
  { code: "+1", country: "US" },    // United States
  { code: "+93", country: "AF" },   // Afghanistan
  { code: "+355", country: "AL" },  // Albania
  { code: "+213", country: "DZ" },  // Algeria
  { code: "+244", country: "AO" },  // Angola
  { code: "+54", country: "AR" },   // Argentina
  { code: "+374", country: "AM" },  // Armenia
  { code: "+43", country: "AT" },   // Austria
  { code: "+973", country: "BH" },  // Bahrain
  { code: "+880", country: "BD" },  // Bangladesh
  { code: "+375", country: "BY" },  // Belarus
  { code: "+32", country: "BE" },   // Belgium
  { code: "+975", country: "BT" },  // Bhutan
  { code: "+591", country: "BO" },  // Bolivia
  { code: "+387", country: "BA" },  // Bosnia & Herzegovina
  { code: "+267", country: "BW" },  // Botswana
  { code: "+55", country: "BR" },   // Brazil
  { code: "+359", country: "BG" },  // Bulgaria
  { code: "+855", country: "KH" },  // Cambodia
  { code: "+237", country: "CM" },  // Cameroon
  { code: "+1", country: "CA" },    // Canada
  { code: "+56", country: "CL" },   // Chile
  { code: "+86", country: "CN" },   // China
  { code: "+57", country: "CO" },   // Colombia
  { code: "+506", country: "CR" },  // Costa Rica
  { code: "+385", country: "HR" },  // Croatia
  { code: "+53", country: "CU" },   // Cuba
  { code: "+357", country: "CY" },  // Cyprus
  { code: "+420", country: "CZ" },  // Czech Republic
  { code: "+45", country: "DK" },   // Denmark
  { code: "+593", country: "EC" },  // Ecuador
  { code: "+20", country: "EG" },   // Egypt
  { code: "+372", country: "EE" },  // Estonia
  { code: "+251", country: "ET" },  // Ethiopia
  { code: "+679", country: "FJ" },  // Fiji
  { code: "+358", country: "FI" },  // Finland
  { code: "+33", country: "FR" },   // France
  { code: "+49", country: "DE" },   // Germany
  { code: "+233", country: "GH" },  // Ghana
  { code: "+30", country: "GR" },   // Greece
  { code: "+299", country: "GL" },  // Greenland
  { code: "+224", country: "GN" },  // Guinea
  { code: "+592", country: "GY" },  // Guyana
  { code: "+509", country: "HT" },  // Haiti
  { code: "+504", country: "HN" },  // Honduras
  { code: "+852", country: "HK" },  // Hong Kong
  { code: "+36", country: "HU" },   // Hungary
  { code: "+354", country: "IS" },  // Iceland
  { code: "+62", country: "ID" },   // Indonesia
  { code: "+98", country: "IR" },   // Iran
  { code: "+964", country: "IQ" },  // Iraq
  { code: "+353", country: "IE" },  // Ireland
  { code: "+972", country: "IL" },  // Israel
  { code: "+39", country: "IT" },   // Italy
  { code: "+81", country: "JP" },   // Japan
  { code: "+44", country: "JE" },   // Jersey
  { code: "+962", country: "JO" },  // Jordan
  { code: "+7", country: "KZ" },    // Kazakhstan
  { code: "+254", country: "KE" },  // Kenya
  { code: "+965", country: "KW" },  // Kuwait
  { code: "+996", country: "KG" },  // Kyrgyzstan
  { code: "+961", country: "LB" },  // Lebanon
  { code: "+231", country: "LR" },  // Liberia
  { code: "+218", country: "LY" },  // Libya
  { code: "+370", country: "LT" },  // Lithuania
  { code: "+352", country: "LU" },  // Luxembourg
  { code: "+389", country: "MK" },  // North Macedonia
  { code: "+261", country: "MG" },  // Madagascar
  { code: "+60", country: "MY" },   // Malaysia
  { code: "+960", country: "MV" },  // Maldives
  { code: "+223", country: "ML" },  // Mali
  { code: "+230", country: "MU" },  // Mauritius
  { code: "+52", country: "MX" },   // Mexico
  { code: "+377", country: "MC" },  // Monaco
  { code: "+976", country: "MN" },  // Mongolia
  { code: "+212", country: "MA" },  // Morocco
  { code: "+264", country: "NA" },  // Namibia
  { code: "+977", country: "NP" },  // Nepal
  { code: "+31", country: "NL" },   // Netherlands
  { code: "+64", country: "NZ" },   // New Zealand
  { code: "+234", country: "NG" },  // Nigeria
  { code: "+850", country: "KP" },  // North Korea
  { code: "+47", country: "NO" },   // Norway
  { code: "+968", country: "OM" },  // Oman
  { code: "+92", country: "PK" },   // Pakistan
  { code: "+507", country: "PA" },  // Panama
  { code: "+675", country: "PG" },  // Papua New Guinea
  { code: "+595", country: "PY" },  // Paraguay
  { code: "+51", country: "PE" },   // Peru
  { code: "+63", country: "PH" },  // Philippines
  { code: "+48", country: "PL" },   // Poland
  { code: "+351", country: "PT" },  // Portugal
  { code: "+974", country: "QA" },  // Qatar
  { code: "+40", country: "RO" },   // Romania
  { code: "+7", country: "RU" },    // Russia
  { code: "+250", country: "RW" },  // Rwanda
  { code: "+966", country: "SA" },  // Saudi Arabia
  { code: "+381", country: "RS" },  // Serbia
  { code: "+421", country: "SK" },  // Slovakia
  { code: "+386", country: "SI" },  // Slovenia
  { code: "+27", country: "ZA" },   // South Africa
  { code: "+82", country: "KR" },   // South Korea
  { code: "+34", country: "ES" },   // Spain
  { code: "+94", country: "LK" },   // Sri Lanka
  { code: "+249", country: "SD" },  // Sudan
  { code: "+46", country: "SE" },   // Sweden
  { code: "+41", country: "CH" },   // Switzerland
  { code: "+963", country: "SY" },  // Syria
  { code: "+886", country: "TW" },  // Taiwan
  { code: "+992", country: "TJ" },  // Tajikistan
  { code: "+255", country: "TZ" },  // Tanzania
  { code: "+66", country: "TH" },   // Thailand
  { code: "+216", country: "TN" },  // Tunisia
  { code: "+90", country: "TR" },   // Turkey
  { code: "+993", country: "TM" },  // Turkmenistan
  { code: "+256", country: "UG" },  // Uganda
  { code: "+380", country: "UA" },  // Ukraine
  { code: "+598", country: "UY" },  // Uruguay
  { code: "+998", country: "UZ" },  // Uzbekistan
  { code: "+58", country: "VE" },   // Venezuela
  { code: "+84", country: "VN" },   // Vietnam
  { code: "+967", country: "YE" },  // Yemen
  { code: "+260", country: "ZM" },  // Zambia
  { code: "+263", country: "ZW" }   // Zimbabwe
];


// Modal component for social sharing
const ShareModal = ({ isOpen, onClose, propertyDetails }) => {
  if (!isOpen) return null;

    const titleSlug = propertyDetails.title
    ? propertyDetails.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    : '';
    
 const propertyLink = `${window.location.origin}/details/${propertyDetails.id}/${titleSlug}`;
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(propertyLink)
      .then(() => {
        toast.success("Link copied to clipboard!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
        });
      })
      .catch(() => {
        toast.error("Failed to copy link!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
        });
      });
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        propertyLink
      )}`,
      "_blank"
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        propertyLink
      )}&text=${encodeURIComponent(
        `Check out this property: ${propertyDetails.title}`
      )}`,
      "_blank"
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        propertyLink
      )}`,
      "_blank"
    );
  };

  const shareByEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(
        `Property Listing: ${propertyDetails.title}`
      )}&body=${encodeURIComponent(
        `Check out this property I found: ${propertyLink}`
      )}`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Share this property</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 mb-2">Share via:</p>
          <div className="flex space-x-4">
            <button
              onClick={shareToFacebook}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              <FaFacebook size={24} />
            </button>
            <button
              onClick={shareToTwitter}
              className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500"
            >
              <FaTwitter size={24} />
            </button>
            <button
              onClick={shareToLinkedIn}
              className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800"
            >
              <FaLinkedin size={24} />
            </button>
            <button
              onClick={shareByEmail}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <FaEnvelope size={24} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-600 mb-2">Or copy link:</p>
          <div className="flex">
            <input
              type="text"
              value={propertyLink}
              readOnly
              className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCopyLink}
              className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
            >
              <FaLink size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailsPage = () => {
  const location = useLocation();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [relevantProperties, setRelevantProperties] = useState([]);
  const navigate = useNavigate();
  const { id, title } = useParams();
  const [seo, setSeo] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // Add image loading states
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrorStates, setImageErrorStates] = useState({});
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91"); // Default to India

 const slug = title ? title.toLowerCase().replace(/\s+/g, "-") : "";

  const toggleAmenities = () => {
    setShowAllAmenities(!showAllAmenities);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };
  
  useEffect(() => {
    console.log("locationlocation", id);
  });
  
  const [propertyDetails, setPropertyDetails] = useState({
    id: 1,
    title: "",
    location: "",
    priceRange: "",
    developer: "",
    mainImage: "",
    highlightTitle: "",
    highlights: [],
    postHighlights: "",
    gallery: [],
    details: {
      possessionStatus: "",
      averagePrice: "",
      buildupArea: "",
      ownerType: "",
      furnishing: "",
      postedOn: "",
      facing: "",
      parking: "",
      floor: "",
      possessionDate: "",
    },
    propertyAmenities: [
      {
        name: "",
        icon: "",
      },
    ],
    floorSections: {
      image: "",
      averagePrice: "",
      status: "",
      buildUpArea: "",
    },
    description: "",
  });
  
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion(`${num1} + ${num2}`);
    setCaptchaAnswer((num1 + num2).toString());
  };

  useEffect(() => {
    generateCaptcha();
  }, []);
  
  const [aboutDeveloper, setAboutDeveloper] = useState({
    description: "",
    developerTitle: "",
    established: "",
    totalProjects: "",
    developerLogo: "",
  });

  const [projectBrochure, setProjectBrochure] = useState([
    { id: "", image: "" },
  ]);
  const [orderedImages, setOrderedImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Image loading handlers
  const handleImageLoad = (imageUrl) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [imageUrl]: false
    }));
    setImageErrorStates(prev => ({
      ...prev,
      [imageUrl]: false
    }));
  };

  const handleImageLoadStart = (imageUrl) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [imageUrl]: true
    }));
     setImageErrorStates(prev => ({
      ...prev,
      [imageUrl]: false
    }));
  };

   const handleImageError = (imageUrl) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [imageUrl]: false
    }));
    setImageErrorStates(prev => ({
      ...prev,
      [imageUrl]: true
    }));
  };

  // Skeleton component for loading images
  const ImageSkeleton = ({ className, isError = false }) => (
    <div className={` ${isError ? 'h-[200px] relative bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200' : 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'} bg-[length:200%_100%] animate-pulse rounded-md`}>
      <div className="w-full h-full flex items-center justify-center">
        {isError ? (
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
    </div>
  );

  // Handle thumbnail click - only change main image, no popup
  const handleThumbnailClick = (clickedImage) => {
    setOrderedImages((prevImages) => {
      const index = prevImages.indexOf(clickedImage);
      if (index !== -1) {
        const updatedImages = [...prevImages];
        [updatedImages[0], updatedImages[index]] = [
          updatedImages[index],
          updatedImages[0],
        ]; // Swap images
        return updatedImages;
      }
      return prevImages;
    });
  };

   // Handle main image click - show popup starting from current main image
  const handleMainImageClick = () => {
    const mainImageIndex = propertyDetails.gallery.findIndex(img => img === orderedImages[0]);
    setActiveImageIndex(mainImageIndex >= 0 ? mainImageIndex : 0);
    setModalOpen(true);
  };

  // Handle "+X more" overlay click - show popup with all images
  const handleMoreImagesClick = () => {
    setActiveImageIndex(0); // Start from first image in gallery
    setModalOpen(true);
  };

   // Keep the old handleImageClick for compatibility (can be removed if not used elsewhere)
  // const handleImageClick = (clickedImage) => {
  //   setOrderedImages((prevImages) => {
  //     const index = prevImages.indexOf(clickedImage);
  //     if (index !== -1) {
  //       const updatedImages = [...prevImages];
  //       [updatedImages[0], updatedImages[index]] = [
  //         updatedImages[index],
  //         updatedImages[0],
  //       ]; // Swap images
  //       return updatedImages;
  //     }
  //     return prevImages;
  //   });
  //   setModalOpen(true);
  //   setActiveImageIndex(0);
  // };

  const handlePrevImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? propertyDetails.gallery.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === propertyDetails.gallery.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (propertyDetails.gallery.length > 0) {
      // Only set orderedImages if there are multiple images
      setOrderedImages([propertyDetails.mainImage, ...propertyDetails.gallery.filter(image => image !== propertyDetails.mainImage)]);
    } else {
      setOrderedImages([propertyDetails.mainImage]); // No duplication, only the main image
    }
  }, [propertyDetails]);

  const additionalImagesCount = Math.max(propertyDetails.gallery.length - 4, 0);

  // State for selected tab
  const [activeTab, setActiveTab] = useState("Overview / Home");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
  } = useForm({
    resolver: zodResolver(enquirySchema),
    mode: "onChange",
  });

  // Set default country code value
  useEffect(() => {
    setValue("countryCode", "+91");
  }, [setValue]);

  // Refs for each section
  const refs = {
    "Overview / Home": useRef(null),
    "Highlights": useRef(null),
    "About Project": useRef(null),
    "Floor Plan": useRef(null),
    "Amenities": useRef(null),
    "Project Brochure": useRef(null),
    "About Developer": useRef(null),
  };

  // Array of tab names.
  const tabs = Object.keys(refs);

  const onTabClick = (tab) => {
    setActiveTab(tab);
    const sectionRef = refs[tab];
    if (sectionRef && sectionRef.current) {
      const topOffset = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const stickyHeaderOffset = 100; // Adjust this to match your sticky header height

      window.scrollTo({
        top: topOffset - stickyHeaderOffset,
        behavior: "smooth",
      });
    }
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-md z-10 bg-white"
      >
        <FaArrowRight className="w-4" />
      </button>
    );
  };

  // Slider settings for brochure sections
  const brochureSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: (
      <FaChevronRight color="black" className="text-gray-600 w-8 h-8" />
    ),
    prevArrow: (
      <FaChevronLeft color="black" className="text-gray-600 w-8 h-8" />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const onSubmit = async (data) => {
    if (userCaptchaInput !== captchaAnswer) {
      toast.error("Incorrect captcha answer!");
      return;
    }
    setLoading(true);
    const outputData = { ...data, property_id: id };
    try {
      const response = await api.post("property-enquiries", outputData);
      console.log("response", response.status);
      if (response.status === 200) {
        toast.success("Enquiry submitted successfully!");
        dispatch(setIsModalOpen(false));
        reset();
        setFormSubmitted(true);
        generateCaptcha(); // Reset captcha
        setUserCaptchaInput(""); // Clear captcha input
        setTermsAccepted(false); // Reset terms checkbox
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
    setLoading(false);
  };

  const GetPropertyDetails = async () => {
    setIsLoading(true); // Set loading to true before API call
    try {
      const response = await api.get(
        `get-property-details/${id}`
      );
      const {
        propertyDetails,
        aboutDeveloper,
        projectBrochure,
        relavantProperties,
      } = response.data.data;
      console.log("propertyDetails", propertyDetails);
      window.scrollTo(0, 0);
      setPropertyDetails(propertyDetails);
      setProjectBrochure(projectBrochure);
      setAboutDeveloper(aboutDeveloper);
      setRelevantProperties(relavantProperties);
    } catch (error) {
      console.error("Failed to fetch property details:", error);
      // Optionally, handle error in UI state
    } finally {
      setIsLoading(false); // Set loading to false after API call completes (success or error)
    }
  };

  useEffect(() => {
    GetPropertyDetails();
  }, [id]);

 

  const generatePDF = async (brochureList) => {
    const pdf = new jsPDF();

    for (let i = 0; i < brochureList.length; i++) {
      if (i !== 0) pdf.addPage();
      pdf.setFontSize(16);
      pdf.text(`Project Brochure - Image ${brochureList[i].id}`, 10, 20);

      try {
        const img = await fetchImage(brochureList[i].image);
        pdf.addImage(img, "PNG", 10, 30, 180, 120);
      } catch (error) {
        console.error("Error loading image:", error);
        pdf.text("Image could not be loaded", 10, 50);
      }
    }

    pdf.save("project_brochure.pdf");
  };

  const fetchImage = async (url) => {
    try {
      const response = await fetch(url, { mode: "no-cors" });
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  const downloadFile = (url, filename) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || url.split("/").pop();
    a.target = "_blank"; // Remove this line to prevent opening in new tab
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadBrochureZip = async () => {
    const zip = new JSZip();
    const imgFolder = zip.folder("project_brochure");

    try {
      // Add all brochure files to zip
      await Promise.all(
        projectBrochure.map(async (item, index) => {
          const response = await fetch(item.image);
          const blob = await response.blob();
          const filename = `brochure_${index + 1}.${blob.type.split("/")[1]}`;
          imgFolder.file(filename, blob);
        })
      );

      // Generate zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "project_brochure.zip");
    } catch (error) {
      console.error("Error creating zip file:", error);
      toast.error("Failed to download brochure");
    }
  };

  // Remove the generatePDF function and update the download button
  const getFileNameFromUrl = (url) => {
    const decodedUrl = decodeURIComponent(url);
    return decodedUrl.split("/").pop().split("?")[0];
  };

  // Fallback for dates: if date is not available, display "N/A"
  const formatDate = (dateString) => {
    return dateString && dateString.trim() !== "" ? dateString : "N/A";
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };
  
  const displayedImages = orderedImages.slice(1,4);
  const hasMoreImages = additionalImagesCount > 0;
  
  useEffect(() => {
    console.log("propertyDetails1", propertyDetails.isFavourites);
  }, []);

  const isAuthenticated = localStorage.getItem("access_token");

  const isFavoriteFetch = async (id, status) => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      dispatch(setIsNavbarModalOpen("login"));
      return;
    }

    try {
      const response = await api.post("/buyer/wishlist/", {
        property_id: id,
        status: status,
      });
      toast.success(response.data.status);
      GetPropertyDetails();
      // SearchFetch();
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0); // 👈 Scrolls to the top
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const stickyHeaderOffset = 100;
      let currentTab = tabs[0];
      for (let i = 0; i < tabs.length; i++) {
        const ref = refs[tabs[i]];
        if (ref && ref.current) {
          const sectionTop = ref.current.getBoundingClientRect().top + window.scrollY - stickyHeaderOffset;
          if (scrollPosition >= sectionTop) {
            currentTab = tabs[i];
          } else {
            break;
          }
        }
      }
      if (currentTab !== activeTab) {
        setActiveTab(currentTab);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tabs, refs, activeTab]);

  return (
    <Layout>
      {title && (
  <Seo slug={title} property={propertyDetails} />
)}

      <div className="container mx-auto p-0 md:p-4 my-4 md:my-0">
        <div className="max-w-7xl mx-auto px-4 md:px-0 py-4 md:py-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-0">
             {orderedImages.length > 0 ? (
              <>
                {/* Main Image with Skeleton Loading */}
                <div className={`${orderedImages.length === 1 ? 'md:col-span-3' : 'md:col-span-2'} relative`}>
                   {(imageLoadingStates[orderedImages[0]] || imageErrorStates[orderedImages[0]]) && (
                    <ImageSkeleton 
                      className="absolute inset-0 z-10" 
                      isError={imageErrorStates[orderedImages[0]]}
                    />
                  )}
                   {!imageErrorStates[orderedImages[0]] && (    
                    <img
                      src={orderedImages[0]}    
                      alt="Property"    
                      onLoadStart={() => handleImageLoadStart(orderedImages[0])}  
                      onLoad={() => handleImageLoad(orderedImages[0])}   
                      onError={() => handleImageError(orderedImages[0])}  
                      onClick={handleMainImageClick}   
                      className="rounded-md w-full h-72 md:h-96 object-cover cursor-pointer transition-opacity duration-300"
                      style={{   
                        opacity: imageLoadingStates[orderedImages[0]] ? 0 : 1   
                      }}   
                    />    
                  )}
                </div>    

                {/* Thumbnail Gallery with Skeleton Loading */}    
                {orderedImages.length > 1 && (
                  <div className="grid grid-cols-2 gap-2">    
                    {displayedImages.map((image, index) => (    
                      <div key={index} className="relative h-32 md:h-44">   
                        {imageLoadingStates[image] && (
                          <ImageSkeleton className="absolute inset-0 z-10" />
                        )}
                        <img
                          src={image || placeholderImage}
                          alt={`Gallery ${index + 1}`}
                          onLoadStart={() => handleImageLoadStart(image)}
                          onLoad={() => handleImageLoad(image)}
                          onError={(e) => {
                            e.target.src = placeholderImage;
                            handleImageLoad(image);
                          }}
                          className="rounded-md w-full h-full object-cover cursor-pointer transition-opacity duration-300 hover:opacity-80"
                          onClick={() => handleThumbnailClick(image)}
                          style={{ 
                            opacity: imageLoadingStates[image] ? 0 : 1 
                          }}
                        />
                      </div>
                    ))}
                    
                    {/* "+X More" Overlay with Skeleton Loading */}
                    {hasMoreImages && (
                      <div className="relative h-32 md:h-44">
                        {imageLoadingStates[orderedImages[displayedImages.length + 1]] && (    
                          <ImageSkeleton className="absolute inset-0 z-10" />      
                        )}
                        <img
                          src={orderedImages[displayedImages.length + 1] || placeholderImage}
                          alt={`Gallery more`}
                          onLoadStart={() => handleImageLoadStart(orderedImages[displayedImages.length + 1])}
                          onLoad={() => handleImageLoad(orderedImages[displayedImages.length + 1])}
                          onError={(e) => {
                            e.target.src = placeholderImage;
                            handleImageLoad(orderedImages[displayedImages.length + 1]);
                          }}
                          className="rounded-md w-full h-full object-cover brightness-50"
                          style={{ 
                            opacity: imageLoadingStates[orderedImages[displayedImages.length + 1]] ? 0 : 1 
                          }}
                        />
                        <div
                          onClick={handleMoreImagesClick}
                          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-md cursor-pointer hover:bg-opacity-50 transition-all duration-200"
                        >
                          <div className="text-white text-2xl font-bold flex items-center">
                            +{additionalImagesCount}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              // Fallback for no images with Skeleton Loading
              <div className="md:col-span-3">
                <div className="w-full h-72 md:h-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-md flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-4 text-gray-500">
                    <div className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-lg font-medium">Loading images...</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Title and Action */}
          {isLoading ? (
            /* Skeleton Loader - Responsive */
            <div className="mt-4 p-4 border rounded-md bg-white animate-pulse">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                {/* Left Content Skeleton */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="h-7 w-3/4 sm:w-48 bg-gray-200 rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-4 w-3/5 sm:w-40 bg-gray-200 rounded"></div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-4 w-4/5 sm:w-64 bg-gray-200 rounded"></div>
                  </div>
                </div>
                
                {/* Right Price Skeleton */}
                <div className="h-7 w-32 bg-gray-200 rounded self-end md:self-auto"></div>
              </div>
            </div>
          ) : (
            /* Real Content - Responsive */
            <div className="mt-4 p-4 border rounded-md bg-white">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                {/* Left Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">
                      {propertyDetails.title || "Untitled Property"}
                    </h1>
                    <div className="flex gap-2">
                      <IoMdShareAlt
                        size={20}
                        className="text-white bg-blue-500 p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                        onClick={handleShare}
                      />
                      <AiFillHeart
                        onClick={() => isFavoriteFetch(propertyDetails.id, propertyDetails.isFavourites)}
                        className={`cursor-pointer text-2xl hover:scale-110 transition-transform ${
                          propertyDetails.isFavourites ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm sm:text-base">
                    By{" "}
                    <span className="cursor-pointer hover:underline hover:text-blue-600 transition-colors">
                      {propertyDetails.developer || "Unknown Developer"}
                    </span>
                  </p>
                  
                  <p className="text-gray-600 text-sm sm:text-base flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-500 min-w-[16px]" />
                    <span>{propertyDetails.location || "Location not available"}</span>
                  </p>
                </div>
                
                {/* Right Price */}
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-medium">
                    {propertyDetails.priceRange || "Price Not Available"}
                  </p>
                  
{/* WhatsApp Site Visit Button */}
<a
  href={`https://wa.me/918925997080?text=${encodeURIComponent(
    `Hi, I am interested in ${propertyDetails.title} (${propertyDetails.location}). Kindly share the details.`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="
    mt-2 inline-block 
    text-white font-medium
    px-5 py-2.5
    rounded-lg
    transition-all 
    relative overflow-hidden
    sitevisit-btn custom-sitevisit-color
  "
>
  BOOK A SITE VISIT
</a>


<style>
{`
/* 🎨 MAIN BUTTON COLOR (edit anytime) */
.custom-sitevisit-color {
  background-color: #00b3ffff;  /* Main Color */
  transition: background-color 0.3s ease;
}

/* ✨ Hover — Light color version */
.custom-sitevisit-color:hover {
  background-color: #0095d5ff;  /* lighter shade */
}

@keyframes shine {
  0% { left: -150%; }
  100% { left: 150%; }
}

`}
</style>
                </div>
              </div>
            </div>
          )}

          {/* Tabs Section */}
          <div
            className="border-b pt-2 py-0 bg-white my-5 mx-0 w-full sticky top-[65px] h-fit project-detail-tab"
          >
            <div className="flex flex-col product-detail-nav-slider " style={{ minHeight: '48px', zIndex: 10 }}>
              <Swiper
                modules={[Scrollbar]}
                slidesPerView={
                  window.innerWidth <= 480 ? 2 :
                  window.innerWidth <= 768 ? 4 :
                  Math.min(9, tabs.length)
                }
                spaceBetween={4}
                scrollbar={{ draggable: true, hide: false }}
                style={{ width: '100%', minHeight: '48px',}}
                breakpoints={{
                  480: { slidesPerView: 2 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: Math.min(9, tabs.length) },
                }}
              >
                {tabs.map((tab, i) => (
                  <SwiperSlide key={i} style={{ width: 'auto', minHeight: '40px', marginRight: '13px'}}>
                    <button
                      className={`property__tab_header whitespace-nowrap text-sm py-2 mx-auto ${activeTab === tab
                        ? "font-medium text-blue-600 active-nav"
                        : ""
                        }`}
                      onClick={() => onTabClick(tab)}
                    >
                      {tab}
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 px-0">
            {/* Left Column: Content Sections */}
            <div className="md:col-span-2 space-y-4">
              {/* Overview / Home Section */}
              <div
                ref={refs["Overview / Home"]}
                className="p-4 border rounded-md bg-white"
              >
                <h2 className="font-medium  pb-3 border-b border-gray-100">Overview / Home</h2>
                <p className="mt-5">
                  {propertyDetails.description || "Description not available."}
                </p>
              </div>

              {/* Highlights Section */}
              <div
                ref={refs["Highlights"]}
                className="p-4 border rounded-md bg-white"
              >
                <h2 className="font-medium  pb-3 border-b border-gray-100">Highlights</h2>
                {propertyDetails.postHighlights ? (
                  <div
                    className="rich-text-container py-2"
                    dangerouslySetInnerHTML={{
                      __html: propertyDetails.postHighlights,
                    }}
                  />
                ) : (
                  <ul className="list-disc pl-5">
                    {propertyDetails.highlights?.length > 0 ? (
                      propertyDetails.highlights.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>No highlights available.</li>
                    )}
                  </ul>
                )}
              </div>

              {/* About Project Section */}
              <div
                ref={refs["About Project"]}
                className="p-4 border rounded-md bg-white"
              >
                <h2 className="font-medium  pb-3 border-b border-gray-100">About Project</h2>
                <p className="leading-relaxed pb-3 mt-5">
                  {propertyDetails.aboutProject || "Description not available."}
                </p>
              </div>

              {/* Floor Plan Section */}
              <div 
                ref={refs["Floor Plan"]}
                className="p-6 border rounded-xl bg-white shadow-sm"
              >
                <h2 className="font-medium  pb-3 border-b border-gray-100">
                Floor Plans
                </h2>
                
                {/* Floor Plan Images Slider */}
                <div className="relative">
                  {Array.isArray(propertyDetails.floorSections?.images) && 
                  propertyDetails.floorSections.images.length > 0 ? (
                    <div className="relative">
                      <Slider
                        dots={false}
                        infinite={true}
                        speed={500}
                        slidesToShow={1}
                        slidesToScroll={1}
                        adaptiveHeight={true}
                        className="floor-plan-slider"
                      >
                        {propertyDetails.floorSections.images.map((imgUrl, idx) => (
                          <div key={idx} className="px-2 sm:px-4">
                            <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 h-64 sm:h-80 mt-3">
                              <img
                                src={imgUrl}
                                alt={`Floor Plan ${idx + 1}`}
                                onError={(e) => {
                                  e.target.src = floorImage;
                                }}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 h-64 sm:h-80 mt-3">
                      <img
                        src={propertyDetails.floorSections?.image || floorImage}
                        alt="Floor Plan"
                        onError={(e) => {
                          e.target.src = floorImage;
                        }}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Floor Plan Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FaRupeeSign className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-600 text-sm">Average Price</h2>
                      <p className="text-gray-800 font-medium">
                        {propertyDetails.floorSections?.averagePrice || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-full">
                      <MdAddchart className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-600 text-sm">Status</h2>
                      <p className="text-gray-800 font-medium">
                        {propertyDetails.floorSections?.status || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <BiBuildingHouse className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-600 text-sm">Buildup Area</h2>
                      <p className="text-gray-800 font-medium">
                        {propertyDetails.floorSections?.buildUpArea || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div 
                ref={refs["Amenities"]}
                className="p-4 sm:p-6 border rounded-xl bg-white shadow-sm"
              >
                <h2 className="font-medium  pb-3 border-b border-gray-100">
                  Property Amenities
                </h2>

                
                {propertyDetails?.propertyAmenities?.length > 0 ? (
                  <div className="mt-4">
                    {/* Amenities Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                      {(showAllAmenities 
                        ? propertyDetails.propertyAmenities 
                        : propertyDetails.propertyAmenities.slice(0, 10)
                      ).map((amenity, index) => {
                        const svgContent = amenity.icon?.split('/amenity_icons/')[1] || '';
                        const sanitizedSVG = DOMPurify.sanitize(svgContent);

                        return (
                          <div 
                            key={index} 
                            className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            {svgContent ? (
                              <div 
                                className="w-10 h-10 flex items-center justify-center text-blue-600 [&>svg]:w-6 [&>svg]:h-6"
                                dangerouslySetInnerHTML={{ __html: sanitizedSVG }}
                              />
                            ) : (
                              <img
                                src={placeholderImage}
                                alt={amenity.name}
                                className="w-10 h-10 object-contain"
                                onError={(e) => {
                                  e.target.src = placeholderImage;
                                }}
                              />
                            )}
                            <span className="text-sm sm:text-base font-medium text-gray-700 text-center">
                              {amenity.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* View More/Less Button */}
                    {propertyDetails.propertyAmenities.length > 10 && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={toggleAmenities}
                          className="px-5 py-2.5 bg-white border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                          {showAllAmenities ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                              Show Less
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              View More ({propertyDetails.propertyAmenities.length - 10} more)
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 p-6 text-center bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-2 text-gray-500">No amenities listed for this property</p>
                  </div>
                )}
              </div>

              {/* Project Brochure Section */}
              <div
                ref={refs["Project Brochure"]}
                className="p-4 border rounded-md bg-white"
              >
                <div
                  className="flex justify-between gap-2 align-center"
                  style={{ alignItems: "center" }}
                >
                  <h2 className="font-medium  pb-3 border-b border-gray-100">Project Brochure</h2>

                  {/* Download Icon Overlay */}
                  {projectBrochure && projectBrochure.length > 0 ? (
                    <div className="flex justify-center mt-0">
                      <button
                        onClick={downloadBrochureZip}
                        className="flex items-center gap-2 bg-[#D9EEFF] text-[#0078DB] px-5 py-2 rounded"
                      >
                        <span className="font-medium text-md">
                          Download Brochure
                        </span>
                        <IoMdDownload />
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Brochure Carousel with Navigation */}
                <div className="relative mt-3">
                  <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 snap-x scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {projectBrochure && projectBrochure.length > 0 ? (
                      projectBrochure.map((item) => {
                        const fileUrl = item.image || placeholderImage;
                        const filename = getFileNameFromUrl(fileUrl);
                        const extension = fileUrl.split(".").pop().toLowerCase();
                        const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
// ✅ ESC + Backspace + Outside Click + Scroll
useEffect(() => {
  const handleKeyClose = (event) => {
    if (event.key === "Escape" || event.key === "Backspace") {
      closeModal();
    }
  };

  if (modalOpen) {
    document.addEventListener("keydown", handleKeyClose);
  }

  return () => {
    document.removeEventListener("keydown", handleKeyClose);
  };
}, [modalOpen]);

// ✅ Add scroll only inside modal
useEffect(() => {
  if (modalOpen) {
    // Prevent background scroll but allow modal scroll
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
  return () => {
    document.body.style.overflow = "auto";
  };
}, [modalOpen]);


                        return (
                          <div
                            key={item.id}
                            className="relative grid grid-col-4 w-48 flex-none snap-start"
                            style={{ minWidth: '160px' }}
                          >
                            {imageExtensions.includes(extension) ? (
                              <img
                                src={fileUrl}
                                alt="Brochure"
                                onError={(e) => {
                                  e.target.src = placeholderImage;
                                }}
                                className="rounded-lg w-full h-48 object-cover"
                              />
                            ) : extension === "pdf" ? (
                              <div className="flex items-center justify-center rounded-lg w-full h-48 bg-gray-100">
                                <FaFilePdf size={50} className="text-red-500" />
                              </div>
                            ) : extension === "doc" || extension === "docx" ? (
                              <div className="flex items-center justify-center rounded-lg w-full h-48 bg-gray-100">
                                <FaFileWord size={50} className="text-blue-500" />
                              </div>
                            ) : extension === "xls" || extension === "xlsx" ? (
                              <div className="flex items-center justify-center rounded-lg w-full h-48 bg-gray-100">
                                <FaFileExcel
                                  size={50}
                                  className="text-green-500"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center rounded-lg w-full h-48 bg-gray-100">
                                <FaFileAlt size={50} className="text-gray-500" />
                              </div>
                            )}

                            {/* Download Icon Overlay - FIXED: positioned correctly inside each brochure item */}
                            <div
                              className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer shadow-md"
                              onClick={() => downloadFile(fileUrl, filename)}
                            >
                              <IoMdDownload size={16} className="text-blue-500" />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>No brochure available.</p>
                    )}
                  </div>

                  {/* Navigation Arrows (only show if more than 5 items) */}
                  {projectBrochure && projectBrochure.length > 5 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
                        onClick={() => document.querySelector('.hide-scrollbar').scrollBy({ left: -180, behavior: 'smooth' })}
                      >
                        <FaChevronLeft className="text-gray-600" />
                      </button>
                      <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
                        onClick={() => document.querySelector('.hide-scrollbar').scrollBy({ left: 180, behavior: 'smooth' })}
                      >
                        <FaChevronRight className="text-gray-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* About Developer Section */}
              <div
                ref={refs["About Developer"]}
                className="p-4 border rounded-md bg-white"
              >
                <h2 className="font-medium  pb-3 border-b border-gray-100">About Developer</h2>
                <div className="flex items-center gap-3 mt-5">
                  <img
                    className="w-14 h-14 rounded-full"
                    src={aboutDeveloper.developerLogo || placeholderImage}
                    alt="Developer Logo"
                    onError={(e) => {
                      e.target.src = placeholderImage;
                    }}
                  />
                  <div>
                    <h2 className=" font-medium">
                      {aboutDeveloper.developerTitle ||
                        "Developer Info Not Available"}
                    </h2>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <h3 className="font-medium">
                          {aboutDeveloper.description || "N/A"}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frequently Asked Questions */}
              <div className="p-4 border rounded-md bg-white faq-accordion">
                <h2 className="font-medium  pb-3 border-b border-gray-100">Frequently Asked Questions</h2>
                {propertyDetails && propertyDetails.faqs?.length > 0 ? (
                  propertyDetails.faqs.map((item) => (
                    <Accordion
                      key={item.id}
                      className="my-3 no-border"
                      style={{ borderRadius: "10px" }}
                      sx={{
                        boxShadow: "none",
                        '&:before': {
                          display: 'none',
                        },
                        borderRadius: "10px",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${item.id}-content`}
                        id={`panel${item.id}-header`}
                        sx={{
                          background: "#F5F5F5",
                          padding: "7px 15px",
                          borderRadius: "10px",
                        }}
                      >
                        <h2 className="font-semibold text-[#000000]">
                          {item.question}
                        </h2>
                      </AccordionSummary>
                      <AccordionDetails>
                        <p>{item.answer}</p>
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <p>No FAQs available.</p>
                )}
              </div>
            </div>

            {/* Right Column: Enquiry Form */}
            <div className="w-full lg:w-96 xl:w-[28rem] sticky top-[130px] md:top-[118px] h-fit">
              {formSubmitted ? (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center">
                  <div className="bg-green-100 text-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Thank You!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your enquiry has been submitted successfully. Our team will contact you shortly.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Enquire About This Property
                  </h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register("name")}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Mobile Field with Country Code Dropdown */}
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="relative w-28">
                          <select
                            {...register("countryCode")}
                            className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                            value={selectedCountryCode}
                            onChange={(e) => setSelectedCountryCode(e.target.value)}
                          >
                            {countryCodes.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.code} ({country.country})
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </div>
                        </div>
                        <input
                          id="mobile"
                          type="tel"
                          {...register("mobile")}
                          className={`flex-1 px-4 py-2.5 rounded-lg border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                          placeholder="9876543210"
                        />
                      </div>
                      {errors.mobile && (
                        <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        {...register("message")}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                        placeholder="Your message or questions..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="consent"
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <label htmlFor="consent" className="ml-3 text-sm text-gray-700">
                        I agree to be contacted by Homewala and agents via WhatsApp, SMS, Phone, Email etc.
                      </label>
                    </div>

                    {/* CAPTCHA */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Solve CAPTCHA:
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

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || !termsAccepted}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                        termsAccepted 
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-md'
                          : 'bg-gray-400 cursor-not-allowed'
                      } flex items-center justify-center`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Submit Enquiry'
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
          <section className="pt-5 px-0">
            <div className="max-w-7xl mx-auto text-center">
              <div className="flex justify-between items-center px-0">
                <h2 className="font-medium mb-0">Similar Properties</h2>
                <h2
                  onClick={() => navigate("/list-view")}
                  className="font-medium mb-0 cursor-pointer flex justify-center items-center gap-2"
                >
                  View all <FaFastForward />
                </h2>
              </div>
              <RelevantCards relevantProperties={relevantProperties} />
            </div>
          </section>
        </div>


{modalOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 overflow-y-auto"
    onClick={closeModal} // ✅ click outside → close
  >
    <div
      className="relative w-[90%] h-[80vh] max-w-6xl bg-black rounded-lg shadow-lg overflow-hidden py-10"
      onClick={(e) => e.stopPropagation()} // ✅ prevent close on inside click
    >
      {/* Main image with skeleton loading */}
      <div className="w-full h-full flex items-center justify-center relative">
        {/* Skeleton Loading Overlay */}
        {imageLoadingStates[propertyDetails.gallery[activeImageIndex]] && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="flex flex-col items-center space-y-4">
              {/* Large Loading Spinner */}
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              {/* Loading Text */}
              <div className="text-white text-lg font-medium">
                Loading image...
              </div>
              {/* Skeleton Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-pulse opacity-20 rounded-lg"></div>
            </div>
          </div>
        )}

        <img
          src={
            propertyDetails.gallery[activeImageIndex] || placeholderImage
          }
          alt={`Gallery ${activeImageIndex + 1}`}
          onLoadStart={() =>
            handleImageLoadStart(propertyDetails.gallery[activeImageIndex])
          }
          onLoad={() =>
            handleImageLoad(propertyDetails.gallery[activeImageIndex])
          }
          onError={(e) => {
            e.target.src = placeholderImage;
            handleImageLoad(propertyDetails.gallery[activeImageIndex]);
          }}
          className="w-full h-full object-contain transition-opacity duration-150 ease-linear rounded-md"
          style={{
            opacity: imageLoadingStates[propertyDetails.gallery[activeImageIndex]]
              ? 0.3
              : 1,
          }}
        />

        {/* Close button (same position & style) */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-70 border border-white rounded-md px-3 py-1 text-xl hover:bg-opacity-90 transition-all duration-300 z-20"
        >
          ✕
        </button>
      </div>

      {/* Navigation buttons */}
      {propertyDetails.gallery.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all duration-200 disabled:opacity-50"
            disabled={
              imageLoadingStates[propertyDetails.gallery[activeImageIndex]]
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            onClick={handleNextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all duration-200 disabled:opacity-50"
            disabled={
              imageLoadingStates[propertyDetails.gallery[activeImageIndex]]
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </>
      )}

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
        {activeImageIndex + 1} / {propertyDetails.gallery.length}
      </div>

      {/* Scrollable Thumbnail navigation strip */}
      {propertyDetails.gallery.length > 1 && (
        <div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-[80%] overflow-x-auto scrollbar-thin cursor-grab active:cursor-grabbing scroll-smooth snap-x"
          onMouseDown={(e) => e.currentTarget.classList.add('grabbing')}
          onMouseUp={(e) => e.currentTarget.classList.remove('grabbing')}
        >
          {propertyDetails.gallery.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all duration-200 ${
                index === activeImageIndex
                  ? "border-white"
                  : "border-transparent opacity-60 hover:opacity-80"
              }`}
            >
              <img
                src={image || placeholderImage}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>

    <style jsx global>{`
      .scrollbar-thin::-webkit-scrollbar {
        height: 6px;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 1);
        border-radius: 10px;
      }
      .scrollbar-thin::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
      }
    `}</style>
  </div>
)}
        {/* Modal Section */}
        <EnquiryModel />
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        propertyDetails={propertyDetails}
      />
    </Layout>
  );
};

export default DetailsPage;


