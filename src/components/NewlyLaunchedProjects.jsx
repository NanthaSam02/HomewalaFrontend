import React, { useEffect, useState } from 'react';
import { FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa';
import { api } from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsNavbarModalOpen } from '../features/BasicSlice';
import { toast } from 'react-toastify';

const NewlyLaunchedProjects = () => {
  const dispatch = useDispatch();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem('access_token');

  const handleViewDetails = (projectId, projectTitle) => {
    // if (!isAuthenticated) {
    //   toast.error("Please login to continue");
    //   dispatch(setIsNavbarModalOpen('login'));
    //   return;
    // }
    const titleSlug = projectTitle.toLowerCase().replace(/\s+/g, '-');
    navigate(`/details/${projectId}/${titleSlug}`);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/new-launched-properties');
        const projectData = response.data?.data || [];
        setProjects(projectData);
      } catch (error) {
        console.error('Failed to fetch newly launched projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="py-12 px-6 bg-gray-50 w-full new-launched">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-[28px] text-center mb-4 font-light">
          Trending Projects <span className="text-black font-medium">in Chennai</span>
        </h1>
        <p className="text-center text-gray-600 mb-10">Limited launch offers available</p>

     <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5">
  {projects.slice(0, 9).map((project) => (
    <div
      key={project.id}
      onClick={() => handleViewDetails(project.id, project.title)}
      className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-500 cursor-pointer hover:shadow-2xl hover:-translate-y-2"
    >
      {/* 🖼️ Image */}
      <div className="overflow-hidden relative h-[160px] sm:h-[180px] md:h-[220px]">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* 📄 Details */}
      <div className="p-3 sm:p-4 flex flex-col justify-between min-h-[130px]">
        <div>
          <h3 className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-gray-800 mb-1 line-clamp-1">
            {project.title}
          </h3>

          <p className="text-gray-500 text-[12px] sm:text-[13px] md:text-[14px] flex items-center gap-1 line-clamp-1">
           {project.location || 'Location not available'}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <p className="text-blue-600 font-semibold text-[13px] sm:text-[14px] md:text-[15px]">
            {project.price || '₹ Contact for Price'}
          </p>

          <p className="text-gray-600 text-[12px] sm:text-[13px] md:text-[14px] font-medium flex items-center hover:text-blue-600 transition-colors">
            View Details
            <FaChevronRight className="ml-1 text-[12px]" />
          </p>
        </div>
      </div>
    </div>
  ))}
</div>

        {/* If no projects */}
        {projects.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No trending projects found.
          </div>
        )}
      </div>
    </section>
  );
};

export default NewlyLaunchedProjects;
