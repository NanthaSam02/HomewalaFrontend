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

  const totalPages = Math.ceil((eliteProjects?.length || 0) / projectsPerPage);

  const getVisibleProjects = () => {
    if (!eliteProjects || eliteProjects.length === 0) return [];
    const startIndex = (currentSlide % totalPages) * projectsPerPage;
    return eliteProjects.slice(startIndex, startIndex + projectsPerPage);
  };

  useEffect(() => {
    const visibleProjects = getVisibleProjects();
    if (visibleProjects.length > 0) {
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
    slidesToShow: 1, // Ensure proper centering
    slidesToScroll: 1,
    arrows: false,
    fade: true, // Enables smooth fade transition
    beforeChange: (current, next) => setCurrentSlide(next),
    centerMode: true,
    centerPadding: "0px", // Proper centering
    cssEase: "ease-in-out",
    easing: "ease-in-out",
  };

  if (loading || !eliteProjects.length || !selectedProject) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const renderProjectCard = () => {
    const visibleProjects = getVisibleProjects();

    return (
      <section
        className="py-10 w-full relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col md:flex-row md:justify-end md:items-end mb-6">
            <div className="w-full md:w-1/2 mt-4 md:mt-0">
              <div className="flex space-x-2">
                {visibleProjects.map((project) => (
                  <div key={project.id} className="flex-1 px-1">
                    <div
                      className={`cursor-pointer rounded-lg overflow-hidden ${
                        selectedProject.id === project.id
                          ? "ring-2 ring-blue-500"
                          : "opacity-40"
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

          {selectedProject && (
            <div className="relative bg-gradient-to-t from-[#d0d4ff] to-[#d4f2ff] rounded-xl p-4 md:p-6 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-t from-[#151e68] to-[#0078db] border border-white text-white w-20 h-20 flex items-center justify-center rounded-md">
                      <span className="text-2xl font-medium">
                        {selectedProject.initials}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-medium">
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
      <div className="w-full max-w-7xl mx-auto relative">
        <div className="absolute top-[65px]">
          <h1 className="text-3xl md:text-4xl font-light">
            Elite <span className="text-black font-bold">Projects</span>
          </h1>
          <p className="text-gray-600 text-[15px] tracking-wider">
            Limited launch offers available
          </p>
        </div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto">
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-50"
        >
          <FaArrowLeft className="text-black text-lg" />
        </button>

        <button
          onClick={handleNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-50"
        >
          <FaArrowRight className="text-black text-lg" />
        </button>


        <Slider ref={sliderRef} {...settings} className="w-full">
          {[...Array(Math.max(1, totalPages))].map((_, index) => (
            <div key={index}>{renderProjectCard()}</div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default EliteProjectsSection;
