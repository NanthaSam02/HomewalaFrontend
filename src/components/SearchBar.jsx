import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaList, FaMap } from "react-icons/fa";
import { IoReloadOutline } from "react-icons/io5";
import { Chip, TextField } from "@mui/material";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setToggleView, setFilterdData } from "../features/BasicSlice";
import "../styles/home.css";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { viewType, filter } = useSelector((store) => store.basic);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocations, setSelectedLocations] = useState(
    Array.isArray(filter?.search) ? filter.search : []
  );
  const [isRotating, setIsRotating] = useState(false);
  const searchInputRef = useRef(null);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    const initializeGooglePlaces = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        const input = document.getElementById("search-input");
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          componentRestrictions: { country: "IN" },
          bounds: new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(12.6, 79.6),
            new window.google.maps.LatLng(13.2, 80.3)
          ),
          strictBounds: true,
          types: ["(regions)"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place) {
            const locationName = place.name;
            if (!selectedLocations.includes(locationName)) {
              setSelectedLocations((prev) => [...prev, locationName]);
            }
            setSearchValue("");
          }
        });
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          const input = document.getElementById("search-input");
          const autocomplete = new window.google.maps.places.Autocomplete(input, {
            componentRestrictions: { country: "IN" },
            bounds: new window.google.maps.LatLngBounds(
              new window.google.maps.LatLng(12.6, 79.6),
              new window.google.maps.LatLng(13.2, 80.3)
            ),
            strictBounds: true,
            types: ["(regions)"],
          });

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place) {
              const locationName = place.name;
              if (!selectedLocations.includes(locationName)) {
                setSelectedLocations((prev) => [...prev, locationName]);
              }
              setSearchValue("");
            }
          });
        };
        document.head.appendChild(script);
      }
    };

    initializeGooglePlaces();
  }, [selectedLocations]);

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleAddLocation = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const trimmedValue = searchValue.trim();
      if (trimmedValue && !selectedLocations.includes(trimmedValue)) {
        setSelectedLocations((prev) => [...prev, trimmedValue]);
        setSearchValue("");
      }
    }
  };

  const handleRemoveLocation = (locationToRemove) => {
    setSelectedLocations((prev) => prev.filter((loc) => loc !== locationToRemove));
    setSearchValue("");
  };

  const handleSearch = () => {
    const searchArray =
      selectedLocations.length > 0 ? selectedLocations : searchValue.trim() ? [searchValue.trim()] : [];

    const updatedFilter = {
      ...filter,
      search: searchArray,
      paginate: 1,
    };

    dispatch(setFilterdData(updatedFilter));
  };

  const viewTypeHandleChange = (view) => {
    dispatch(setToggleView(view));
  };

  const handleResetFilters = (e) => {
    e.preventDefault();
    setIsRotating(true);

    const defaultFilter = {
      search: [],
      property_area: [],
      beds: [],
      construction_status: [],
      furnished_status: [],
      min_price: 500000,
      max_price: 100000000,
      area_min: 500,
      area_max: 5000,
      paginate: 1,
    };

    setSelectedLocations([]);
    setSearchValue("");

    dispatch(setFilterdData(defaultFilter));

    setTimeout(() => {
      setIsRotating(false);
    }, 500);
  };

  return (
    <div className="flex flex-col md:flex-row items-center bg-white rounded-md gap-3 md:gap-4 p-4 detail-page-filter">
      {/* Search Input with Chips and Autocomplete */}
      <div className="flex items-center border rounded-lg p-2 w-full md:flex-grow relative" ref={searchInputRef}>
        <FaSearch className="text-gray-400 mr-2 flex-shrink-0" />
        <div className="flex flex-wrap items-center gap-2 w-full">
          {selectedLocations.map((location, index) => (
            <Chip
              key={index}
              label={location}
              onDelete={() => handleRemoveLocation(location)}
              deleteIcon={<MdClose style={{ color: "#0078DB", fontSize: "14px" }} />}
              style={{
                backgroundColor: "#0078DB21",
                color: "#0078DB",
                fontWeight: "500",
                borderRadius: "16px",
                fontSize: "12px",
                height: "28px",
              }}
            />
          ))}
          <div className="flex-grow min-w-[150px]">
            <TextField
              id="search-input"
              variant="standard"
              placeholder={selectedLocations.length > 0 ? "" : "Search for Locality & Project"}
              value={searchValue}
              onChange={handleSearchInputChange}
              onKeyDown={handleAddLocation}
              fullWidth
              InputProps={{
                disableUnderline: true,
                className: "outline-none text-gray-500 bg-transparent w-full text-sm md:text-base",
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons - Stacked on mobile, inline on larger screens */}
      <div className="flex flex-row items-center gap-2 w-full md:w-auto">
        {/* Search Button */}
        <button
          type="button"
          className="bg-blue-500 text-white rounded-md px-4 py-2 font-medium flex-1 md:flex-none whitespace-nowrap"
          onClick={handleSearch}
        >
          Search
        </button>

        {/* Reset Filter Button */}
        <button
          type="button"
          className="flex items-center justify-center border border-gray-300 rounded-lg p-2 text-gray-700 font-medium w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2"
          onClick={handleResetFilters}
          aria-label="Reset filters"
        >
          <IoReloadOutline
            className={`text-gray-500 transition-transform duration-500 ${isRotating ? "animate-spin" : ""}`}
            size={18}
          />
          <span className="hidden md:inline ml-2">Reset</span>
        </button>

        {/* List and Map View Toggle */}
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => viewTypeHandleChange("List")}
            className={`px-3 py-3 md:px-4 md:py-2 font-medium flex items-center text-sm md:text-base ${
              viewType === "List" ? "bg-blue-500 text-white" : "text-black"
            }`}
            aria-label="List view"
          >
            <FaList className="mr-1 md:mr-2" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            type="button"
            onClick={() => viewTypeHandleChange("Map")}
            className={`px-3 py-1 md:px-4 md:py-2 font-medium flex items-center text-sm md:text-base ${
              viewType === "Map" ? "bg-blue-500 text-white" : "text-black"
            }`}
            aria-label="Map view"
          >
            <FaMap className="mr-1 md:mr-2" />
            <span className="hidden sm:inline">Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;












// import React, { useEffect, useState, useRef } from "react";
// import { FaSearch, FaList, FaMap } from "react-icons/fa";
// import { IoReloadOutline } from "react-icons/io5";
// import { Chip, TextField } from "@mui/material";
// import { MdClose } from "react-icons/md";
// import { useDispatch, useSelector } from "react-redux";
// import { setToggleView, setFilterdData } from "../features/BasicSlice";

// const SearchBar = () => {
//   const dispatch = useDispatch();
//   const { viewType, filter } = useSelector((store) => store.basic);
//   const [searchValue, setSearchValue] = useState("");
//   const [selectedLocations, setSelectedLocations] = useState(
//     Array.isArray(filter?.search) ? filter.search : []
//   );
//   const [isRotating, setIsRotating] = useState(false);

//   const handleAddLocation = (event) => {
//     if (event.key === "Enter") {
//       const trimmedValue = searchValue.trim();
//       if (trimmedValue && !selectedLocations.includes(trimmedValue)) {
//         setSelectedLocations((prev) => [...prev, trimmedValue]);
//       }
//       setSearchValue("");
//     }
//   };

//   const handleRemoveLocation = (location) => {
//     setSelectedLocations((prev) => prev.filter((loc) => loc !== location));
//   };

//   const handleSearch = () => {
//     const searchArray = selectedLocations.length > 0
//       ? selectedLocations
//       : searchValue.trim()
//         ? [searchValue.trim()]
//         : [];

//     const updatedFilter = {
//       ...filter,
//       search: searchArray,
//       paginate: 1,
//     };

//     dispatch(setFilterdData(updatedFilter));
//     console.log("Updated Filter (to send to API):", updatedFilter);
//   };

//   const viewTypeHandleChange = (view) => {
//     dispatch(setToggleView(view));
//   };

//   const handleResetFilters = (e) => {
//     // Prevent any default behavior
//     e.preventDefault();

//     // Set animation state
//     setIsRotating(true);

//     // Create a default filter object with all values reset
//     const defaultFilter = {
//       search: [],
//       property_area: [],
//       beds: [],
//       construction_status: [],
//       furnished_status: [],
//       min_price: 500000,
//       max_price: 100000000,
//       area_min: 500,
//       area_max: 5000,
//       paginate: 1
//     };

//     // Reset component state
//     setSelectedLocations([]);
//     setSearchValue("");

//     // Dispatch the reset filter to Redux
//     dispatch(setFilterdData(defaultFilter));

//     // Turn off the animation after a delay
//     setTimeout(() => {
//       setIsRotating(false);
//     }, 500);

//     // Removed the window.location.reload() to prevent page refresh
//   };

//   return (
//     <div className="flex items-center bg-white rounded-md py-5 space-x-4 detail-page-filter px-2">
//       {/* Reset Filter Button */}
//       <button
//         type="button" // Explicitly set button type
//         className="flex items-center border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-medium"
//         onClick={handleResetFilters}
//       >
//         Filter
//         <IoReloadOutline
//           className={`ml-2 text-gray-500 transition-transform duration-500 ${isRotating ? "animate-spin" : ""}`}
//         />
//       </button>

//       {/* Search Input with Chips */}
//       <div className="flex items-center border rounded-lg p-2 flex-grow">
//         <FaSearch className="text-gray-400 mr-2" />
//         <div className="flex flex-wrap items-center gap-2 w-full">
//           {selectedLocations.map((location, index) => (
//             <Chip
//               key={index}
//               label={location}
//               onDelete={() => handleRemoveLocation(location)}
//               deleteIcon={<MdClose style={{ color: "#0078DB", fontSize: "14px" }} />}
//               style={{
//                 backgroundColor: "#0078DB21",
//                 color: "#0078DB",
//                 fontWeight: "500",
//                 borderRadius: "16px",
//                 fontSize: "12px",
//               }}
//             />
//           ))}
//           <div className="flex-grow">
//             <TextField
//               autoFocus
//               variant="standard"
//               placeholder="Search for locality, landmark, project"
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               onKeyDown={handleAddLocation}
//               fullWidth
//               InputProps={{
//                 disableUnderline: true,
//                 className: "outline-none text-gray-500 bg-transparent w-full text-sm",
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Search Button */}
//       <button
//         type="button"
//         className="bg-blue-500 text-white rounded-md px-4 py-2 font-medium"
//         onClick={handleSearch}
//       >
//         Search
//       </button>

//       {/* List and Map View Toggle */}
//       <div className="flex border border-gray-300 rounded-md overflow-hidden">
//         <button
//           type="button"
//           onClick={() => viewTypeHandleChange("List")}
//           className={`px-4 py-2 font-medium flex items-center ${viewType === "List" ? "bg-blue-500 text-white" : "text-black"}`}
//         >
//           <FaList className="mr-2" />
//           List
//         </button>
//         <button
//           type="button"
//           onClick={() => viewTypeHandleChange("Map")}
//           className={`px-4 py-2 font-medium flex items-center ${viewType === "Map" ? "bg-blue-500 text-white" : "text-black"}`}
//         >
//           <FaMap className="mr-2" />
//           Map
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SearchBar;



