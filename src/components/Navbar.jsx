import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaChevronDown,
  FaHome,
  FaBars,
  FaTimes,
  FaCaretDown,
  FaCaretUp,
} from "react-icons/fa";
import { HiOutlineLogout, HiOutlineKey } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import profileimg from "../assets/profile.png";
import { MdOutlinePostAdd, MdOutlineVerifiedUser } from "react-icons/md";
import { RiLockPasswordLine, RiHeart3Line } from "react-icons/ri";
import logo from "../assets/homewala.png";
import { useNavigate } from "react-router-dom";
import { setIsNavbarModalOpen } from "../features/BasicSlice";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../axiosConfig";
import { toast } from "react-toastify";
import profileIcon from "../assets/profileicon.png";
import Logo from "../assets/homewala.png";
import { setFilterdData } from "../features/BasicSlice";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isTopPicksOpen, setIsTopPicksOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBuyDropdownOpen, setIsBuyDropdownOpen] = useState(false);
  const [isMobileBuyDropdownOpen, setIsMobileBuyDropdownOpen] = useState(false);
  const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);
  const [mLogo, setMLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState(["Chennai", "Bengaluru", "Hyderabad"]);
  const [selectedCity, setSelectedCity] = useState("Chennai");
  const auth = localStorage.getItem("access_token");
  const [isScrolled, setIsScrolled] = useState(false);

  const profileDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const topPicksRef = useRef(null);
  const buyDropdownRef = useRef(null);
  const helpDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { user } = useSelector((state) => state.basic);
  const { filter } = useSelector((store) => store.basic);
  const location = useLocation();
  // Handle outside clicks for all dropdowns
  const handleOutsideClick = useCallback((event) => {
    if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
      setIsProfileDropdownOpen(false);
    }
    if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
      setIsCityDropdownOpen(false);
    }
    if (topPicksRef.current && !topPicksRef.current.contains(event.target)) {
      setIsTopPicksOpen(false);
    }
    if (buyDropdownRef.current && !buyDropdownRef.current.contains(event.target)) {
      setIsBuyDropdownOpen(false);
    }
    if (helpDropdownRef.current && !helpDropdownRef.current.contains(event.target)) {
      setIsHelpDropdownOpen(false);
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.header-bar')) {
      setIsMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch logo
  const mainLogo = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/website-info");
      setMLogo(response.data.data.logo);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load logo");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mainLogo();
  }, [mainLogo]);

 useEffect(() => {
  if (window.gtag) {
    // ✅ Page View
    window.gtag("event", "page_view", {
      page_path: location.pathname,
      page_location: window.location.href,
    });

    // ✅ User Engagement
    window.gtag("event", "user_engagement", {
      engagement_time_msec: 100,
    });
  }
}, [location.pathname]);
 
  // Navigation handlers
  const handleCitySelection = useCallback((city) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
  }, []);

  const handleSearch = useCallback(() => {
    const updatedFilter = { max_price: 7000000, paginate: 1 };
    dispatch(setFilterdData(updatedFilter));
    navigate("/property-below-70l");
  }, [dispatch, navigate]);

  const handlelocation = useCallback((data) => {
    const updatedFilter = { chennai_property_area: data, paginate: 1 };
    dispatch(setFilterdData(updatedFilter));

    // Only change the slug for Chennai as requested; others keep existing route
    if (String(data).trim().toLowerCase() === 'chennai') {
      navigate('/properties-for-sale-in-chennai');
    } else {
      navigate('/list-view/' + String(data).toLowerCase());
    }
  }, [dispatch, navigate]);

  const handlePropertyTypeSelection = useCallback((type) => {
    const updatedFilter = { property_type: type, paginate: 1 };
    dispatch(setFilterdData(updatedFilter));
    setIsBuyDropdownOpen(false);
    // SEO slug for property types
    if (String(type).toLowerCase() === 'apartment') {
      navigate('/apartments-in-chennai');
    } else if (String(type).toLowerCase() === 'villa') {
      navigate('/villas-in-chennai');
    } else if (String(type).toLowerCase() === 'plot') {
      navigate('/plots-in-chennai');
    } else if (String(type).toLowerCase() === 'individual house') {
      navigate('/individual-houses-in-chennai');
    } else {
      navigate('/list-view');
    }
  }, [dispatch, navigate]);

const handleBudgetSelection = useCallback((min, max) => {
  const updatedFilter = {
    paginate: 1,
    min_price: min,
    max_price: max,

    // 🔥 RESET ALL OLD FILTERS
    property_type: "",
    top_pick: "",
    chennai_property_area: "",
    categoryId: "",
    property_area: "",
  };

  dispatch(setFilterdData(updatedFilter));
  setIsBuyDropdownOpen(false);
  navigate("/property-below-70l");
}, [dispatch, navigate]);


  const handleTopPicksSelection = useCallback((top_picks_selection) => {
    const updatedFilter = { paginate: 1, top_pick: top_picks_selection };
    dispatch(setFilterdData(updatedFilter));
    setIsBuyDropdownOpen(false);
    setIsMobileMenuOpen(false);

    if (top_picks_selection === 'Best Deals') {
      navigate('/best-deals');
    } else if (top_picks_selection === 'Luxury Homes') {
      navigate('/luxury-homes-in-chennai');
    } else if (top_picks_selection === 'Best Location Picks') {
      navigate('/best-location-picks');
    } else if (top_picks_selection === 'NRI Investment') {
      navigate('/nri-investment');
    } else {
      navigate('/list-view');
    }
  }, [dispatch, navigate]);

  const logout = useCallback(async () => {
    try {
      const response = await api.post("/logout");
      if (response.data.status === "success") {
        dispatch(setIsNavbarModalOpen(false));
        toast.success(response.data.message);
        localStorage.removeItem("access_token");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  }, [dispatch]);

  // Responsive breakpoints
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  return (
    <nav
      className={`py-3 px-4 sm:px-6 fixed top-0 left-0 w-full bg-white transition-all duration-300 ease-in-out navbar-header ${
        isScrolled ? "shadow-md" : "shadow-none"
      }`}
      style={{ borderBottom: "1px solid #E6E6E6", zIndex: 999 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 md:gap-4 lg:gap-0">
        {/* Logo Section */}
        <div
  onClick={() => navigate("/")}
  className="flex items-center space-x-3 cursor-pointer header-logo min-w-[120px] md:min-w-[150px]"
>
  {isLoading ? (
  <img src={Logo} alt="Logo" className="w-32 h-8 md:w-40 md:h-10 object-contain" />
) : (
  mLogo && (
    <img
      src={mLogo}
      alt="Logo"
      className="object-contain"
    />
  )
)}

</div>


        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          <button
            onClick={() => handlelocation(user?.address || "Chennai")}
            className="text-gray-700 font-medium hover:text-blue-500 text-sm lg:text-base"
          >
            {user?.address || "Chennai"}
          </button>

          {/* Buy Dropdown */}
          <div className="relative" ref={buyDropdownRef}>
            <button
              onClick={() => setIsBuyDropdownOpen(!isBuyDropdownOpen)}
              className="flex items-center space-x-1 text-gray-700 font-medium hover:text-blue-500 focus:outline-none text-sm lg:text-base"
            >
              <span>Buy</span>
              {isBuyDropdownOpen ? (
                <FaCaretUp className="text-xs" />
              ) : (
                <FaCaretDown className="text-xs" />
              )}
            </button>

            {isBuyDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-white border rounded shadow-lg w-[280px] sm:w-[350px] md:w-[450px] lg:w-[700px] z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
                  <div>
                    <h3 className="text-gray-800 font-bold mb-3 text-sm lg:text-base">Top Picks</h3>
                    <ul className="space-y-2">
                      {["Best Deals", "NRI Investment", "Luxury Homes", "Best Location Picks"].map(
                        (item) => (
                          <li key={item}>
                            <button
                              className="text-gray-700 hover:text-blue-500 transition-colors text-xs sm:text-sm"
                              onClick={() => {
                                handleTopPicksSelection(item);
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              {item}
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-gray-800 font-bold mb-3 text-sm lg:text-base">
                      Property Type
                    </h3>
                    <ul className="space-y-2">
                      {["Apartment", "Villa", "Plot", "Individual House"].map((type) => (
                        <li key={type}>
                          <button
                            className="text-gray-700 hover:text-blue-500 transition-colors text-xs sm:text-sm"
                            onClick={() => handlePropertyTypeSelection(type)}
                          >
                            {type}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <h3 className="text-gray-800 font-bold mb-3 text-sm lg:text-base">Budget</h3>
                    <ul className="space-y-2">
                      {[
                        { label: "₹ 15 lakhs - 35 lakhs", min: 1500000, max: 3500000 },
                        { label: "₹ 35 lakhs - 50 lakhs", min: 3500000, max: 5000000 },
                        { label: "₹ 50 lakhs - 75 lakhs", min: 5000000, max: 7500000 },
                        { label: "₹ 75 lakh above", min: 7500000, max: 200000000 },
                      ].map((item) => (
                        <li key={item.label}>
                          <button
                            className="text-gray-700 hover:text-blue-500 transition-colors text-xs sm:text-sm"
                            onClick={() => handleBudgetSelection(item.min, item.max)}
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/interior")}
            className="text-gray-700 font-medium hover:text-blue-500 text-sm lg:text-base"
          >
            Interior
          </button>

          <button
            onClick={() => handleBudgetSelection(500000, 7000000)}
            className="text-gray-700 font-medium hover:text-blue-500 text-sm lg:text-base whitespace-nowrap"
          >
            Property Below 70 L
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button
            onClick={() => navigate("/post-property")}
            className="hidden md:flex items-center space-x-2 text-blue-500 font-medium py-1 px-2 rounded-md hover:bg-blue-50 focus:outline-none text-sm lg:text-base post-property-btn"
          >
            {/* <FaHome className="text-base" /> */}
            <span>Post Property</span>
            <small className="text-xs free-btn">Free</small>
          </button>

          {auth ? (
            <div
              className="relative z-50"
              ref={profileDropdownRef}
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <div className="flex items-center space-x-2 cursor-pointer z-50">
                <div
                  className="rounded-full relative p-0.5"
                  style={{ background: "#e9e9ea" }}
                >
                  <img
                    src={user && user.profile_image === null ? profileIcon : user?.profile_image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-[#35C119] rounded-full"></span>
                </div>

                <span className="text-gray-700 text-sm font-medium hidden lg:inline">
                  {user && user.first_name}
                </span>
                {isProfileDropdownOpen ? (
                  <FaCaretUp size={16} className="text-xs text-gray-500" />
                ) : (
                  <FaCaretDown size={16} className="text-xs text-gray-500" />
                )}
              </div>

              {isProfileDropdownOpen && (
                <div className="absolute top-12 right-0 bg-white border rounded shadow-lg w-48 z-50 text-left">
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center w-full space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <AiOutlineUser className="text-gray-500 w-4" />
                    <span>Profile</span>
                  </button>

                  <hr />
                  <button
                    onClick={() => navigate("/wish-list")}
                    className="flex items-center w-full space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <RiHeart3Line className="text-gray-500 w-4" />
                    <span>Wishlist</span>
                  </button>
                  <hr />
                  <button
                    onClick={() => navigate("/post-property")}
                    className="flex items-center w-full space-x-2 px-4 py-2 text-sm whitespace-nowrap text-gray-700 hover:bg-gray-100"
                  >
                    <MdOutlinePostAdd className="text-gray-500 w-4" />
                    <span>Post Property</span>
                  </button>
                  <hr />
                  <button
                    onClick={() => dispatch(setIsNavbarModalOpen("changepassword"))}
                    className="flex items-center w-full space-x-2 px-4 py-2 text-sm whitespace-nowrap text-gray-700 hover:bg-gray-100"
                  >
                    <HiOutlineKey className="text-gray-500 w-4" />
                    <span>Change Password</span>
                  </button>
                  <hr />
                  <button
                    onClick={logout}
                    className="flex items-center w-full space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <HiOutlineLogout className="text-red-500 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => dispatch(setIsNavbarModalOpen("login"))}
              className="flex text-sm md:text-base sign-in"
            >
              <span className="userlogin-icon">
                <img src="/ph_user.svg" alt="User" className="w-5 h-5 iconcsm-width" />
              </span>
              <span>Sign in</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden header-bar">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 focus:outline-none p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-20 transition-all duration-300 max-h-[calc(100vh-64px)] overflow-y-auto"
        >
          <div className="flex flex-col space-y-4 p-4">
            <button
              onClick={() => {
                handlelocation(user?.address || "Chennai");
                setIsMobileMenuOpen(false);
              }}
              className="text-gray-700 font-medium text-left px-4 py-2 hover:text-blue-500"
            >
              {user?.address || "Chennai"}
            </button>

            {/* Mobile Buy Dropdown */}
            <div className="relative border-b border-gray-100 pb-4">
              <button
                onClick={() => setIsMobileBuyDropdownOpen(!isMobileBuyDropdownOpen)}
                className="flex items-center justify-between w-full text-gray-700 font-medium text-left px-4 py-2 hover:text-blue-500"
              >
                <span>Buy</span>
                {isMobileBuyDropdownOpen ? (
                  <FaCaretUp className="text-sm" />
                ) : (
                  <FaCaretDown className="text-sm" />
                )}
              </button>

              {isMobileBuyDropdownOpen && (
                <div className="mt-2 bg-gray-50 rounded-lg p-2">
                  <div className="px-2 py-2">
                    <h3 className="text-gray-800 font-bold mb-2 text-sm">Top Picks</h3>
                    <ul className="space-y-2 ml-2">
                      {["Best Deals", "NRI Investment", "Luxury Homes", "Best Location Picks"].map(
                        (item) => (
                          <li key={item}>
                            <button
                              className="text-gray-700 hover:text-blue-500 text-sm w-full text-left py-1 px-2 rounded hover:bg-gray-100"
                              onClick={() => {
                                handleTopPicksSelection(item);
                                setIsMobileBuyDropdownOpen(false);
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              {item}
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="px-2 py-2">
                    <h3 className="text-gray-800 font-bold mb-2 text-sm">Property Type</h3>
                    <ul className="space-y-2 ml-2">
                      {["Apartment", "Villa", "Plot", "Individual House"].map((type) => (
                        <li key={type}>
                          <button
                            className="text-gray-700 hover:text-blue-500 text-sm w-full text-left py-1 px-2 rounded hover:bg-gray-100"
                            onClick={() => {
                              handlePropertyTypeSelection(type);
                              setIsMobileBuyDropdownOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {type}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="px-2 py-2">
                    <h3 className="text-gray-800 font-bold mb-2 text-sm">Budget</h3>
                    <ul className="space-y-2 ml-2">
                      {[
                        { label: "₹ 5 lakhs - 15 lakhs", min: 500000, max: 1500000 },
                        { label: "₹ 15 lakhs - 20 lakhs", min: 1500000, max: 2000000 },
                        { label: "₹ 20 lakhs - 25 lakhs", min: 2000000, max: 2500000 },
                        { label: "₹ 25 lakhs above", min: 2500000, max: 100000000 },
                      ].map((item) => (
                        <li key={item.label}>
                          <button
                            className="text-gray-700 hover:text-blue-500 text-sm w-full text-left py-1 px-2 rounded hover:bg-gray-100"
                            onClick={() => {
                              handleBudgetSelection(item.min, item.max);
                              setIsMobileBuyDropdownOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                navigate("/interior");
                setIsMobileMenuOpen(false);
              }}
              className="text-gray-700 font-medium text-left px-4 py-2 hover:text-blue-500"
            >
              Interior
            </button>

            <button
              onClick={() => {
                handleSearch();
                setIsMobileMenuOpen(false);
              }}
              className="text-gray-700 font-medium text-left px-4 py-2 hover:text-blue-500"
            >
              Property Below 70 L
            </button>

            {!auth && (
              <button
                onClick={() => {
                  dispatch(setIsNavbarModalOpen("login"));
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-blue-500 font-medium py-2 px-4 hover:bg-blue-50 rounded-md"
              >
                <span>Sign In</span>
                <AiOutlineUser className="text-lg" />
              </button>
            )}

            <button
              onClick={() => {
                navigate("/post-property");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-2 bg-blue-500 text-white font-medium py-2 px-4 mx-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              <span>Post Property</span>
              <FaHome className="text-lg" />
            </button>

            {auth && (
              <>
                <hr className="my-2" />
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-700 font-medium py-2 px-4 hover:bg-gray-100 rounded-md"
                >
                  <AiOutlineUser className="text-lg" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/wish-list");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-700 font-medium py-2 px-4 hover:bg-gray-100 rounded-md"
                >
                  <AiOutlineHeart className="text-lg" />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => {
                    dispatch(setIsNavbarModalOpen("changepassword"));
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-700 font-medium py-2 px-4 hover:bg-gray-100 rounded-md"
                >
                  <HiOutlineKey className="text-lg" />
                  <span>Change Password</span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-red-600 font-medium py-2 px-4 hover:bg-gray-100 rounded-md"
                >
                  <HiOutlineLogout className="text-lg" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;