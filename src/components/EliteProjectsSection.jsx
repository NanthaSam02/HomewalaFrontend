import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useNavigate, Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { api } from "../axiosConfig";
import "../styles/home.css";
// framer-motion imports are removed as they are no longer needed

const EliteProjectsSection = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [eliteProjects, setEliteProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const projectsPerPage = 3;
  
  // We will let react-slick handle the auto-scroll delay via autoplaySpeed

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/elite-properties");
      const eliteData = response.data.data;
      setEliteProjects(eliteData);
      if (eliteData?.length > 0) setSelectedProject(eliteData[0]);
    } catch (error) {
      console.error("Error fetching elite projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // The total number of groups (pages) of projects that will be shown in the slider
  const totalPages = Math.ceil((eliteProjects?.length || 0) / projectsPerPage);

  // Function to determine which group of projects to display based on the current slide index
  const getVisibleProjects = (slideIndex) => {
    if (!eliteProjects?.length) return [];
    // Ensure slideIndex is within bounds by using modulo totalPages
    const index = slideIndex % totalPages;
    const startIndex = index * projectsPerPage;
    return eliteProjects.slice(startIndex, startIndex + projectsPerPage);
  };

  // Update the currently selected project whenever the slide changes or projects are fetched
  useEffect(() => {
    const visible = getVisibleProjects(currentSlide);
    if (visible.length > 0) setSelectedProject(visible[0]);
  }, [currentSlide, eliteProjects]);

  // Slider navigation handlers
  const handlePrev = () => sliderRef.current?.slickPrev();
  const handleNext = () => sliderRef.current?.slickNext();

  const handleProjectClick = (project) => setSelectedProject(project);

  // React-Slick Settings (Optimized for visible loop transition)
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000, // 🚀 Increased speed to 1000ms (1 second) for a much clearer loop transition
    slidesToShow: 1, // Show one group (page) at a time
    slidesToScroll: 1, // Scroll one group (page) at a time
    arrows: false, // Hide built-in arrows since we use custom ones
    autoplay: true, // Enable auto-scroll
    autoplaySpeed: 5000, // 5 seconds delay for auto-scroll
    pauseOnHover: true,
    fade: false, // Ensure standard horizontal slide transition (NO FADE)
    cssEase: "ease-in-out", // Standard smooth ease for consistent sliding animation
    beforeChange: (current, next) => setCurrentSlide(next), // Update state to trigger content refresh
    adaptiveHeight: true,
  };

  if (loading || !eliteProjects.length)
    return <div className="text-center py-10">Loading...</div>;

  const renderProjectCard = (slideIndex) => {
    // Retrieve the projects for the specific slide being rendered by the slider
    const visibleProjects = getVisibleProjects(slideIndex);

    return (
      <section className="py-5 w-full relative elite-slide">
        <div className="container mx-auto relative">
          {/* Thumbnail Row */}
          <div className="flex flex-col md:flex-row md:justify-end md:items-end mb-6">
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                {visibleProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex-1 transition-transform duration-300 hover:scale-[1.02]" // Simple hover animation added back
                  >
                    <div
                      className={`cursor-pointer rounded-lg overflow-hidden max-w-[190px] ${
                        selectedProject?.id === project.id
                          ? "ring-2 ring-blue-500"
                          : "opacity-70"
                      }`}
                      onClick={() => handleProjectClick(project)}
                    >
                        <img
                          className="w-full rounded-lg object-cover h-20 sm:h-28"
                          src={project.image}
                          alt={project.name}
                        />

                    </div>
                    <p className="hidden sm:block mt-[10px] capitalize font-medium text-[13px] text-center pt-1 max-w-[185px] truncate">
                      {project.name}
                    </p>
                  </div>
                ))}
              </div>
              </div>
          </div>

          {/* Main Project Card */}
          {selectedProject && (
            <div
              className="relative bg-gradient-to-t from-[#d0d4ff] to-[#d4f2ff] rounded-xl p-4 md:p-6 overflow-hidden transition-opacity duration-500" // Added transition
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left Content */}
                <div className="flex flex-col space-y-4 elite-content">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-t from-[#151e68] to-[#0078db] border border-white w-20 h-20 flex items-center justify-center rounded-md overflow-hidden p-[10px]">
                      <img
                        src={selectedProject.adminimage}
                        alt={selectedProject.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                  </div>
                  <div>
                    <p className="text-2xl font-medium">
                      {selectedProject.launchStatus}
                    </p>
                  </div>
                </div>

                  <div>
                    <h2 className="font-medium text-2xl capitalize">
                      {selectedProject.name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {selectedProject.location}
                    </p>
                  </div>

                  <div className="flex flex-grow justify-start">
                    <h3 className="font-bold text-xl sm:text-2xl md:text-3xl">
                      {selectedProject.price}
                    </h3>
                  </div>

                  <button
                    className="bg-blue-500 text-white py-2 px-4 tracking-wider font-medium rounded-md hover:bg-blue-600 transition-colors w-full md:w-auto"
                    onClick={() => {
                      const slug = selectedProject.name
                        .toLowerCase()
                        .replace(/\s+/g, "-");
                      navigate(`/details/${selectedProject.id}/${slug}`);
                    }}
                  >
                    Contact Us
                  </button>
                </div>

                {/* Right Image */}
                <div
                  className="md:col-span-2 relative overflow-hidden rounded-lg transition-transform duration-700 hover:scale-[1.01]" // Simple hover animation added back
                >
                  <Link
                    to={`/details/${selectedProject.id}/${selectedProject.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                  >
                    <img
                        // Key is used here to force re-render when selectedProject changes, providing a content transition effect
                        key={selectedProject.id} 
                        src={selectedProject.bgImage}
                        alt={selectedProject.name}
                        className="w-full h-64 md:h-80 object-cover cursor-pointer transition-opacity duration-1000"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-40 transition-opacity duration-700" />
                  
              {/* elite badge */}
              <span className="
                absolute top-4 left-4
                bg-[#C7A14A]
                text-black text-xs
                px-3 py-1 rounded-full
                tracking-widest
              ">
                ELITE
              </span>
</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };
  // Return
  return (
    <div className="elite-projects-container relative">
      <div className="w-full max-w-7xl mx-auto relative">
        <div className="absolute top-[65px] elite-heading">
          <h2 className="text-[28px] md:text-[28px] font-light mb-1">
            Elite <span className="text-black font-medium">Projects</span>
          </h2>
          <p className="text-gray-600 text-[15px] tracking-wider">
            Limited launch offers available
          </p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative">
        {/* Arrows */}
        <div className="absolute top-[64%] transform -translate-y-1/2 flex justify-between w-full z-50 elite-arrow">
          <button
            onClick={handlePrev}
            className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 opacity-100"
            style={{ pointerEvents: "auto", marginLeft: "-25px" }}
          >
            <FaArrowLeft className="text-black" />
          </button>
          <button
            onClick={handleNext}
            className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100 opacity-100"
            style={{ pointerEvents: "auto", marginRight: "-25px" }}
          >
            <FaArrowRight className="text-black" />
          </button>
        </div>

        {/* Slider */}
        <Slider ref={sliderRef} {...settings} className="w-full max-w-7xl mx-auto">
          {/* The slider generates a slide for each page (group of 3 projects) */}
          {[...Array(Math.max(1, totalPages))].map((_, i) => (
            <div key={i}>{renderProjectCard(i)}</div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default EliteProjectsSection;
