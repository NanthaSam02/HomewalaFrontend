import React, { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import "../styles/detailsstyle.css";
import { FaFastForward } from "react-icons/fa";

import {
  FaMapMarkerAlt,
  FaRegHeart,
  FaBuilding,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDown,
} from "react-icons/fa";
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

import "jspdf-autotable";
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

const DetailsPage = () => {
  const location = useLocation();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [relevantProperties, setRelevantProperties] = useState([]);
  const navigate = useNavigate();

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
      setOrderedImages([propertyDetails.mainImage, ...propertyDetails.gallery]);
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
    Highlights: useRef(null),
    "More About Project": useRef(null),
    "About Project": useRef(null),
    "Floor Plan": useRef(null),
    Amenities: useRef(null),
    "Project Brochure": useRef(null),
    "About Developer": useRef(null),
  };

  // Array of tab names.
  const tabs = Object.keys(refs);

  // Scroll to selected section when a tab is clicked
  const onTabClick = (tab) => {
    setActiveTab(tab);
    const sectionRef = refs[tab];
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Slider settings for tabs – horizontal scrolling on mobile
  const tabSetting = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 9,
    slidesToScroll: 1,
    nextArrow: <FaChevronRight className="text-gray-600 w-8 h-8" />,
    prevArrow: <FaChevronLeft className="text-gray-600 w-8 h-8" />,
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
          centerPadding: "30px",
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

  const handleShare = () => {
    const propertyLink = `${window.location.origin}/property/${propertyDetails.id}`;
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

  const [captchaToken, setCaptchaToken] = useState(null);

  const recaptchaRef = useRef(null);

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const onSubmit = async (data) => {
    if (!captchaToken) {
      alert("Please verify that you are not a robot.");
      return;
    }
    setLoading(true);
    const outputData = { ...data, property_id: location.state };
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
      const response = await api.get(`get-property-details/${location.state}`);
      const {
        propertyDetails,
        aboutDeveloper,
        projectBrochure,
        relavantProperties,
      } = response.data.data;
      console.log("propertyDetails", propertyDetails);
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
  }, []);

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

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <div className="md:col-span-2">
              <img
                src={orderedImages[0] || placeholderImage}
                alt="Property"
                onError={(e) => {
                  e.target.src = placeholderImage;
                }}
                onClick={() => handleImageClick(orderedImages[0])}
                className="rounded-md w-full h-72 md:h-96 object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {orderedImages.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={image || placeholderImage}
                  alt={`Gallery ${index + 1}`}
                  onError={(e) => {
                    e.target.src = placeholderImage;
                  }}
                  className="rounded-md w-full h-32 md:h-full object-cover"
                  onClick={() => handleImageClick(image)}
                />
              ))}
              {/* {additionalImagesCount > 0 ? (
              <div className="relative w-full h-32 md:h-full rounded-md overflow-hidden">
                <img
                  src={propertyDetails.gallery[3] || placeholderImage}
                  alt="Gallery 4"
                  onError={(e) => {
                    e.target.src = placeholderImage;
                  }}
                  onClick={() => handleImageClick(image)}
                  className="w-full h-full object-cover rounded-md brightness-50"
                />
                <div className="absolute inset-0 flex justify-center items-center">
                  <span className="text-white text-lg font-bold bg-black bg-opacity-50 rounded-full px-3">
                    +{additionalImagesCount}
                  </span>
                </div>
              </div>
            ) : (
              <img
                src={propertyDetails.gallery[3] || placeholderImage}
                alt="Gallery 4"
                onClick={() => {handleImageClick(image)}}
                onError={(e) => {
                  e.target.src = placeholderImage;
                }}
                className="rounded-md w-full h-32 md:h-full object-cover"
              />
            )} */}
            </div>
          </div>

          {/* Title and Action */}
          <div className="mt-4 p-4 border rounded-md flex flex-col md:flex-row justify-between items-start bg-white">
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
                <FaRegHeart className="text-red-500 text-2xl cursor-pointer" />
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
          <div className="border-b pt-2 py-0 bg-white my-5">
            <div className="flex flex-col product-detail-nav-slider">
              <Slider {...tabSetting}>
                {tabs.map((tab, i) => (
                  <div key={i}>
                    <button
                      className={`property__tab_header whitespace-nowrap text-sm py-2 mx-auto ${
                        activeTab === tab
                          ? "font-medium text-blue-600 underline underline-offset-8 decoration-blue-600 decoration-4 decoration-solid"
                          : ""
                      }`}
                      onClick={() => onTabClick(tab)}
                      style={{
                        color: activeTab === tab ? "#0078DB !important" : "",
                        borderRadius: "10px !important",
                        marginRight: "0px !important",
                      }}
                    >
                      {tab}
                    </button>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {/* Left Column: Content Sections */}
            <div className="md:col-span-2 space-y-4">
              {/* Overview / Home Section */}
              <div
                ref={refs["Overview / Home"]}
                className="p-4 border rounded-md bg-white"
              >
                <h1 className="font-bold  pb-2">Overview / Home</h1>
                <p>
                  {propertyDetails.description || "Description not available."}
                </p>
              </div>

              {/* Highlights Section */}
              <div
                ref={refs["Highlights"]}
                className="p-4 border rounded-md bg-white"
              >
                <h1 className="font-bold py-2">Highlights</h1>
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
                <h1 className="font-bold pb-2">More About Project</h1>
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
                          <p className="text-black font-bold text-md">
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
                <h1 className="font-bold pb-2">About Project</h1>
                <p className="leading-relaxed pb-3">
                  {propertyDetails.description || "Description not available."}
                </p>
                {/* <div className="flex justify-center">
                <button className="flex items-center gap-2 bg-[#D9EEFF] text-[#0078DB] px-5 py-2 rounded">
                  <span className="font-bold text-md">
                    See More About Project
                  </span>
                  <FaAngleDown />
                </button>
              </div> */}
              </div>

              {/* Floor Plan Section */}
              <div
                ref={refs["Floor Plan"]}
                className="p-4 border rounded-md bg-white"
              >
                <h1 className="font-bold pb-2">Floor Plan</h1>
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
                    <MdAttachMoney className="text-gray-600 text-2xl" />
                    <div>
                      <h2 className="font-bold">Average Price</h2>
                      <p className="text-gray-500">
                        {propertyDetails.floorSections.averagePrice || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <MdAddchart className="text-gray-600 text-2xl" />
                    <div>
                      <h2 className="font-bold">Status</h2>
                      <p className="text-gray-500">
                        {propertyDetails.floorSections.status || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <BiBuildingHouse className="text-gray-600 text-2xl" />
                    <div>
                      <h2 className="font-bold">Buildup Area</h2>
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
                    propertyDetails.propertyAmenities.map((v, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <img
                          src={v.icon || placeholderImage}
                          alt={v.name}
                          onError={(e) => {
                            e.target.src = placeholderImage;
                          }}
                          className="w-[40px] h-[40px] object-contain"
                        />{" "}
                        {v.name}
                      </div>
                    ))
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
                  <h1 className="font-bold pb-2">Project Brochure</h1>

                  {/* Download Icon Overlay */}
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
                </div>

                {/* Flex Container for Brochure Items */}
                <div className="flex overflow-x-auto gap-4 pb-4 mt-3">
                  {projectBrochure && projectBrochure.length > 0 ? (
                    projectBrochure.map((item) => {
                      const fileUrl = item.image || placeholderImage;
                      const filename = getFileNameFromUrl(fileUrl);
                      const extension = fileUrl.split(".").pop().toLowerCase();
                      const imageExtensions = [
                        "jpg",
                        "jpeg",
                        "png",
                        "gif",
                        "bmp",
                      ];

                      return (
                        <div
                          key={item.id}
                          className="grid grid-col-4 w-48 relative"
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

                          {/* Download Icon Overlay */}
                          <div
                            className="absolute bottom-2 right-2 bg-white p-1 rounded-full cursor-pointer shadow-md"
                            onClick={() => downloadFile(fileUrl, filename)}
                          >
                            <IoMdDownload size={20} className="text-blue-500" />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>No brochure available.</p>
                  )}
                </div>

                {/* Download Brochure Button */}
                {/* <div className="flex justify-center mt-4">
                <button
                  onClick={downloadBrochureZip}
                  className="flex items-center gap-2 bg-[#D9EEFF] text-[#0078DB] px-5 py-2 rounded"
                >
                  <span className="font-bold text-md">Download Brochure</span>
                  <IoMdDownload />
                </button>
              </div> */}
              </div>

              {/* About Developer Section */}
              <div
                ref={refs["About Developer"]}
                className="p-4 border rounded-md bg-white"
              >
                <h1 className="font-bold pb-2">About Developer</h1>
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
                    <h2 className="text-xl font-bold">
                      {aboutDeveloper.developerTitle ||
                        "Developer Info Not Available"}
                    </h2>
                    <div className="flex gap-4 text-sm">
                      {/* <div>
                      <h3 className="font-bold">{aboutDeveloper.established || "N/A"}</h3>
                      <p>Established In</p>
                    </div> */}
                      <div>
                        <h3 className="font-bold">
                          {aboutDeveloper.description || "N/A"}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <p className="py-2">{aboutDeveloper.description || "Description not available."}</p> */}
              </div>

              {/* Frequently Asked Questions */}
              <div className="p-4 border rounded-md bg-white">
                <h1 className="font-bold pb-2">Frequently Asked Questions</h1>
                {propertyDetails && propertyDetails.faqs?.length > 0 ? (
                  propertyDetails.faqs.map((item) => (
                    <Accordion
                      key={item.id}
                      className="my-3"
                      style={{ borderRadius: "10px" }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${item.id}-content`}
                        id={`panel${item.id}-header`}
                        sx={{
                          background: "#F5F5F5",
                          border: " 1px solid #D8D8D8",
                          padding: "7px 15px",
                          borderRadius: "10px",
                        }}
                      >
                        <h1 className="font-semibold text-[#000000">
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
                    <h1 className="font-bold">Accordion {item}</h1>
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
              <div className=" w-full sticky top-4 h-fit">
                <div className="bg-white border rounded-md p-4">
                  <h1 className="font-bold pb-5">Enquire about the Property</h1>
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
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="YOUR_RECAPTCHA_SITE_KEY" // replace with your actual site key
                        onChange={onCaptchaChange}
                      />
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
          <section className="pt-5 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <div className="flex justify-between items-center px-4">
                <h2 className="font-bold mb-4">Similar Properties</h2>
                <h2
                  onClick={() => navigate("/list-view")}
                  className="font-bold mb-4 cursor-pointer flex justify-center items-center gap-2"
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
    </Layout>
  );
};

export default DetailsPage;
