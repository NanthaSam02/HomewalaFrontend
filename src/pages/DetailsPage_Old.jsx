import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import "../styles/detailsstyle.css";
import { FaFastForward } from "react-icons/fa";
// import { FaChevronRight } from "react-icons/fa";
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
import { useParams } from "react-router-dom";
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

const enquirySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name is too long"),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

// Modal component for social sharing
const ShareModal = ({ isOpen, onClose, propertyDetails }) => {
  if (!isOpen) return null;

  const propertyLink = `${window.location.origin}/property/${propertyDetails.id}`;

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
  const { id } = useParams();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
  const handleImageClick = (clickedImage) => {
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
    setModalOpen(true);
    setActiveImageIndex(index);
  };

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
  } = useForm({
    resolver: zodResolver(enquirySchema),
    mode: "onChange",
  });

  // Refs for each section
  const refs = {
    "Overview / Home": useRef(null),
    "Highlights": useRef(null),
    "More About Project": useRef(null),
    "About Project": useRef(null),
    "Floor Plan": useRef(null),
    "Amenities": useRef(null),
    "Project Brochure": useRef(null),
    "About Developer": useRef(null),
  };

  // Array of tab names.
  const tabs = Object.keys(refs);

  // Scroll to selected section when a tab is clicked
  // const onTabClick = (tab) => {
  //   setActiveTab(tab);
  //   const sectionRef = refs[tab];
  //   if (sectionRef && sectionRef.current) {
  //     sectionRef.current.scrollIntoView({ behavior: "smooth" ,top: 2500 ,position:'absolute' });
  //   }
  // };
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

  const tabSetting = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 9,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: null,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          swipeToSlide: true,
          centerMode: true,
          centerPadding: "0px",
        },
      },
    ],
    swipeToSlide: true,
    className: "gap-slider",
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

  // const handleShare = () => {
  //   const propertyLink = `${window.location.origin}/property/${propertyDetails.id }`;
  //   navigator.clipboard
  //     .writeText(propertyLink)
  //     .then(() => {
  //       toast.success("Link copied to clipboard!", {
  //         position: "top-center",
  //         autoClose: 2000,
  //         hideProgressBar: true,
  //       });
  //     })
  //     .catch(() => {
  //       toast.error("Failed to copy link!", {
  //         position: "top-center",
  //         autoClose: 2000,
  //         hideProgressBar: true,
  //       });
  //     });
  // };

  const [captchaToken, setCaptchaToken] = useState(null);

  const recaptchaRef = useRef(null);

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const onSubmit = async (data) => {
    // if (!captchaToken) {
    //   alert("Please verify that you are not a robot.");
    //   return;
    // }
    if (userCaptchaInput !== captchaAnswer) {
      toast.error("Incorrect captcha answer!");
      return;
    }
    setLoading(true);
    const outputData = { ...data, property_id: location.state || id };
    try {
      const response = await api.post("property-enquiries", outputData);
      console.log("response", response.status);
      if (response.status === 200) {
        toast.success("Enquiry submitted successfully!");
        dispatch(setIsModalOpen(false));
        reset();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
    setLoading(false);
  };

  const GetPropertyDetails = async () => {
    try {
      const response = await api.get(
        `get-property-details/${location.state || id}`
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
  const displayedImages = orderedImages.slice(0, 3);
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

  return (
    <Layout>
      <div className="container mx-auto p-0 md:p-4 my-4 md:my-0">
        <div className="max-w-7xl mx-auto px-4 md:px-0 py-4 md:py-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-0">
            {orderedImages.length > 0 ? (
              <>
                {/* If only one image, span full width */}
                <div className={`${orderedImages.length === 1 ? 'md:col-span-3' : 'md:col-span-2'}`}>
                  <img
                    src={orderedImages[0] || placeholderImage}
                    alt="Property"
                    onError={(e) => {
                      e.target.src = placeholderImage;
                    }}
                    onClick={() => handleImageClick(orderedImages[0])}
                    className="rounded-md w-full h-72 md:h-96 object-cover cursor-pointer"
                  />
                </div>

                {/* Only show the gallery if we have more than one image */}
                {orderedImages.length > 1 && (
                  <div className="grid grid-cols-2 gap-2">
                    {displayedImages.map((image, index) => (
                      <div key={index} className="relative h-32 md:h-44">
                        <img
                          src={image || placeholderImage}
                          alt={`Gallery ${index + 1}`}
                          onError={(e) => {
                            e.target.src = placeholderImage;
                          }}
                          className="rounded-md w-full h-full object-cover cursor-pointer"
                          onClick={() => handleImageClick(image)}
                        />
                      </div>
                    ))}
                    {hasMoreImages && (
                      <div className="relative h-32 md:h-44">
                        <img
                          src={orderedImages[displayedImages.length + 1] || placeholderImage}
                          alt={`Gallery more`}
                          onError={(e) => {
                            e.target.src = placeholderImage;
                          }}
                          className="rounded-md w-full h-full object-cover brightness-50"
                        />
                        <div
                          onClick={() => handleImageClick(orderedImages[displayedImages.length + 1])}
                          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-md cursor-pointer"
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
              // Fallback for no images
              <div className="md:col-span-3">
                <img
                  src={placeholderImage}
                  alt="No property image available"
                  className="rounded-md w-full h-72 md:h-96 object-cover"
                />
              </div>
            )}
          </div>

          {/* Title and Action */}
          <div className="mt-4 p-4 mx-0 border rounded-md flex flex-col md:flex-row justify-between items-start bg-white">
            <div
              className=" space-y-2
          "
            >
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl font-medium">
                  {propertyDetails.title || "Untitled Property"}
                </h1>
                <IoMdShareAlt
                  size={20}
                  className="text-white bg-blue-500 p-1 rounded-full cursor-pointer"
                  onClick={handleShare}
                />
                <AiFillHeart
                  onClick={() =>
                    isFavoriteFetch(
                      propertyDetails.id,
                      propertyDetails.isFavourites
                    )
                  }
                  className={`cursor-pointer text-2xl ${propertyDetails.isFavourites
                    ? "text-red-500"
                    : "text-gray-600"
                    }`}
                />
              </div>
              <p className="text-gray-600 font-medium">
                By{" "}
                <span className="cursor-pointer font-normal hover:underline">
                  {propertyDetails.developer || "Unknown Developer"}
                </span>
              </p>
              <p className="text-gray-600 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                {propertyDetails.location || "Location not available"}
              </p>
            </div>
            <p className="text-2xl font-medium text-black mt-2 md:mt-0">
              {propertyDetails.priceRange || "Price Not Available"}
            </p>
          </div>

          {/* Tabs Section */}
          <div
            className="border-b pt-2 py-0 bg-white my-5 mx-0 w-full sticky top-[65px] h-fit project-detail-tab"

          >
            <div className="flex flex-col product-detail-nav-slider ">
              <Slider {...tabSetting}>
                {tabs.map((tab, i) => (
                  <div key={i} className="relative">
                    <button
                      className={`property__tab_header whitespace-nowrap text-sm py-2 mx-auto ${activeTab === tab
                        ? "font-medium text-blue-600 active-nav"
                        : ""
                        }`}
                      onClick={() => onTabClick(tab)}
                    >
                      {tab}
                    </button>
                  </div>
                ))}
              </Slider>
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
                <h1 className="font-medium pb-2">Overview / Home</h1>
                <p>
                  {propertyDetails.description || "Description not available."}
                </p>
              </div>

              {/* Highlights Section */}
              <div
                ref={refs["Highlights"]}
                className="p-4 border rounded-md bg-white"
              >
                <h1 className="font-medium py-2">Highlights</h1>
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

              {/* More About Project Section */}
              <div
                ref={refs["More About Project"]}
                className="p-4 border rounded-md bg-white"
              >
                <h1 className="font-medium pb-2">More About Project</h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {propertyDetails.moreAboutProjects &&
                    propertyDetails.moreAboutProjects.length > 0 ? (
                    propertyDetails.moreAboutProjects.map((value, i) => (
                      <div className="flex items-center gap-4" key={i}>
                        <img
                          src={value.icon || placeholderImage}
                          alt={value.name}
                          onError={(e) => {
                            e.target.src = placeholderImage;
                          }}
                          className="w-5 h-5 object-contain"
                        />
                        <div className="right-div p-2">
                          <p className="text-black font-medium text-md">
                            {value.title}
                          </p>
                          <p className="text-grey text-md">{value.name}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No additional project information available.</p>
                  )}
                </div>
              </div>

              {/* About Project Section */}
              <div
                ref={refs["About Project"]}
                className="p-4 border rounded-md bg-white"
              >
                <h1 className="font-medium pb-2">About Project</h1>
                <p className="leading-relaxed pb-3">
                  {propertyDetails.aboutProject || "Description not available."}
                </p>
                {/* <div className="flex justify-center">
                <button className="flex items-center gap-2 bg-[#D9EEFF] text-[#0078DB] px-5 py-2 rounded">
                  <span className="font-medium text-md">
                    See More About Project
                  </span>
                  <FaAngleDown />
                </button>
              </div> */}
              </div>

              {/* Floor Plan Section */}
              <div
                ref={refs["Floor Plan"]}
                className="p-4 border rounded-md bg-white relative"
              >
                <h1 className="font-medium pb-2">Floor Plan</h1>
                <div className="flex justify-center">
                  <img
                    src={propertyDetails.floorSections.image || floorImage}
                    alt="Floor Plan"
                    onError={(e) => {
                      e.target.src = floorImage;
                    }}
                    className="max-w-full h-full"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-2 justify-center">
                    <FaRupeeSign className="text-gray-600 text-2xl" />
                    <div>
                      <h2 className="font-medium">Average Price</h2>
                      <p className="text-gray-500">
                        {propertyDetails.floorSections.averagePrice || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <MdAddchart className="text-gray-600 text-2xl" />
                    <div>
                      <h2 className="font-medium">Status</h2>
                      <p className="text-gray-500">
                        {propertyDetails.floorSections.status || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <BiBuildingHouse className="text-gray-600 text-2xl" />
                    <div>
                      <h2 className="font-medium">Buildup Area</h2>
                      <p className="text-gray-500">
                        {propertyDetails.floorSections.buildUpArea || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div
                ref={refs["Amenities"]}
                className="p-4 border rounded-md bg-white"
              >
                <h1 className="font-semibold pb-2 text-[#000000]">
                  Property Amenities
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4 p-4">
                  {propertyDetails.propertyAmenities &&
                    propertyDetails.propertyAmenities.length > 0 ? (
                    propertyDetails.propertyAmenities.map((v, i) => {
                      const svgContent = v.icon?.split('/amenity_icons/')[1] || '';
                      const modifiedSVG = svgContent
                      // .replace(/fill="[^"]*"/g, 'fill="currentColor"')
                      // .replace(/stroke="[^"]*"/g, 'stroke="currentColor"');
                      const sanitizedSVG = DOMPurify.sanitize(modifiedSVG);

                      return (
                        <div key={i} className="flex flex-col items-center gap-2 text-center">
                          {svgContent ? (
                            <span
                              className="w-[30px] h-[30px] text-white inline-block [&>svg]:w-full [&>svg]:h-full"
                              dangerouslySetInnerHTML={{ __html: sanitizedSVG }}
                            />
                          ) : (
                            <img
                              src={placeholderImage}
                              alt={v.name}
                              className="w-[30px] h-[30px] object-contain"
                              onError={(e) => {
                                e.target.src = placeholderImage;
                              }}
                            />
                          )}
                          {v.name}
                        </div>
                      );
                    })
                  ) : (
                    <p>No amenities available.</p>
                  )}
                </div>
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
                  <h1 className="font-medium pb-2">Project Brochure</h1>

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
                <h1 className="font-medium pb-2">About Developer</h1>
                <div className="flex items-center gap-3">
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
                      {/* <div>
                      <h3 className="font-medium">{aboutDeveloper.established || "N/A"}</h3>
                      <p>Established In</p>
                    </div> */}
                      <div>
                        <h3 className="font-medium">
                          {aboutDeveloper.description || "N/A"}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <p className="py-2">{aboutDeveloper.description || "Description not available."}</p> */}
              </div>

              {/* Frequently Asked Questions */}
              <div className="p-4 border rounded-md bg-white faq-accordion">
                <h1 className="font-medium pb-2">Frequently Asked Questions</h1>
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
                        <h1 className="font-semibold text-[#000000]">
                          {item.question}
                        </h1>
                      </AccordionSummary>
                      <AccordionDetails>
                        <p>{item.answer}</p>
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <p>No FAQs available.</p>
                )}

                {/* {[1, 2, 3].map((item) => (
                <Accordion key={item} className="my-3">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${item}-content`}
                    id={`panel${item}-header`}
                  >
                    <h1 className="font-medium">Accordion {item}</h1>
                  </AccordionSummary>
                  <AccordionDetails>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </AccordionDetails>
                </Accordion>
              ))} */}
              </div>
            </div>

            {/* Right Column: Enquiry Form */}
            <div className="space-y-4 flex min-h-screen">
              <div className=" w-full sticky top-[130px] md:top-[118px]  h-fit form-right-sticky">
                <div className="bg-white border rounded-md p-4">
                  <h1 className="font-medium pb-5">
                    Enquire about the Property
                  </h1>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <TextField
                      label="Name"
                      variant="outlined"
                      fullWidth
                      {...register("name")}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      onBlur={() => trigger("name")}
                    />
                    <TextField
                      label="Email ID"
                      variant="outlined"
                      fullWidth
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      onBlur={() => trigger("email")}
                    />
                    <TextField
                      label="Mobile Number"
                      variant="outlined"
                      fullWidth
                      {...register("mobile")}
                      error={!!errors.mobile}
                      helperText={errors.mobile?.message}
                      onBlur={() => trigger("mobile")}
                    />
                    <TextField
                      label="Message"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      {...register("message")}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                      onBlur={() => trigger("message")}
                    />

                    <div className="mt-2 text-sm flex items-start gap-2">
                      <input
                        className="mr-1 mt-1"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        type="checkbox"
                        id="consent"
                      />
                      <label
                        htmlFor="consent"
                        style={{ letterSpacing: "1.2px", fontSize: "12px" }}
                      >
                        I agree to be contacted by Homewala and agents via
                        Whatsapp, SMS, Phone, Email etc
                      </label>
                    </div>
                    {/* <div className="flex justify-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="YOUR_RECAPTCHA_SITE_KEY" // replace with your actual site key
                        onChange={onCaptchaChange}
                      />
                    </div> */}

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <label htmlFor="captcha" className="text-sm font-medium text-gray-700">Solve:</label>
                        <div className="flex gap-2 items-center">
                          <span className="text-md font-semibold">{captchaQuestion}</span>
                          <input
                            type="text"
                            id="captcha"
                            value={userCaptchaInput}
                            onChange={(e) => setUserCaptchaInput(e.target.value)}
                            className="border p-2 rounded w-24 text-center"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-blue-600 text-sm underline"
                        onClick={generateCaptcha}
                      >
                        Refresh
                      </button>
                    </div>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading || !termsAccepted}
                      style={{
                        opacity: termsAccepted ? 1 : 0.5,
                        color: termsAccepted ? "white" : "black",
                        cursor: termsAccepted ? "pointer" : "not-allowed",
                      }}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* Relevant Section */}
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
        {/* Top Section */}

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
            <div className="relative w-full h-full py-20">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 text-white bg-black bg-opacity-50 rounded-full p-2 z-20"
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Main image */}
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={
                    propertyDetails.gallery[activeImageIndex] ||
                    placeholderImage
                  }
                  alt={`Gallery ${activeImageIndex}`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Navigation buttons */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2"
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2"
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

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
                {activeImageIndex + 1} / {propertyDetails.gallery.length}
              </div>
            </div>
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






