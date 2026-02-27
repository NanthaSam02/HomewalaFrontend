import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaBed, FaBath, FaCar } from "react-icons/fa";
import { RxRulerSquare } from "react-icons/rx";
import { AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  setIsNavbarModalOpen,
  setPropertiesList,
} from "../features/BasicSlice";
import { api } from "../axiosConfig";
import DOMPurify from 'dompurify';


const PropertyCardSmall = ({ property }) => {
  const navigate = useNavigate();
  const { filter } = useSelector((store) => store.basic);

  const dispatch = useDispatch();

  const [isFavorite, setIsFavorite] = useState(property.isFavourites);

  useEffect(() => {
    console.log("property", property);
  }, [property]);

  // Placeholder image if property image is missing
  const imageUrl = property.image || "https://via.placeholder.com/400x300?text=No+Image+Available";

  const SearchFetch = async () => {
    try {
      const response = await api.post(`get-filtered-listview-properties`, filter);
      dispatch(setPropertiesList(response.data));
    } catch (error) {
      console.error("Failed to fetch property details:", error);
    }
  };

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
        status: !status,
      });
      toast.success(response.data.status);
      SearchFetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavoriteClick = async (e) => {
    // Stop event propagation to prevent navigation
    e.stopPropagation();

    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    await isFavoriteFetch(property.id, newStatus);
  };

  return (
    <div onClick={() => {
      const titleSlug = property.title.toLowerCase().replace(/\s+/g, '-');
      navigate(`/details/${property.id}/${titleSlug}`);
    }} className="max-w-[400px] bg-white cursor-pointer rounded-xl shadow-md overflow-hidden border m-1">
      {/* Property Image */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={property.location || `Property #${property.propertId}`}
          className="w-full h-36 object-cover rounded-xl"
        />
        <span className="absolute top-3 left-0 bg-white text-black text-xs font-medium px-3 py-2 rounded-md" style={{ borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px" }}>
          For Sale
        </span>
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md flex justify-center items-center"
        >
          <AiFillHeart
            className={`cursor-pointer text-xl ${isFavorite ? "text-red-500" : "text-gray-600"
              }`}
          />
        </button>
      </div>

      {/* Property Details */}
      <div className="px-3">
        <h3 className="text-md text-start font-medium pt-3">{property.title || "No Address Provided"}</h3>
        <p className=" text-[12px]  flex items-center text-gray-600 my-1">
          <FaMapMarkerAlt className="mr-2 text-blue-500" />
          {property.location.slice(0, 20) + "...." || "Location not available"}
        </p>

        {/* Amenities Section - Adding min-height to fix overlapping */}
        {property.amenities && property.amenities.length > 0 ? (
          <div className="grid grid-cols-2 min-h-[80px] gap-1 mt-2 my-2 overflow-hidden">
            {property.amenities.slice(0, 4).map((amenity, index) => {
              const svgContent = amenity.icon?.includes('/amenity_icons/')
                ? amenity.icon.split('/amenity_icons/')[1]
                  .replace(/<\?xml.*?\?>\n?/g, '')
                  .replace(/fill="[^"]*"/g, 'fill="currentColor"')
                  .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
                : null;

              // Truncate amenity name if too long
              const displayName = amenity.name.length > 16
                ? amenity.name.slice(0, 16) + '...'
                : amenity.name;

              return (
                <div
                  key={index}
                  className="flex items-center text-xs text-gray-700 px-2 py-1 rounded-md"
                  title={amenity.name} // Adding tooltip for full amenity name
                >
                  <div className="flex items-center whitespace-nowrap">
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
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="mr-1">{amenity.icon}</span>
                      )
                    ) : null}
                    {displayName}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 min-h-[80px] gap-1 mt-2 my-2">
            <div className="flex items-center text-xs text-gray-700 px-2 py-1 rounded-md">
              {/* Empty placeholder */}
            </div>
          </div>
        )}

      </div>

      {/* Price & View Details */}
      <div className="border-t p-4 flex items-center justify-between gap-1 px-3">
        <p className="text-black font-medium text-[16px] whitespace-nowrap">{property.price.slice(0, 19) || "Price Not Available"}
          {property.price.length > 19 ? '...' : null}

        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 text-[13px] rounded-md text-nowrap">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCardSmall;























// import React, { useEffect, useState } from "react";
// import { FaMapMarkerAlt, FaBed, FaBath, FaCar } from "react-icons/fa";
// import { RxRulerSquare } from "react-icons/rx";
// import { AiFillHeart } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   setIsNavbarModalOpen,
//   setPropertiesList,
// } from "../features/BasicSlice";
// import { api } from "../axiosConfig";
// import DOMPurify from 'dompurify';


// const PropertyCardSmall = ({ property }) => {
//   const navigate = useNavigate();
//   const { filter } = useSelector((store) => store.basic);

//   const dispatch = useDispatch();

//   const [isFavorite, setIsFavorite] = useState(property.isFavourites);

//   useEffect(() => {
//     console.log("property", property);
//   }, [property]);

//   // Placeholder image if property image is missing
//   const imageUrl = property.image || "https://via.placeholder.com/400x300?text=No+Image+Available";

//   const SearchFetch = async () => {
//     try {
//       const response = await api.post(`get-filtered-listview-properties`, filter);
//       dispatch(setPropertiesList(response.data));
//     } catch (error) {
//       console.error("Failed to fetch property details:", error);
//     }
//   };

//   const isAuthenticated = localStorage.getItem("access_token");

//   const isFavoriteFetch = async (id, status) => {
//     if (!isAuthenticated) {
//       toast.error("Please login to continue");
//       dispatch(setIsNavbarModalOpen("login"));
//       return;
//     }

//     try {
//       const response = await api.post("/buyer/wishlist/", {
//         property_id: id,
//         status: !status,
//       });
//       toast.success(response.data.status);
//       SearchFetch();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleFavoriteClick = async (e) => {
//     // Stop event propagation to prevent navigation
//     e.stopPropagation();

//     const newStatus = !isFavorite;
//     setIsFavorite(newStatus);
//     await isFavoriteFetch(property.id, newStatus);
//   };

//   return (
//     <div onClick={() => navigate(`/details/${property.id}`)} className="max-w-[400px] bg-white cursor-pointer rounded-xl shadow-md overflow-hidden border m-1">
//       {/* Property Image */}
//       <div className="relative">
//         <img
//           src={imageUrl}
//           alt={property.location || `Property #${property.propertId}`}
//           className="w-full h-36 object-cover rounded-xl"
//         />
//         <span className="absolute top-3 left-0 bg-white text-black text-xs font-medium px-3 py-2 rounded-md" style={{ borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px" }}>
//           For Sale
//         </span>
//         <button
//           onClick={handleFavoriteClick}
//           className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md flex justify-center items-center"
//         >
//           <AiFillHeart
//             className={`cursor-pointer text-xl ${isFavorite ? "text-red-500" : "text-gray-600"
//               }`}
//           />
//         </button>
//       </div>

//       {/* Property Details */}
//       <div className="px-3">
//         <h3 className="text-md text-start font-medium pt-3">{property.title || "No Address Provided"}</h3>
//         <p className=" text-[12px]  flex items-center text-gray-600 my-1">
//           <FaMapMarkerAlt className="mr-2 text-blue-500" />
//           {property.location.slice(0, 20) + "...." || "Location not available"}
//         </p>

//         {/* Amenities Section */}
//         {property.amenities && property.amenities.length > 0 ? (
//           <div className="grid grid-cols-2 h-20 gap-1 mt-2 my-2">
//             {property.amenities.map((amenity, index) => {
//               const svgContent = amenity.icon?.includes('/amenity_icons/')
//                 ? amenity.icon.split('/amenity_icons/')[1]
//                   .replace(/<\?xml.*?\?>\n?/g, '')
//                   .replace(/fill="[^"]*"/g, 'fill="currentColor"')
//                   .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
//                 : null;

//               return (
//                 <div key={index} className="flex items-center text-xs text-gray-700 px-2 py-1 rounded-md">
//                   <div className="flex items-center whitespace-nowrap">
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
//                           onError={(e) => {
//                             e.target.src = placeholderImage;
//                           }}
//                         />
//                       ) : (
//                         <span className="mr-1">{amenity.icon}</span>
//                       )
//                     ) : null}
//                     {amenity.name}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 h-20 gap-1 mt-2 my-2">
//             <div className="flex items-center text-xs text-gray-700 px-2 py-1 rounded-md">
//               {/* Empty placeholder */}
//             </div>
//           </div>
//         )}

//       </div>

//       {/* Price & View Details */}
//       <div className="border-t p-4 flex items-center justify-between gap-1 px-3">
//         <p className="text-black font-medium text-[16px] whitespace-nowrap">{property.price.slice(0, 19) || "Price Not Available"}
//           {property.price.length > 19 ? '...' : null}

//         </p>
//         <button
//           className="bg-blue-500 text-white px-4 py-2 text-[13px] rounded-md text-nowrap">
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PropertyCardSmall;