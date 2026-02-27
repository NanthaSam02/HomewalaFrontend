import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import banner from "../assets/bg1.png";
import { FaBed, FaBath, FaRulerCombined, FaChevronRight } from "react-icons/fa";
import homeimg from "../assets/homeimg.jpg";
import PopularInteriorDesign from "../components/PopularInteriorDesign";
import NewlyLaunchedProjects from "../components/NewlyLaunchedProjects";
import LocationCarousel from "../components/LocationCarousel";
import LandingCarousel from "../components/LandingCarousel";
import WhyChooseUs from "../components/WhyChooseUs";
import OurPartners from "../components/OurPartners";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { Autocomplete, TextField, Chip } from "@mui/material";
import { setFilterdData } from "../features/BasicSlice";
import "../styles/home.css";
import { api } from "../axiosConfig";
import Articles from "../components/Articles";
import EliteProjectsSection from "../components/EliteProjectsSection";
import { MdLocationOn } from "react-icons/md";
import DiwaliOverlay from "../components/DiwaliOverlay";
import DiwaliLamp from "../components/DiwaliLamp";
import secondBanner from "../assets/secondbanner.jpg";
import plotBanner from "../assets/plotbanner.jpg";
import dealBanner from "../assets/dealbanner.jpg";
import { Helmet } from "react-helmet";



const Home = () => {
  const navigate = useNavigate();
  const { viewType, filter } = useSelector((store) => store.basic);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Buy");
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState(
    Array.isArray(filter?.search) ? filter.search : []
  );

  // Google Places Autocomplete states
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  // References to sections we want to scroll to
  const newlyLaunchedRef = useRef(null);
  const interiorDesignRef = useRef(null);
  const searchInputRef = useRef(null);

  const [filters, setFilters] = useState({
    localities: [],
    budget: { min: 0, max: 50000000 },
    bedrooms: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"],
    constructionStatus: ["New Launch", "Under Construction", "Ready to Move"],
    areaRange: { min: 0, max: 5000 },
    furnishingStatus: ["Unfurnished", "Semi-furnished", "Furnished"],
  });

// Locations in dropdown SearchBox
  const suggestedLocations = [
  "Tambaram",
  "poonamalle",
  "kanchipuram",
  "kelambakkam",
  "Maraimalai Nagar",
  "Thandalam",
  "Sithalapakkam",
  "Mambakkam"
];

const [showMore, setShowMore] = useState(false);

const [topPick, setTopPick] = useState(""); // 👈 store selected top pick (like "NRI Investment")

  // const [propertyType, setPropertyType] = useState(filter?.propertyType || "");
  const [categoryId, setCategoryId] = useState(filter?.categoryId || "");

  // Initialize Google Maps Places API
  useEffect(() => {
  const initializeGooglePlaces = () => {
    if (window.google && window.google.maps && window.google.maps.places) {
      const input = document.getElementById('search-input');
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'IN' }, // Restrict to India
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(12.6, 79.6), // Southwest corner to include Kanchipuram, Chengalpattu
          new window.google.maps.LatLng(13.2, 80.3)  // Northeast corner to include Tiruvallur, Chennai
        ),
        strictBounds: true, // Enforce suggestions within bounds
        types: ['(regions)'], // Suggest localities and neighborhoods
      });

      // Handle place selection
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place) {
          handleSuggestionSelect({
            place_id: place.place_id,
            description: place.formatted_address,
            main_text: place.name,
            secondary_text: place.formatted_address,
            types: place.types,
          });
        }
      });
    } else {
      // Load Google Maps API if not already loaded
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const input = document.getElementById('search-input');
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          componentRestrictions: { country: 'IN' },
          bounds: new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(12.6, 79.6),
            new window.google.maps.LatLng(13.2, 80.3)
          ),
          strictBounds: true,
          types: ['(regions)'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place) {
            handleSuggestionSelect({
              place_id: place.place_id,
              description: place.formatted_address,
              main_text: place.name,
              secondary_text: place.formatted_address,
              types: place.types,
            });
          }
        });
      };
      document.head.appendChild(script);
    }
  };

  initializeGooglePlaces();
  }, [selectedLocations]);

  
  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    const locationName = suggestion.main_text;
    if (!selectedLocations.includes(locationName)) { // Prevent duplicates
    setSelectedLocations([...selectedLocations, locationName]);
    }
    setSearchValue("");
    //setSuggestions([]);
    //setShowSuggestions(false);
  };

  // Handle manual location addition (on Enter key)
const handleAddLocation = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      
      if (searchValue.trim() !== "") {
        // If there are suggestions, use the first one
        if (suggestions.length > 0) {
          handleSuggestionSelect(suggestions[0]);
        } else {
          // Add manually typed location
          const updatedLocations = [...selectedLocations, searchValue.trim()];
          setSelectedLocations(updatedLocations);
          setSearchValue("");
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        // If no search value but Enter is pressed, trigger search
       setTimeout(() => {
  handleSearch();
}, 0);
      }
    }
  };

  const handleRemoveLocation = (locationToRemove) => {
  setSelectedLocations((prev) => prev.filter((loc) => loc !== locationToRemove));
  setSearchValue(""); // Clear the input field
};

const handleSearch = () => {
  // 1️⃣ Collect all search locations
  const allSearchTerms = [...selectedLocations];

  if (
    searchValue.trim() &&
    !allSearchTerms.includes(searchValue.trim())
  ) {
    allSearchTerms.push(searchValue.trim());
  }

  // 2️⃣ Update redux filter ONLY
  const updatedFilter = {
    search: allSearchTerms,   // ✅ THIS is what ListView uses
    categoryId: categoryId || "",
    top_pick: topPick || null,
    property_area: [],
    beds: [],
    construction_status: [],
    furnished_status: [],
    paginate: 1,
  };

  dispatch(setFilterdData(updatedFilter));

  // 3️⃣ Navigate ONLY to SEO page
  navigate("/properties-for-sale-in-chennai");

  console.log("✅ Search Filter Applied:", updatedFilter);
};



  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    api
      .get("/get-all-categories")
      .then((response) => {
        if (response.data.status === "success") {
          setCategories(response.data.data);
        }
      })
      .catch((error) => console.error("Failed to fetch categories:", error));
  }, []);

 useEffect(() => {
  dispatch(setFilterdData({ ...filter, search: [] }));
}, [dispatch]);


  const handleTabClick = (tab) => {
  setActiveTab(tab);

  // Reset all top pick and category when switching tabs
  setTopPick("");
  setCategoryId("");

  if (tab === "NRI Investment") {
    // 👇 Auto set top pick
    setTopPick("NRI Investment");
  } else if (tab === "Plot / Land") {
    // 👇 Auto set category (assuming your categories include "Plot")
    const plotCategory = categories.find(
      (cat) => cat.name.toLowerCase().includes("plot")
    );
    if (plotCategory) {
      setCategoryId(plotCategory.id);
    }
  } else if (tab === "Interiors") {
    navigate("/interior"); // already working
  }
};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
       {/* <DiwaliOverlay /> 
        */}
         <Helmet>
        <title>Real Estate in Chennai | Buy/Sell Property in Chennai | Homewala.com</title>
        <meta
          name="description"
          content=" Buy or sell verified properties in Chennai with Homewala.com. Discover DTCP, CMDA & RERA-approved plots, luxury villas, and apartments in top locations. Trusted platform for verified listings, NRI investments, and hassle-free transactions. We specialize in NRI friendly approach, handpicked listings, and prime location properties tailored for every lifestyle."
        />
        <meta
          name="keywords"
          content="Buy/Sell Property portal in Chennai, Real estate in Chennai, Land for sale in Chennai,  Apartment in Chennai, Plots in Chennai, Villa in Chennai, Luxury homes in Chennai, Real estate company in Tambaram, Apartment in Tamabram, Apartment in Kundrathur, Apartment in Siruseri, Apartment in Ponmar, Apartment in Ottiambakkam, Apartment in Padappai, Apartment in Pammal, Apartment in Sembakkam, Apartment in Thiruneermalai, Apartment in Mangadu, Apartment in Sithalpakkam, Apartment in Thalambur, Plots in Tambaram, Plots in Kundrathur, Plots in Siruseri, Plots in Ponmar, Plots in Ottiambakkam, Plots in Padappai, Plots in Pammal, Plots in Sembakkam, Plots in Thiruneermalai, Plots in Mangadu, Plots in Sithalpakkam, Plots in Thalambur, Villa in Tambaram, Villa in Kundrathur, Villa in Siruseri, Villa in Ponmar, Villa in Ottiambakkam,  Villa in Padappai, Villa in Pammal, Villa in Sembakkam, Villa in Thiruneermalai, Villa in Mangadu, Villa in Sithalpakkam,  Villa in Thalambur, Luxury homes in Tambaram, Luxury homes in Kundrathur, Luxury homes in Siruseri, Luxury homes in Ponmar, Luxury homes in Ottiambakkam, Luxury homes in Padappai, Luxury homes in Pammal, Luxury homes in Sembakkam, Luxury homes in Thiruneermalai, Luxury homes in Mangadu, Luxury homes in Sithalpakkam, Luxury homes in Thalambur, Apartments in Pallavaram, Apartments in Pozhichalur, Apartments in Madambakkam, Apartments in Kolapakkam, Apartments in Naduveerapattu, Apartments in Manimangalam, Plots in Pallavaram, Plots in Pozhichalur, Plots in Madambakkam, Plots in Kolapakkam, Plots in Naduveerapattu, Plots in Manimangalam, Villas in Pallavaram, Villas in Pozhichalur, Villas in Madambakkam, Villas in Kolapakkam, Villas in Naduveerapattu, Villas in Manimangalam, Luxury homes in Pallavaram, Luxury homes in Pozhichalur, Luxury homes in Madambakkam, Luxury homes in Kolapakkam, Luxury homes in Naduveerapattu, Luxury homes in Manimangalam."
        />
          {/* 🟢 Canonical Tag (VERY IMPORTANT) */}
        <link rel="canonical" href="https://https://www.homewala.com//" />

        {/* 🛡️ Robots Meta Tag */}
        <meta name="robots" content="index,follow" />
         <meta name="author" content="Homewala.com" />
          <meta name="publisher" content="Homewala.com" />
      </Helmet>
      <div className="bg-cover bg-center relative">
        <div className="main-banner-section">
        <div className="relative rounded-lg">
          <LandingCarousel />
        </div>
        </div>

        <div className="relative bottom-10 md:bottom-[90px] w-full px-4 banner-search">
          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-2 md:space-x-4 py-2 md:py-1 top-tabs-wrapper">
            {["Buy", "Plot / Land", "NRI Investment", "Interiors"].map((tab) => (
              <button
                key={tab}
                className={`px-3 md:px-5 py-1.5 md:py-3 text-xs md:text-sm rounded-md font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white shadow-lg relative after:content-[""] after:absolute after:bottom-[-6px] after:left-1/2 after:transform after:-translate-x-1/2 after:border-solid after:border-t-8 after:border-t-blue-500 after:border-x-8 after:border-x-transparent'
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => {
                  if (tab === "Interiors") {
                    navigate("/interior"); // ✅ navigate instead of scroll
                  } else {
                    handleTabClick(tab);
                  }
                }}
              >
                {tab}
              </button>
            ))}
          </div>   
       
          
         
       <br></br>
<div className="relative">
          {/* Search Bar */}
           {/* 🔥 Animated Diya Lamp */}
<div className="flex justify-center relative mt-[-40px] md:mt-[-20px]">
  {/* <DiwaliLamp /> */}
</div>
         <div className="bg-white bg-opacity-25 py-4 md:py-6 px-4 rounded-xl mx-auto max-w-4xl shadow-sm">
  <div className="border border-gray-200 gap-3 flex flex-col md:flex-row items-center p-3 md:p-4 bg-white rounded-lg shadow-md w-full">
    {/* Property Type Dropdown - Fixed Width */}
   <div className="w-full md:w-48 relative">
  <select
    value={topPick}
    onChange={(e) => setTopPick(e.target.value)}
    className="bg-white w-full text-gray-800 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm appearance-none"
  >
    <option value="">All Top Picks</option>
    <option value="Best Deals">Best Deals</option>
    <option value="NRI Investment">NRI Investment</option>
    <option value="Luxury Homes">Luxury Homes</option>
    <option value="Best Location Picks">Best Location Picks</option>
  </select>
  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>

     {/* Enhanced Search Input with Google Places Autocomplete */}
      <div
  className="relative flex items-center border border-gray-300 rounded-lg p-2 flex-grow w-full hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all min-w-0"
  ref={searchInputRef}
>
  {/* 📍 Location Icon */}
  <MdLocationOn className="text-blue-500 ml-2 mr-2 text-lg flex-shrink-0" />

  <div className="flex flex-wrap items-center gap-2 w-full min-w-0">
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
        }}
      />
    ))}
 <div className="search-box">
    {/* Search Input */}
  <div className="flex-grow relative min-w-[200px] sm:min-w-[300px] md:min-w-[400px]">
  <TextField
    id="search-input"
    variant="standard"
    placeholder="Search for Locality & Project"
    value={searchValue}
    onChange={(e) => {
      setSearchValue(e.target.value);
      setShowSuggestions(true);
    }}
    onFocus={() => setShowSuggestions(true)}
    onKeyDown={handleAddLocation}
    fullWidth
    InputProps={{
      disableUnderline: true,
      className:
        "outline-none text-gray-600 bg-transparent w-full text-sm sm:text-base md:text-base placeholder-gray-400",
    }}
    inputProps={{
      style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    }}
  />

      {/* 🔽 Dropdown for Suggestions */}
      {showSuggestions && (
  <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-md shadow-lg w-full mt-2 z-50 max-h-[250px] overflow-y-auto">
    {suggestedLocations
      .filter((loc) =>
        loc.toLowerCase().includes(searchValue.toLowerCase())
      )
      .slice(0, showMore ? 8 : 4) // 👈 show 4 or 8 based on toggle
      .map((loc, index) => (
        <button
          key={index}
          onClick={() => {
            setSelectedLocations((prev) =>
              prev.includes(loc) ? prev : [...prev, loc]
            );
            setSearchValue("");
            setShowSuggestions(false);
          }}
          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition"
        >
          <MdLocationOn className="text-blue-500 text-lg" />
          <span>{loc}</span>
        </button>
      ))}

    {/* No results */}
    {suggestedLocations.filter((loc) =>
      loc.toLowerCase().includes(searchValue.toLowerCase())
    ).length === 0 && (
      <div className="px-4 py-2 text-gray-400 text-sm">
        No results found
      </div>
    )}

    {/* 🔽 Show More / Less Toggle */}
    {suggestedLocations.length > 4 && (
      <div
        onClick={() => setShowMore(!showMore)}
        className="text-center py-2 text-blue-600 text-sm font-medium cursor-pointer border-t border-gray-100 hover:bg-blue-50"
      >
        {showMore ? "Show Less ▲" : "Show More ▼"}
      </div>
    )}
  </div>
)}

    </div>
  </div>
</div>
</div>


    {/* Search Button */}
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-medium rounded-lg transition-colors w-full md:w-auto shadow-sm flex items-center justify-center space-x-1 flex-shrink-0"
      onClick={handleSearch}
    >
      <FaSearch className="w-3 h-3" />
      <span>Search</span>
    </button>
  </div>
</div>
       
      </div>
{/* 🔥 Animated Diya Lamp (Right Corner of Search Box) */}
<div className="diya-flame-container">
  <div className="diya-base"></div>
  <div className="flame"></div>
</div>
</div>
 </div>
<div></div>

{/* 🖼️ Dual Banner Section - (Deal of the Month & Plot of the Month) */}
<section className="relative w-full px-4 md:px-10 my-10 deal-section-fix">

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
    
    {/* 🏷️ Deal of the Month Banner */}
    <div
      className="relative h-[220px] md:h-[320px] rounded-xl overflow-hidden cursor-pointer group shadow-md"
      onClick={() => {
        const updatedFilter = {
          search: [],
          categoryId: "",
          top_pick: "Best Deals",
          property_area: [],
          beds: [],
          construction_status: [],
          furnished_status: [],
          paginate: 1,
        };
        dispatch(setFilterdData(updatedFilter));
     navigate("/best-deals");
      }}
    >
      <img
        src={dealBanner}
        alt="Deal of the Month"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <h3 className="text-2xl md:text-3xl font-bold tracking-wide"> Deal of the Month</h3>
        <p className="text-sm md:text-base mt-2">Grab up to 5% off on select projects</p>
      </div>
    </div>

    {/* 📍 Plot of the Month Banner */}
    <div
      className="relative h-[220px] md:h-[320px] rounded-xl overflow-hidden cursor-pointer group shadow-md"
      onClick={() => {
        const updatedFilter = {
          search: [],
          categoryId: "",
          top_pick: "Best Location Picks",
          property_area: [],
          beds: [],
          construction_status: [],
          furnished_status: [],
          paginate: 1,
        };
        dispatch(setFilterdData(updatedFilter));
         navigate("/best-location-picks");
       
      }}
    >
      <img
        src={plotBanner}
        alt="Plot of the Month"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <h3 className="text-2xl md:text-3xl font-bold tracking-wide"> Plot of the Month</h3>
        <p className="text-sm md:text-base mt-2">Top-rated plots in prime locations</p>
      </div>
    </div>
  </div>
</section>
<br></br>

{/* 🏡 Elite Projects Section */}
<section
  className="
    relative 
    -mt-[30px] sm:-mt-[40px] md:-mt-[20px] lg:-mt-[10px]
    z-20
  "
>
  <EliteProjectsSection />
</section>

{/* 🆕 Newly Launched Projects */}
<div
  ref={newlyLaunchedRef}
  className="
    flex flex-col justify-center items-center 
    bg-gray-50 
    -mt-[20px] sm:-mt-[30px] md:-mt-[40px]
  "
>
  <NewlyLaunchedProjects />
</div>

{/* 📍 Location Carousel Section */}
<div
  className="bg-no-repeat bg-bottom pb-10 property-area -mt-[20px] md:-mt-[30px]"
  style={{ backgroundImage: `url(${banner})` }}
>
  <LocationCarousel />
</div>
    {/*Interior Design */}
      <div ref={interiorDesignRef}>
        <PopularInteriorDesign />
      </div>

      {/* Why Choose Us */}
      {/* <div className="flex flex-col justify-center items-center bg-gray-50">
        <WhyChooseUs />
      </div> */}

      {/* Our Partners */}
      <section className="sec-space-50 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-[28px] text-center mb-10 font-light">
            Our
            <span className="text-black font-medium font-heading"> Partners</span>
          </h2>
          {/* <p className="text-gray-600 mb-8">
            It is a long established fact that a reader will be distracted by
            the readable <br /> content of a page.
          </p> */}
          <OurPartners />
        </div>
      </section>

      <section className="sec-space-50">
        <div className="container mx-auto text-left">
          <h2 className="text-[28px] mb-2 font-light">
            News &{" "}
            <span className="font-heading text-2xl font-medium mb">Articles</span>{" "}
          </h2>
          <p className="text-gray-600 mb-8">
            Read what's happening in Reals Estate
          </p>
          <Articles />
        </div>
      </section>
    </Layout>
  );
};

export default Home;



















// import React, { useEffect, useState, useRef } from "react";
// import Layout from "../components/Layout";
// import banner from "../assets/bg1.png";
// import { FaBed, FaBath, FaRulerCombined, FaChevronRight } from "react-icons/fa";
// import homeimg from "../assets/homeimg.jpg";
// import PopularInteriorDesign from "../components/PopularInteriorDesign";
// import NewlyLaunchedProjects from "../components/NewlyLaunchedProjects";
// import LocationCarousel from "../components/LocationCarousel";
// import LandingCarousel from "../components/LandingCarousel";
// import WhyChooseUs from "../components/WhyChooseUs";
// import OurPartners from "../components/OurPartners";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { FaSearch } from "react-icons/fa";
// import { MdClose } from "react-icons/md";
// import { Autocomplete, TextField, Chip } from "@mui/material";
// import { setFilterdData } from "../features/BasicSlice";
// import "../styles/home.css";

// import { api } from "../axiosConfig";
// import Articles from "../components/Articles";
// import EliteProjectsSection from "../components/EliteProjectsSection";

// const Home = () => {
//   const navigate = useNavigate();
//   const { viewType, filter } = useSelector((store) => store.basic);
//   const dispatch = useDispatch();
//   const [activeTab, setActiveTab] = useState("Buy");
//   const [searchValue, setSearchValue] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [selectedLocations, setSelectedLocations] = useState(
//     Array.isArray(filter?.search) ? filter.search : []
//   );

//   // References to sections we want to scroll to
//   const newlyLaunchedRef = useRef(null);
//   const interiorDesignRef = useRef(null);

//   const [filters, setFilters] = useState({
//     localities: [],
//     budget: { min: 0, max: 50000000 },
//     bedrooms: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"],
//     constructionStatus: ["New Launch", "Under Construction", "Ready to Move"],
//     areaRange: { min: 0, max: 5000 },
//     furnishingStatus: ["Unfurnished", "Semi-furnished", "Furnished"],
//   });

//   const [propertyType, setPropertyType] = useState(filter?.propertyType || "");

//   const handleAddLocation = (event) => {
//     if (event.key === "Enter" && searchValue.trim() !== "") {
//       const updatedLocations = [...selectedLocations, searchValue.trim()];
//       setSelectedLocations(updatedLocations);
//       setSearchValue("");
//     }
//   };

  // const handleRemoveLocation = (location) => {
  //   setSelectedLocations(selectedLocations.filter((loc) => loc !== location));
  // };

//   const handleSearch = () => {
//     const updatedFilter = {
//       ...filter,
//       search: selectedLocations.length > 0 ? selectedLocations : searchValue.trim(),
//       propertyType: propertyType,
//     };
//     dispatch(setFilterdData(updatedFilter));
//     navigate("/list-view");
//     console.log("Final Filter for Search:", updatedFilter);
//   };

//   useEffect(() => {
//     api
//       .get("/get-all-categories") // Endpoint from the backend method
//       .then((response) => {
//         if (response.data.status === "success") {
//           setCategories(response.data.data);
//         }
//       })
//       .catch((error) => console.error("Failed to fetch categories:", error));
//   }, []);

//   // Function to handle tab clicks and scroll to appropriate section
//   const handleTabClick = (tab) => {
//     setActiveTab(tab);

//     if (tab === "New Launch" && newlyLaunchedRef.current) {
//       newlyLaunchedRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     } else if (tab === "Interior Design" && interiorDesignRef.current) {
//       interiorDesignRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <Layout>
//       {/* Hero Section */}
//       <div
//         className="bg-cover bg-center relative h-128 banner-wrapper"
//       // style={{ backgroundImage: `url(${banner})` }}
//       >
//         <div className="relative rounded-lg">
//           <LandingCarousel />
//         </div>

//         <div className="relative bottom-10 md:bottom-[165px] w-full px-4 banner-search">
//           {/* Navigation Buttons */}
//           <div className="flex justify-center overflow-x-auto space-x-2 md:space-x-4 py-3 md:py-5">
//             {["Buy", "Plot / Land", "NRI Investment", "Interior Design"].map(
//               (tab) => (
//                 <button
//                   key={tab}
//                   className={`px-3 md:px-5 py-1.5 md:py-3 text-xs md:text-sm rounded-md font-medium whitespace-nowrap ${activeTab === tab
//                     ? 'bg-blue-500 text-white shadow-lg relative after:content-[""] after:absolute after:bottom-[-6px] after:left-1/2 after:transform after:-translate-x-1/2 after:border-solid after:border-t-8 after:border-t-blue-500 after:border-x-8 after:border-x-transparent'
//                     : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
//                     }`}
//                   onClick={() => handleTabClick(tab)}
//                 >
//                   {tab}
//                 </button>
//               )
//             )}
//           </div>

//           {/* Search Bar */}
//           <div className="bg-white bg-opacity-25 py-3 md:py-4 px-0 md:px-4 rounded-md mx-auto max-w-4xl ">
//             <div className="border px-3 md:px-5 gap-3 flex flex-col md:flex-row items-center py-3 md:py-5 bg-white rounded-md shadow-lg mx-auto w-full max-w-4xl">
//               {/* Select Dropdown */}
//               <select
//                 value={propertyType}
//                 onChange={(e) => setPropertyType(e.target.value)}
//                 className="bg-white w-full md:w-40 text-gray-700 px-3 py-2 rounded-md md:rounded-l-md focus:outline-none text-sm"
//               >
//                 <option value="">Property Type</option>
//                 {categories.map((category) => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>


//               <div className="flex items-center border rounded-lg p-2 flex-grow">
//                 <FaSearch className="text-gray-400 mr-2" />
//                 <div className="flex flex-wrap items-center gap-2 w-full">
//                   {selectedLocations.map((location, index) => (
//                     <Chip
//                       key={index}
//                       label={location}
//                       onDelete={() => handleRemoveLocation(location)}
//                       deleteIcon={
//                         <MdClose style={{ color: "#0078DB", fontSize: "14px" }} />
//                       }
//                       style={{
//                         backgroundColor: "#0078DB21",
//                         color: "#0078DB",
//                         fontWeight: "500",
//                         borderRadius: "16px",
//                         fontSize: "12px",
//                       }}
//                     />
//                   ))}
//                   <div className="flex-grow">
//                     <TextField
//                       variant="standard"
//                       placeholder="Search for locality, landmark, project"
//                       value={searchValue}
//                       onChange={(e) => setSearchValue(e.target.value)}
//                       onKeyDown={handleAddLocation}
//                       fullWidth
//                       InputProps={{
//                         disableUnderline: true,
//                         className: "outline-none text-gray-500 bg-transparent w-full text-sm",
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Search Button */}
//               <button
//                 className="bg-blue-500 text-white px-6 md:px-10 py-1.5 md:py-2 text-sm rounded hover:bg-blue-600 w-full md:w-auto"
//                 onClick={handleSearch}
//               >
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <EliteProjectsSection />

//       {/* Newly Launched Projects */}
//       <div
//         ref={newlyLaunchedRef}
//         className="flex flex-col justify-center items-center bg-gray-50"
//       >
//         <NewlyLaunchedProjects />
//       </div>

//       <div
//         className="bg-no-repeat bg-bottom pb-10 property-area"
//         style={{ backgroundImage: `url(${banner})` }}
//       >
//         <LocationCarousel />
//       </div>

//       {/*Interior Design */}
//       <div ref={interiorDesignRef}>
//         <PopularInteriorDesign />
//       </div>

//       {/* Why Choose Us */}
//       <div className="flex flex-col justify-center items-center  bg-gray-50">
//         <WhyChooseUs />
//       </div>

//       {/* Our Partners */}
//       <section className="sec-space-50 bg-gray-50">
//         <div className="max-w-7xl mx-auto text-center">

//           <h2 className="text-[28px] text-center mb-10 font-light">
//             Our
//             <span className="text-black font-medium font-heading"> Partners</span>
//           </h2>
//           <p className="text-gray-600 mb-8">
//             It is a long established fact that a reader will be distracted by
//             the readable <br /> content of a page.
//           </p>

//           <OurPartners />
//         </div>
//       </section>

//       <section
//         className="sec-space-50"
//       >
//         <div className="max-w-7xl mx-auto text-left">
//           <h2 className="text-[28px]  mb-2 font-light ">
//             News &{" "}
//             <span className="font-heading text-2xl font-medium mb">Articles</span>{" "}
//           </h2>
//           <p className="text-gray-600 mb-8 ">
//             Read what's happening in Reals Estate
//           </p>

//           <Articles />
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default Home;


// Debounce function for API calls
  // const debounce = (func, delay) => {
  //   let timeoutId;
  //   return (...args) => {
  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(() => func(...args), delay);
  //   };
  // };

  // Google Places Autocomplete function
  // const getGooglePlacesSuggestions = debounce((input) => {
  //   if (!input.trim() || !autocompleteService.current) {
  //     setSuggestions([]);
  //     setShowSuggestions(false);
  //     return;
  //   }

  //   setIsLoadingPlaces(true);

  //   const request = {
  //     input: input,
  //     componentRestrictions: { country: 'IN' }, 
  //     fields: ['place_id', 'formatted_address', 'name', 'types']
  //   };

  //   autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
  //     setIsLoadingPlaces(false);

  //     if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
  //       const formattedSuggestions = predictions.map(prediction => ({
  //         place_id: prediction.place_id,
  //         description: prediction.description,
  //         main_text: prediction.structured_formatting.main_text,
  //         secondary_text: prediction.structured_formatting.secondary_text,
  //         types: prediction.types
  //       }));

  //       setSuggestions(formattedSuggestions);
  //       setShowSuggestions(true);
  //     } else {
  //       setSuggestions([]);
  //       setShowSuggestions(false);
  //     }
  //   });
  // }, 300);

  // Handle search input change
  // const handleSearchInputChange = (e) => {
  //   const value = e.target.value;
  //   setSearchValue(value);

  //   if (value.trim()) {
  //     getGooglePlacesSuggestions(value);
  //   } else {
  //     setSuggestions([]);
  //     setShowSuggestions(false);
  //   }
  // };
