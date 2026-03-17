import React, { useEffect, useRef, useState } from "react";
import GoogleMap from "google-maps-react-markers";
import { TiHome } from "react-icons/ti";
import { FaList, FaMap, FaSearch } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { Chip, TextField, Menu, MenuItem } from "@mui/material";
import PropertyCard from "./PropertyCard";
import { useDispatch, useSelector } from "react-redux";
import { setToggleView, setFilterdData } from "../features/BasicSlice";
import { useNavigate } from "react-router-dom";

const MapView = () => {
  const mapRef = useRef(null);
  const circleRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mapReady, setMapReady] = useState(false);
  const { viewType, filter, propertiesList } = useSelector(
    (store) => store.basic
  );
  const [selectedLocations, setSelectedLocations] = useState(
    filter?.search || []
  );
  const [selectedCategory, setSelectedCategory] = useState(
    filter?.propertyType || "Buy"
  );
  const categories = ["Buy", "Rent", "Lease"];
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // === NEW STATES & REFS for Google Places Autocomplete ===
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const searchInputRef = useRef(null);

  // Load coordinates from Redux store
  const [chennaiCoordinates, setChennaiCoordinates] = useState(
    propertiesList.mapDetails || []
  );

  // Update chennaiCoordinates when propertiesList.mapDetails changes
  useEffect(() => {
    if (propertiesList.mapDetails) {
      setChennaiCoordinates(propertiesList.mapDetails);
    }
  }, [propertiesList.mapDetails]);

  // Initialize Google Places API
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(document.createElement("div"));
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        placesService.current = new window.google.maps.places.PlacesService(document.createElement("div"));
      };
      document.head.appendChild(script);
    }
  }, []);

  // Debounce helper
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Google Places autocomplete suggestions fetch
  const getGooglePlacesSuggestions = debounce((input) => {
    if (!input.trim() || !autocompleteService.current) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingPlaces(true);

    const request = {
      input: input,
      componentRestrictions: { country: "IN" },
      fields: ["place_id", "structured_formatting", "types"],
    };

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      setIsLoadingPlaces(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        const formatted = predictions.map((prediction) => ({
          place_id: prediction.place_id,
          main_text: prediction.structured_formatting.main_text,
          secondary_text: prediction.structured_formatting.secondary_text,
        }));
        setSuggestions(formatted);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    });
  }, 300);

  // Handle search input change with autocomplete
  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);

    if (val.trim()) {
      getGooglePlacesSuggestions(val);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // When user clicks a suggestion
  const handleSuggestionSelect = (suggestion) => {
    if (!selectedLocations.includes(suggestion.main_text)) {
      setSelectedLocations((prev) => [...prev, suggestion.main_text]);
    }
    setSearchValue("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to draw or update the circle
  const updateCircle = () => {
    if (!mapRef.current || !chennaiCoordinates.length) return;

    const { map, maps } = mapRef.current;

    // Remove previous circle if it exists
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    // Extract latitudes & longitudes
    const latitudes = chennaiCoordinates.map((coord) => parseFloat(coord.lat));
    const longitudes = chennaiCoordinates.map((coord) => parseFloat(coord.lng));

    if (latitudes.length === 0 || longitudes.length === 0) return;

    const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
    const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

    // Calculate the radius dynamically
    const maxDistance = Math.max(
      ...chennaiCoordinates.map((coord) =>
        Math.sqrt((parseFloat(coord.lat) - avgLat) ** 2 + (parseFloat(coord.lng) - avgLng) ** 2)
      )
    );

    const radius = maxDistance * 111000; // Convert to meters

    // Draw the circle
    circleRef.current = new maps.Circle({
      strokeColor: "#FF5733",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF5733",
      fillOpacity: 0.2,
      map,
      center: { lat: avgLat, lng: avgLng },
      radius: Math.max(radius, 5000), // Minimum radius of 5km
    });
  };

  /**
   * Handles when the Google Map is ready.
   * @param {Object} map - reference to the map instance
   * @param {Object} maps - reference to the maps library
   */
  const onGoogleApiLoaded = ({ map, maps }) => {
    if (!map || !maps) return; // Prevent errors

    mapRef.current = { map, maps };
    setMapReady(true);

    if (chennaiCoordinates.length > 0) {
      updateCircle();
    }
  };

  // Update map when coordinates change and map is ready
  useEffect(() => {
    if (mapReady && mapRef.current) {
      updateCircle();
    }
  }, [chennaiCoordinates, mapReady]);

  const handleSearch = () => {
    // Create a copy of selectedLocations
    let searchLocations = [...selectedLocations];

    // If there's a value in the search field that hasn't been added as a chip yet, add it
    if (searchValue.trim()) {
      // Check if there are suggestions and use the first one, otherwise use the typed value
      if (suggestions.length > 0) {
        const firstSuggestion = suggestions[0].main_text;
        if (!searchLocations.includes(firstSuggestion)) {
          searchLocations.push(firstSuggestion);
        }
      } else if (!searchLocations.includes(searchValue.trim())) {
        searchLocations.push(searchValue.trim());
      }
    }

    const updatedFilter = {
      ...filter,
      search: searchLocations,
      propertyType: selectedCategory,
    };

    dispatch(setFilterdData(updatedFilter));
    console.log("Updated Filter for Search:", updatedFilter);

    // Clear search value and suggestions after search
    setSearchValue("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const viewTypeHandleChange = (view) => {
    dispatch(setToggleView(view));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative flex flex-col">
      {/* Search and Filters Section */}
      <div className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow-sm gap-2 sm:gap-3 p-3 w-full">
  {/* Search Bar with Chips */}
  <div 
    ref={searchInputRef}
    className="flex items-center border border-gray-200 bg-white rounded-lg px-3 py-2 w-full min-w-0 relative transition-all duration-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
  >
    <FaSearch className="text-gray-400 mr-2 flex-shrink-0 text-base" />
    
    {/* Chips Container with scrollable area */}
    <div className="flex items-center gap-2 w-full min-w-0 overflow-x-auto no-scrollbar">
      {selectedLocations?.length > 0 && (
        <div className="flex flex-nowrap gap-2 flex-shrink-0">
          {selectedLocations.map((location, index) => (
            <div 
              key={index}
              className="flex items-center bg-blue-50 rounded-full px-2 py-1 flex-shrink-0"
            >
              <span className="text-blue-700 text-xs font-medium mr-1 whitespace-nowrap">
                {location}
              </span>
              <button 
                onClick={() => setSelectedLocations(selectedLocations.filter(loc => loc !== location))}
                className="text-blue-500 hover:text-blue-700"
              >
                <MdClose className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Text Input */}
      <div className="flex-grow min-w-[120px]">
        <input
          type="text"
          placeholder={selectedLocations?.length > 0 ? "" : "Search for Locality & Project"}
          value={searchValue}
          onChange={handleSearchInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (suggestions.length > 0) {
                handleSuggestionSelect(suggestions[0]);
              } else if (searchValue.trim() && !selectedLocations.includes(searchValue.trim())) {
                setSelectedLocations([...selectedLocations, searchValue.trim()]);
                setSearchValue("");
                setShowSuggestions(false);
              }
            }
          }}
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
        />
      </div>
    </div>

    {/* Suggestions dropdown */}
    {showSuggestions && (suggestions.length > 0 || isLoadingPlaces) && (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
        {isLoadingPlaces ? (
          <div className="p-3 text-gray-500 text-sm flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            Loading suggestions...
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              className="w-full text-left p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="text-sm font-medium text-gray-800">{suggestion.main_text}</div>
              {suggestion.secondary_text && (
                <div className="text-xs text-gray-500 mt-1">{suggestion.secondary_text}</div>
              )}
            </button>
          ))
        )}
      </div>
    )}
  </div>

  {/* Search Button */}
  <button
    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap w-full sm:w-auto transition-colors duration-200"
    onClick={handleSearch}
  >
    Search
  </button>
</div>

      {/* Layout: Map & Property List */}
      <div className="grid grid-cols-1 lg:grid-cols-6 h-screen  sm:mt-2 mb-5">
        {/* Map Section - Full width on mobile, half on larger screens */}
        <div className="col-span-1 lg:col-span-3 w-full h-64 sm:h-96 lg:h-full gmap-container">
          <GoogleMap
            apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
            bootstrapURLKeys={{ libraries: ["places", "geometry"] }}
            defaultCenter={{ lat: 13.0827, lng: 80.2707 }}
            defaultZoom={12}
            mapMinHeight="100%"
            onGoogleApiLoaded={onGoogleApiLoaded}
          >
            {chennaiCoordinates.map(({ id, lat, lng, name, price }) => (
              <div
                key={id}
                lat={parseFloat(lat)}
                lng={parseFloat(lng)}
               onClick={() => {
  mapRef.current.map.setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) })
  navigate(`/property/${id}`)
}}
                className="flex flex-col items-center text-center cursor-pointer font-bold"
              >
                <TiHome
                  size={20}
                  color="#0078DB"
                  className="bg-white rounded-full p-1 shadow-md"
                />
                <span className="bg-white px-2 py-1 rounded-md shadow-md mt-1 text-xs font-semibold">
                  {price}
                </span>
              </div>
            ))}
          </GoogleMap>
        </div>

        {/* Property List Section */}
        <div className="col-span-1 lg:col-span-3 overflow-y-auto h-screen lg:h-screen bg-lightblue p-3 sm:p-5 border-radius-5">
          {/* Sticky Header for Property List */}
          <div className="sticky top-[-20px] bg-lightblue pt-1 pb-3 z-40 px-1">
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-base sm:text-lg font-medium">List of Properties</h1>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => viewTypeHandleChange("List")}
                  className={`px-2 sm:px-4 py-1 sm:py-2 flex items-center text-xs sm:text-sm ${viewType === "List" ? "bg-blue-500 text-white" : "text-black"
                    }`}
                >
                  <FaList className="mr-1 sm:mr-2" /> List
                </button>
                <button
                  onClick={() => viewTypeHandleChange("Map")}
                  className={`px-2 sm:px-4 py-1 sm:py-2 flex items-center text-xs sm:text-sm ${viewType === "Map" ? "bg-blue-500 text-white" : "text-black"
                    }`}
                >
                  <FaMap className="mr-1 sm:mr-2" /> Map
                </button>
              </div>
            </div>
            {/* Optional divider for better visual separation */}
            <div className="h-px bg-gray-200 w-full mb-3"></div>
          </div>

          {/* Property Cards */}
          <div className="grid gap-3 sm:gap-4">
            {propertiesList?.data?.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;













// import React, { useEffect, useRef, useState } from "react";
// import GoogleMap from "google-maps-react-markers";
// import { TiHome } from "react-icons/ti";
// import { FaList, FaMap, FaSearch } from "react-icons/fa";
// import { IoIosArrowDown } from "react-icons/io";
// import { MdClose } from "react-icons/md";
// import { Chip, TextField, Menu, MenuItem } from "@mui/material";
// import PropertyCard from "./PropertyCard";
// import { useDispatch, useSelector } from "react-redux";
// import { setToggleView, setFilterdData } from "../features/BasicSlice";
// import { useNavigate } from "react-router-dom";

// const MapView = () => {
//   const mapRef = useRef(null);
//   const circleRef = useRef(null);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [mapReady, setMapReady] = useState(false);
//   const { viewType, filter, propertiesList } = useSelector(
//     (store) => store.basic
//   );
//   const [selectedLocations, setSelectedLocations] = useState(
//     filter?.search || []
//   );
//   const [selectedCategory, setSelectedCategory] = useState(
//     filter?.propertyType || "Buy"
//   );
//   const categories = ["Buy", "Rent", "Lease"];
//   const [searchValue, setSearchValue] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);

//   // Load coordinates from Redux store
//   const [chennaiCoordinates, setChennaiCoordinates] = useState(
//     propertiesList.mapDetails || []
//   );

//   // Update chennaiCoordinates when propertiesList.mapDetails changes
//   useEffect(() => {
//     if (propertiesList.mapDetails) {
//       setChennaiCoordinates(propertiesList.mapDetails);
//     }
//   }, [propertiesList.mapDetails]);

//   // Function to draw or update the circle
//   const updateCircle = () => {
//     if (!mapRef.current || !chennaiCoordinates.length) return;

//     const { map, maps } = mapRef.current;

//     // Remove previous circle if it exists
//     if (circleRef.current) {
//       circleRef.current.setMap(null);
//     }

//     // Extract latitudes & longitudes
//     const latitudes = chennaiCoordinates.map((coord) => parseFloat(coord.lat));
//     const longitudes = chennaiCoordinates.map((coord) => parseFloat(coord.lng));

//     if (latitudes.length === 0 || longitudes.length === 0) return;

//     const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
//     const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

//     // Calculate the radius dynamically
//     const maxDistance = Math.max(
//       ...chennaiCoordinates.map((coord) =>
//         Math.sqrt((parseFloat(coord.lat) - avgLat) ** 2 + (parseFloat(coord.lng) - avgLng) ** 2)
//       )
//     );

//     const radius = maxDistance * 111000; // Convert to meters

//     // Draw the circle
//     circleRef.current = new maps.Circle({
//       strokeColor: "#FF5733",
//       strokeOpacity: 0.8,
//       strokeWeight: 2,
//       fillColor: "#FF5733",
//       fillOpacity: 0.2,
//       map,
//       center: { lat: avgLat, lng: avgLng },
//       radius: Math.max(radius, 5000), // Minimum radius of 5km
//     });
//   };

//   /**
//    * Handles when the Google Map is ready.
//    * @param {Object} map - reference to the map instance
//    * @param {Object} maps - reference to the maps library
//    */
//   const onGoogleApiLoaded = ({ map, maps }) => {
//     if (!map || !maps) return; // Prevent errors

//     mapRef.current = { map, maps };
//     setMapReady(true);

//     if (chennaiCoordinates.length > 0) {
//       updateCircle();
//     }
//   };

//   // Update map when coordinates change and map is ready
//   useEffect(() => {
//     if (mapReady && mapRef.current) {
//       updateCircle();
//     }
//   }, [chennaiCoordinates, mapReady]);

//   const handleSearch = () => {
//     // Create a copy of selectedLocations
//     let searchLocations = [...selectedLocations];

//     // If there's a value in the search field that hasn't been added as a chip yet, add it
//     if (searchValue.trim()) {
//       searchLocations.push(searchValue.trim());
//     }

//     const updatedFilter = {
//       ...filter,
//       search: searchLocations,
//       propertyType: selectedCategory,
//     };

//     dispatch(setFilterdData(updatedFilter));
//     console.log("Updated Filter for Search:", updatedFilter);
//   };

//   const viewTypeHandleChange = (view) => {
//     dispatch(setToggleView(view));
//   };


//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="relative flex flex-col">
//       {/* Search and Filters Section */}
//       <div className="absolute z-50 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center py-3 sm:py-5 mx-0 px-2 sm:px-10 w-full">
//         {/* Search Bar with Chips */}
//         <div className="flex flex-grow items-center border bg-white border-gray-300 rounded-md px-2 sm:px-3 py-1 sm:py-2 search-h-42 w-full">
//           <FaSearch className="text-gray-400 mr-1 sm:mr-2 flex-shrink-0" />
//           <div className="flex flex-wrap items-center gap-1 sm:gap-2 overflow-x-auto max-w-full">
//             {selectedLocations && selectedLocations.map((location, index) => (
//               <Chip
//                 key={index}
//                 label={location}
//                 size="small"
//                 onDelete={() =>
//                   setSelectedLocations(
//                     selectedLocations.filter((loc) => loc !== location)
//                   )
//                 }
//                 deleteIcon={
//                   <MdClose style={{ color: "#0078DB", fontSize: "16px" }} />
//                 }
//                 style={{
//                   backgroundColor: "#0078DB21",
//                   color: "#0078DB",
//                   fontWeight: "500",
//                   borderRadius: "16px",
//                   height: "24px",
//                   fontSize: "12px",
//                 }}
//               />
//             ))}
//             <TextField
//               variant="standard"
//               placeholder="Search for locality, landmark, project"
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && searchValue.trim()) {
//                   setSelectedLocations([
//                     ...selectedLocations,
//                     searchValue.trim(),
//                   ]);
//                   setSearchValue("");
//                 }
//               }}
//               InputProps={{
//                 disableUnderline: true,
//                 className:
//                   "outline-none text-gray-500 bg-transparent w-full text-sm",
//               }}
//             />
//           </div>
//         </div>

//         {/* Search Button */}
//         <button
//           className="bg-blue-500 text-white rounded-md px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium whitespace-nowrap"
//           onClick={handleSearch}
//         >
//           Search
//         </button>
//       </div>

//       {/* Layout: Map & Property List */}
//       <div className="grid grid-cols-1 lg:grid-cols-6 h-screen mt-12 sm:mt-16">
//         {/* Map Section - Full width on mobile, half on larger screens */}
//         <div className="col-span-1 lg:col-span-3 w-full h-64 sm:h-96 lg:h-full">
//           <GoogleMap
//             apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
//             bootstrapURLKeys={{ libraries: ["places", "geometry"] }}
//             defaultCenter={{ lat: 13.0827, lng: 80.2707 }}
//             defaultZoom={12}
//             mapMinHeight="100%"
//             onGoogleApiLoaded={onGoogleApiLoaded}
//           >
//             {chennaiCoordinates.map(({ id, lat, lng, name, price }) => (
//               <div
//                 key={id}
//                 lat={parseFloat(lat)}
//                 lng={parseFloat(lng)}
//                 onClick={() => {
//                   mapRef.current.map.setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) })
//                   navigate("/details", { state: id })
//                 }}
//                 className="flex flex-col items-center text-center cursor-pointer font-bold"
//               >
//                 <TiHome
//                   size={20}
//                   color="#0078DB"
//                   className="bg-white rounded-full p-1 shadow-md"
//                 />
//                 <span className="bg-white px-2 py-1 rounded-md shadow-md mt-1 text-xs font-semibold">
//                   {price}
//                 </span>
//               </div>
//             ))}
//           </GoogleMap>
//         </div>

//         {/* Property List Section */}
//         <div className="col-span-1 lg:col-span-3 overflow-y-auto h-screen lg:h-screen bg-lightblue p-3 sm:p-5">
//           {/* Sticky Header for Property List */}
//           <div className="sticky top-[-20px] bg-lightblue pt-1 pb-3 z-40 px-1">
//             <div className="flex justify-between items-center mb-3">
//               <h1 className="text-base sm:text-lg font-medium">List of Properties</h1>
//               <div className="flex border border-gray-300 rounded-md overflow-hidden">
//                 <button
//                   onClick={() => viewTypeHandleChange("List")}
//                   className={`px-2 sm:px-4 py-1 sm:py-2 flex items-center text-xs sm:text-sm ${viewType === "List" ? "bg-blue-500 text-white" : "text-black"
//                     }`}
//                 >
//                   <FaList className="mr-1 sm:mr-2" /> List
//                 </button>
//                 <button
//                   onClick={() => viewTypeHandleChange("Map")}
//                   className={`px-2 sm:px-4 py-1 sm:py-2 flex items-center text-xs sm:text-sm ${viewType === "Map" ? "bg-blue-500 text-white" : "text-black"
//                     }`}
//                 >
//                   <FaMap className="mr-1 sm:mr-2" /> Map
//                 </button>
//               </div>
//             </div>
//             {/* Optional divider for better visual separation */}
//             <div className="h-px bg-gray-200 w-full mb-3"></div>
//           </div>

//           {/* Property Cards */}
//           <div className="grid gap-3 sm:gap-4">
//             {propertiesList?.data?.map((property) => (
//               <PropertyCard key={property.id} property={property} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MapView;