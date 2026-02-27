import React, { useState } from "react";
import { FaMapMarkerAlt, FaShareAlt, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../axiosConfig"; // Ensure you import your axios config
import { toast } from "react-toastify"; // Import toast if you use it
import { useDispatch, useSelector } from "react-redux";
import { setPropertiesList } from "../features/BasicSlice"
import DOMPurify from "dompurify";

const PropertyCardWishlist = ({ property, fetchData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [isFavorite, setIsFavorite] = useState(property.isFavorite || false);

  if (!property) {
    return <h1>Loading...</h1>;
  }
  const { filter } = useSelector(store => store.basic);

  const isFavoriteFetch = async (id) => {
    try {
      const response = await api.post("/buyer/wishlist", { property_id: id, status: true });
      toast.success(response.data.status);
      // Refresh wishlist data after successful API call
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const formatPrice = (price) => {
    // Remove .00 decimals and unnecessary dots
    return price
      .replace(/\.00/g, '')
      .replace(/\.\./g, '.'); // Handle existing truncation dots
  };

  // Use a placeholder image if property.image is not provided
  const imageUrl = property.image || "https://via.placeholder.com/400x300?text=No+Image+Available";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row w-full max-w-4xl mx-auto border relative h-full">
      {/* Left Image Section */}
      <div className="relative w-full md:w-2/5 h-60 md:h-auto overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={property.title || `Property ${property.propertId}`}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 left-2 bg-[#535151F5] text-white text-xs px-3 py-2 rounded-md">
          For Sale
        </span>
      </div>

      {/* Right Content Section */}
      <div className="flex-grow flex flex-col justify-between w-full">
        <div className="p-5">
          {/* Title & Location */}
          <h3 className="text-lg font-semibold">
            {property.title || `Property #${property.propertId}`}
          </h3>
          <p className="text-gray-600 flex items-center text-[12px] mt-1">
            <FaMapMarkerAlt className="mr-1 text-blue-500" />
            {property.fullAddress || "Address not provided"}
          </p>

          {/* Amenities Section with fixed height and scrolling if needed */}
          <div className="mt-3 min-h-[80px]">
            {property.amenities && property.amenities.length > 0 && (
              <div className="grid grid-cols-2 gap-3 text-gray-700">
                {property.amenities.map((amenity, index) => {
                  const svgContent = amenity.icon?.includes('/amenity_icons/')
                    ? amenity.icon.split('/amenity_icons/')[1]
                      .replace(/<\?xml.*?\?>\n?/g, '')
                      .replace(/fill="[^"]*"/g, 'fill="currentColor"')
                      .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
                    : null;

                  return (
                    <div key={index} className="flex items-center mb-2">
                      {amenity.icon ? (
                        svgContent ? (
                          <span
                            className="w-4 h-4 mr-1 inline-block [&>svg]:w-full [&>svg]:h-full"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(svgContent)
                            }}
                          />
                        ) : amenity.icon.startsWith("http") ? (
                          <img
                            src={amenity.icon}
                            alt={amenity.name}
                            className="w-4 h-4 mr-1"
                          />
                        ) : (
                          <span className="mr-1">{amenity.icon}</span>
                        )
                      ) : null}
                      <span className="text-sm text-gray-700">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Button Section - Now appears at the bottom with proper spacing */}
        <div className="mt-auto p-5 flex justify-between items-center border-t-2 pt-4">
          {/* Price */}
          <p className="text-xl font-bold text-gray-900 whitespace-nowrap">
            {formatPrice(property.price)}
          </p>
          <button
            onClick={() => navigate("/details", { state: property.propertId })}
            className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardWishlist;


















// import React, { useState } from "react";
// import { FaMapMarkerAlt, FaShareAlt, FaHeart } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { api } from "../axiosConfig"; // Ensure you import your axios config
// import { toast } from "react-toastify"; // Import toast if you use it
// import { useDispatch, useSelector } from "react-redux";
// import { setPropertiesList } from "../features/BasicSlice"
// import DOMPurify from "dompurify";

// const PropertyCardWishlist = ({ property, fetchData }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch()
//   const [isFavorite, setIsFavorite] = useState(property.isFavorite || false);

//   if (!property) {
//     return <h1>Loading...</h1>;
//   }
//   const { filter } = useSelector(store => store.basic);

//   const isFavoriteFetch = async (id) => {
//     try {
//       const response = await api.post("/buyer/wishlist", { property_id: id, status: true });
//       toast.success(response.data.status);
//       // Refresh wishlist data after successful API call
//       fetchData();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const formatPrice = (price) => {
//     // Remove .00 decimals and unnecessary dots
//     return price
//       .replace(/\.00/g, '')
//       .replace(/\.\./g, '.'); // Handle existing truncation dots
//   };

//   // Use a placeholder image if property.image is not provided
//   const imageUrl = property.image || "https://via.placeholder.com/400x300?text=No+Image+Available";

//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row w-full max-w-4xl mx-auto border relative">
//       {/* Left Image Section */}
//       <div className="relative w-full md:w-2/5 h-60 overflow-hidden flex-shrink-0">
//         <img
//           src={imageUrl}
//           alt={property.title || `Property ${property.propertId}`}
//           className="w-full h-full object-cover"
//         />
//         <span className="absolute top-2 left-2 bg-[#535151F5] text-white text-xs px-3 py-2 rounded-md">
//           For Sale
//         </span>
//       </div>

//       {/* Favorite & Share Icons */}
//       {/* <div className="absolute top-3 right-3 flex space-x-3">
//         <FaShareAlt className="text-gray-600 cursor-pointer hover:text-gray-800" size={20} />
//         <FaHeart
//           className={`cursor-pointer text-red-500 `}
//           size={20}
//           onClick={() => isFavoriteFetch(property.propertId)}
//         />
//       </div> */}

//       {/* Right Content Section */}
//       <div className=" flex-grow flex flex-col justify-between">
//         <div className="p-5">
//           {/* Title & Location */}
//           <h3 className="text-lg font-semibold">
//             {property.title || `Property #${property.propertId}`}
//           </h3>
//           <p className="text-gray-600 flex items-center text-[12px] mt-1">
//             <FaMapMarkerAlt className="mr-1 text-blue-500" />
//             {property.fullAddress || "Address not provided"}
//           </p>

//           {/* Amenities Section */}
//           {property.amenities && property.amenities.length > 0 && (
//             <div className="grid grid-cols-2 h-6 gap-3 justify-center items-center text-gray-700 mt-3">
//               {property.amenities.map((amenity, index) => {
//                 const svgContent = amenity.icon?.includes('/amenity_icons/')
//                   ? amenity.icon.split('/amenity_icons/')[1]
//                     .replace(/<\?xml.*?\?>\n?/g, '')
//                     .replace(/fill="[^"]*"/g, 'fill="currentColor"')
//                     .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
//                   : null;

//                 return (
//                   <div key={index} className="flex items-center mr-4 mb-2">
//                     {amenity.icon ? (
//                       svgContent ? (
//                         <span
//                           className="w-4 h-4 mr-1 inline-block [&>svg]:w-full [&>svg]:h-full"
//                           dangerouslySetInnerHTML={{
//                             __html: DOMPurify.sanitize(svgContent)
//                           }}
//                         />
//                       ) : amenity.icon.startsWith("http") ? (
//                         <img
//                           src={amenity.icon}
//                           alt={amenity.name}
//                           className="w-4 h-4 mr-1"
//                         />
//                       ) : (
//                         <span className="mr-1">{amenity.icon}</span>
//                       )
//                     ) : null}
//                     <span className="text-sm text-gray-700">{amenity.name}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* Button Section */}

//         <div className="mt-4 p-5 flex justify-between items-center border-t-2 pt-5">
//           {/* Price */}
//           <p className="text-xl font-bold text-gray-900 whitespace-nowrap">
//             {formatPrice(property.price)}
//           </p>
//           <button
//             onClick={() => navigate("/details", { state: property.propertId })}
//             className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
//           >
//             View Details
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyCardWishlist;
