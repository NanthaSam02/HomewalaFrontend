import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { api } from "../axiosConfig";

const EliteProjectsSection = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [eliteProjects, setEliteProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(true);

  const projectsPerPage = 3;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/elite-properties");
      const eliteData = response.data.data;
      setEliteProjects(eliteData);

      // Set the first project as selected only after data is fetched
      if (eliteData && eliteData.length > 0) {
        setSelectedProject(eliteData[0]);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate totalPages based on current data
  const totalPages = Math.ceil((eliteProjects?.length || 0) / projectsPerPage);

  // Get visible projects based on current slide
  const getVisibleProjects = () => {
    if (!eliteProjects || eliteProjects.length === 0) return [];

    const startIndex = (currentSlide % totalPages) * projectsPerPage;
    return eliteProjects.slice(startIndex, startIndex + projectsPerPage);
  };

  // Update selected project when slide changes
  useEffect(() => {
    const visibleProjects = getVisibleProjects();
    if (visibleProjects && visibleProjects.length > 0) {
      setSelectedProject(visibleProjects[0]);
    }
  }, [currentSlide, eliteProjects]);

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1.05,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
    },
    centerMode: true,
    centerPadding: "50px",
    cssEase: "ease-in-out",
    easing: "ease-in-out",
  };

  // If loading or no data, show placeholder
  if (
    loading ||
    !eliteProjects ||
    eliteProjects.length === 0 ||
    !selectedProject
  ) {
    return (
      <section className="py-10   md:px-6 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6">
            <div className="flex flex-col gap-4 justify-center">
              <h1 className=" text-3xl md:text-4xl  font-light">
                Elite <span className="text-black font-medium">Projects</span>
              </h1>
              <p className="text-gray-600 text-[15px] tracking-wider">
                Limited launch offers available
              </p>
            </div>
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <div className="flex space-x-2">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex-1 px-1">
                    <div className="rounded-lg overflow-hidden bg-gray-200 h-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative bg-gradient-to-t from-[#d0d4ff] to-[#d4f2ff] rounded-xl p-4 md:p-6 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-t from-[#151e68] to-[#0078db] border border-white text-white w-12 h-12 flex items-center justify-center rounded-md">
                    <span className="text-xl font-bold">...</span>
                  </div>
                  <div>
                    <p className="text-xl font-bold bg-gray-200 h-6 w-24 animate-pulse rounded"></p>
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-xl bg-gray-200 h-6 w-32 animate-pulse rounded"></h2>
                  <p className="text-gray-600 text-sm bg-gray-200 h-4 w-40 mt-1 animate-pulse rounded"></p>
                </div>
                <div className="flex flex-grow justify-center">
                  <h3 className="font-bold text-3xl bg-gray-200 h-8 w-28 animate-pulse rounded"></h3>
                </div>
                <button className="bg-blue-300 text-white py-2 px-4 rounded-md w-full md:w-auto animate-pulse">
                  Contact
                </button>
              </div>
              <div className="md:col-span-2">
                <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const renderProjectCard = () => {
    const visibleProjects = getVisibleProjects();

    return (
      <section
        className="py-10 px-4  md:px-6 w-full relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="max-w-7xl mx-auto relative">
          {/* {!isHovering &&
        <div  className='flex justify-between z-50 mt-72 absolute items-center w-full ml-[50px] '>
          <div >
            <button
                  onClick={handlePrev}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 -ml-8 -mr-10"
                    >
                  <FaArrowLeft className="text-gray-500" />
                    </button>
               </div>
                      <div className=''>
                    <button
                      onClick={handleNext}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 "
                    >
                      <FaArrowRight className="text-gray-500" />
                    </button></div>
        </div>} */}
          <div className="flex flex-col md:flex-row md:justify-end md:items-end mb-6">
            {/* Header */}
            {/* <div className="flex flex-col gap-4 justify-center">
              <h1 className=" text-3xl md:text-[28px] font-light">Elite <span className="text-black font-bold">Projects</span></h1>
              <p className="text-gray-600 text-[15px] tracking-wider">Limited launch offers available</p>
            </div> */}

            {/* Project Thumbnails */}
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <div className="flex space-x-2">
                {visibleProjects.map((project) => (
                  <div key={project.id} className="flex-1 px-1">
                    <div
                      className={`cursor-pointer rounded-lg overflow-hidden ${
                        selectedProject && selectedProject.id === project.id
                          ? "ring-2 ring-blue-500"
                          : " opacity-40"
                      }`}
                      onClick={() => handleProjectClick(project)}
                    >
                      <img
                        className="w-full h-28 object-cover"
                        src={project.image}
                        alt={project.name}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Details Card */}
          {selectedProject && (
            <div className="relative bg-gradient-to-t from-[#d0d4ff] to-[#d4f2ff] rounded-xl p-4 md:p-6 overflow-hidden">
              {/* Navigation arrows for slider - visible only on hover */}
              {/* {isHovering && (
                <>
                  <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10 transition-opacity duration-300">
                    <button
                      onClick={handlePrev}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 -ml-8"
                    >
                      <FaArrowLeft className="text-gray-500" />

                    </button>
                  </div>
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10 transition-opacity duration-300">
                    <button
                      onClick={handleNext}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                    >
                      <FaArrowRight className="text-gray-500" />
                    </button>
                  </div>
                </>
              )} */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left section with logo and title */}
                <div className="flex flex-col space-y-4  md-h-80">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-t from-[#151e68] to-[#0078db] border border-white text-white w-20  h-20 flex items-center justify-center rounded-md">
                      <span className="text-2xl font-medium">
                        {selectedProject.initials}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-medium ">
                        {selectedProject.launchStatus}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-medium text-2xl">
                      {selectedProject.name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {selectedProject.location}
                    </p>
                  </div>
                  <div className="flex flex-grow justify-start">
                    <h3 className="font-bold text-3xl">
                      {selectedProject.price}
                    </h3>
                  </div>
                  <button
                    className="bg-blue-500 text-white py-2 px-4 tracking-wider font-bold rounded-md hover:bg-blue-600 transition-colors w-full md:w-auto"
                    onClick={() =>
                      navigate("/details", {
                        state: { projectId: selectedProject.id },
                      })
                    }
                  >
                    Contact
                  </button>
                </div>

                {/* Center and right sections with project image */}
                <div className="md:col-span-2">
                  <img
                    src={selectedProject.bgImage}
                    alt={selectedProject.name}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="elite-projects-container relative">
      <div className="flex flex-col gap-4 justify-center absolute top-16 px-7">
        <h1 className=" text-3xl md:text-[28px] font-light">
          Elite <span className="text-black font-bold">Projects</span>
        </h1>
        <p className="text-gray-600 text-[15px] tracking-wider">
          Limited launch offers available
        </p>
      </div>
      <div className="flex justify-between z-50 mt-72 absolute items-center w-[85%] ml-[40px]  ">
        <div>
          <button
            onClick={handlePrev}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 -ml-8 "
          >
            <FaArrowLeft className="text-gray-500" />
          </button>
        </div>
        <div className="">
          <button
            onClick={handleNext}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 "
          >
            <FaArrowRight className="text-gray-500" />
          </button>
        </div>
      </div>

      <Slider ref={sliderRef} {...settings}>
        {[...Array(Math.max(1, totalPages))].map((_, index) => (
          <div key={index}>{renderProjectCard()}</div>
        ))}
      </Slider>
    </div>
  );
};

export default EliteProjectsSection;
