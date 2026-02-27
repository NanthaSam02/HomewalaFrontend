import React from "react";
import {
  FaMapMarkerAlt,
  FaHome,
  FaRupeeSign,
  FaBuilding,
  FaHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../axiosConfig";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsNavbarModalOpen,
  setPropertiesList,
} from "../features/BasicSlice";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const { filter } = useSelector((store) => store.basic); // ✅ we use top_pick here
  const dispatch = useDispatch();

  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem("access_token");

  const handleViewDetails = () => {
    const titleSlug = property.title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/details/${property.id}/${titleSlug}`);
  };

  const SearchFetch = async () => {
    try {
      const response = await api.post(
        `get-filtered-listview-properties`,
        filter
      );
      dispatch(setPropertiesList(response.data));
    } catch (error) {
      console.error("Failed to fetch property details:", error);
    }
  };

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
      SearchFetch();
    } catch (error) {
      console.log(error);
    }
  };

  if (!property) {
    return <div className="text-center py-4">Loading...</div>;
  }

  // ✅ Determine which badge to show
  const showDiscountBadge = filter?.top_pick === "Best Deals";

  return (
    <div className="bg-white cursor-pointer rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row w-full border relative">
      {/* Left Image Section */}
      <div className="relative w-full md:w-2/5 lg:w-1/3 h-48 sm:h-56 md:h-auto overflow-hidden flex-shrink-0">
        <img
          onClick={handleViewDetails}
          src={property.mainImage}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {/* ✅ Conditional Badge */}
        <span
          className={`absolute top-2 left-2 text-xs px-4 py-2 rounded-md font-medium ${
            showDiscountBadge
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          {showDiscountBadge ? "Upto 5% OFF" : "For Sale"}
        </span>
      </div>

      {/* Favorite Icon */}
      <div className="absolute top-3 right-3 flex space-x-1 z-10">
        <div className="bg-white bg-opacity-70 p-1 rounded-full">
          <FaHeart
            className={`cursor-pointer ${
              property.isFavourites ? "text-red-500" : "text-gray-600"
            }`}
            size={18}
            onClick={() => isFavoriteFetch(property.id, property.isFavourites)}
          />
        </div>
      </div>

      {/* Right Content */}
      <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between h-full">
        <div className="flex-grow">
          <p className="text-lg sm:text-xl font-medium text-gray-800 flex items-center">
            {property.priceRange}
          </p>

          <h3
            onClick={handleViewDetails}
            className="text-base sm:text-lg font-medium mt-1 flex items-center"
          >
            {property.title}
          </h3>
          <p className="text-gray-600 flex items-start text-xs sm:text-sm mt-1">
            <FaMapMarkerAlt className="mr-1 text-blue-500 flex-shrink-0 mt-1" />
            <span className="truncate text-wrap">{property.location}</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-5 text-xs sm:text-sm text-gray-700 mt-2 sm:mt-3">
            <p className="flex items-start text-[12px]">
              <FaBuilding className="mr-2 mt-1 flex-shrink-0" />
              <span>
                <span className="font-medium">Possession Date:</span>{" "}
                {property.details.possessionDate?.trim()
                  ? property.details.possessionDate
                  : "N/A"}
              </span>
            </p>
            <p className="flex items-start text-[12px]">
              <FaRupeeSign className="mr-2 mt-1 flex-shrink-0" />
              <span>
                <span className="font-medium">Average Price:</span>{" "}
                {property.details.averagePrice}
              </span>
            </p>
            <p className="flex items-start text-[12px]">
              <FaHome className="mr-2 mt-1 flex-shrink-0" />
              <span>
                <span className="font-medium">Possession Status:</span>{" "}
                {property.details.possessionStatus}
              </span>
            </p>
          </div>

          <p className="text-gray-500 flex text-xs sm:text-sm mt-2 sm:mt-3 line-clamp-2 overflow-hidden">
            {property.description.slice(0, 100)}
          </p>
        </div>

        <div className="mt-3 sm:mt-1 flex justify-end">
          <button
            onClick={handleViewDetails}
            className="bg-blue-500 w-auto text-white text-xs sm:text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-md shadow-md hover:bg-blue-600 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
