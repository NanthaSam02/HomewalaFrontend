import React, { useEffect, useState } from "react";
import { api } from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import BackToTopButton from "./BackToTopButton";
import { useDispatch, useSelector } from "react-redux";
import { setFilterdData } from "../features/BasicSlice";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import WhatsAppFloatingButton from "./WhatsAppFloatingButton.jsx";
import CallFloatingButton from "./CallFloatingButton";

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [footerLinks, setFooterLinks] = useState([]);
  const [activeTab, setActiveTab] = useState("Real Estate");
  const { filter } = useSelector((store) => store.basic);
  const [websiteInfo, setWebsiteInfo] = useState({
    logo: '',
    address: '',
    email_address: '',
    contact_number: ''
  });
  const [visibleLinks, setVisibleLinks] = useState(20); // Show first 20 links by default
  const [showAllLinks, setShowAllLinks] = useState(false);

  const tabs = [
    "Real Estate",
    // "Projects",
    // "City",
    // "Popular Searches",
    "Contact Us",
  ];

const fetchWebsiteInfo = async () => {
  try {
    const response = await api.get("/website-info");
    const data = response.data.data;

    // 👇 ONLY OVERRIDE NUMBER HERE
    setWebsiteInfo({
      ...data,
      contact_number: "+91 8925997080" // nee venum nu irukra number (80)
    });

    if (data.favicon) {
      const faviconLink = document.querySelector("link[rel='icon']");
      if (faviconLink) faviconLink.href = data.favicon;
    }

    // if (data.website_title) document.title = data.website_title;

    // if (data.website_description) {
    //   const metaDescription = document.querySelector("meta[name='description']");
    //   if (metaDescription) metaDescription.content = data.website_description;
    // }
  } catch (error) {
    console.log(error);
    toast.error("Failed to fetch website information");
  }
};

  const handleBuy = (data) => {
  dispatch(setFilterdData({
    chennai_property_area: data,
    paginate: 1
  }));

  // SEO friendly URL
  navigate(`/properties-in-${data.toLowerCase()}`);
};


  useEffect(() => {
    fetchWebsiteInfo();
  }, []);

  useEffect(() => {
    const fetchFooterLinks = async () => {
      try {
        const response = await api.get("/get-footer-links");
        if (response.data.status === "success") {
          setFooterLinks(response.data.links);
        }
      } catch (error) {
        console.error("Failed to fetch footer links:", error);
      }
    };
    fetchFooterLinks();
  }, []);

  const handleSearch = (value) => {
    const updatedFilter = {
      categoryId: value.categoryId,
      property_area: value.property_area,
    };
    dispatch(setFilterdData(updatedFilter));
    if (value.categoryId && value.property_area) {
      const formattedLink = value.link.trim().replace(/\s+/g, '-').toLowerCase();
      navigate(`/${formattedLink}`);
    } else {
      navigate("/list-view");
    }
  };

  const toggleShowAllLinks = () => {
    setShowAllLinks(!showAllLinks);
    setVisibleLinks(showAllLinks ? 20 : footerLinks.length);
  };

  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 pb-5 pt-5">
{/* Animated Tab Navigation */}
<div className="relative border-b border-gray-700">
  <nav className="flex space-x-8 overflow-x-auto hide-scrollbar">
    {tabs.map((tab, index) => (
      <button
        key={index}
        onClick={() => {
          setActiveTab(tab);
          setShowAllLinks(false);
          setVisibleLinks(20);
        }}
        className={`relative whitespace-nowrap py-4 px-1 font-medium text-sm sm:text-base ${
          activeTab === tab ? "text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        {tab}
        {activeTab === tab && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 animate-[underline_0.3s_ease-out]"></span>
        )}
      </button>
    ))}
  </nav>
</div>

        {/* Tab Content */}
        <div className="py-6">
            {activeTab === "Real Estate" && (
        <div className="px-4 sm:px-6">
      <h5 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-white">
        Properties for Sale
      </h5>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {footerLinks.slice(0, visibleLinks).map((value, index) => (
          <div 
            key={index}
            onClick={() => handleSearch(value)} 
            className="text-sm sm:text-base text-gray-300 cursor-pointer hover:text-white transition-colors duration-200 py-1 px-2 rounded hover:bg-gray-700/50"
          >
            {value.link}
          </div>
        ))}
      </div>
      {footerLinks.length > 20 && (
        <button
          onClick={toggleShowAllLinks}
          className="mt-4 md:mt-6 flex items-center justify-center text-blue-400 hover:text-blue-300 transition-colors mx-auto text-sm sm:text-base px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700"
        >
          {showAllLinks ? (
            <>
              <span>Show Less</span>
              <FaChevronUp className="ml-2" />
            </>
          ) : (
            <>
              <span>Show More</span>
              <FaChevronDown className="ml-2" />
            </>
          )}
        </button>
      )}
    </div>
  )}

         {activeTab === "Contact Us" && (
  <div className="max-w-4xl mx-auto">
    <h5 className="text-2xl font-bold mb-8 text-center text-white">
      Get In Touch With Us
    </h5>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Contact Information */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h6 className="text-xl font-semibold mb-4 text-blue-400">Contact Details</h6>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-500/10 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Address</h4>
              <p className="text-white">{websiteInfo.address}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-500/10 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Email</h4>
              <a href={`mailto:${websiteInfo.email_address}`} className="text-white hover:text-blue-400 transition-colors">
                {websiteInfo.email_address}
              </a>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-500/10 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Phone</h4>
              <a href={`tel:${websiteInfo.contact_number}`} className="text-white hover:text-blue-400 transition-colors">
                {websiteInfo.contact_number}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Website */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h6 className="text-xl font-semibold mb-4 text-blue-400">Connect With Us</h6>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="bg-blue-500/10 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400">Website</h4>
              <a href="https://homewala.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition-colors">
                www.homewala.com
              </a>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="pt-2">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a href="https://www.facebook.com/p/Homewalacom-61576002254020/" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>

              {/* Instagram */}
              <a
  href="https://www.instagram.com/homewala_chennai/"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-full transition-colors"
>
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-.9a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z"/>
  </svg>
</a>


              {/* Twitter */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>

              {/* LinkedIn */}
             {/* LinkedIn */}
<a
  href="https://www.linkedin.com/company/homewala-com"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full transition-colors"
>
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
</a>

{/* YouTube */}
<a
  href="https://www.youtube.com/@Homewala-com"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-gray-800 py-4 px-4 rounded-lg">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base">
            {[
              { label: "Home", action: () => navigate("/") },
              { label: "Buy", action: () => handleBuy("Chennai") },
              { label: "Interior", action: () => navigate("/interior") },
              {
  label: "Plot below 70L",
  action: () => {
    dispatch(setFilterdData({
      max_price: 7000000, // 70L
      paginate: 1
    }));
    navigate("/property-below-70l");
  }
},
              // { label: "Help", action: () => navigate("/help") },
              { label: "Privacy Policy", action: () => navigate("/privacy-policy") },
              { label: "Refund Policy", action: () => navigate("/refund-policy") },
              { label: "Terms", action: () => navigate("/terms-and-conditions") },
              { label: "Contact Number: +91 8925997080", action: () => navigate("/") },
            ].map((item, index) => (
              <React.Fragment key={index}>
                <button 
                  onClick={item.action}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
                {index < 7 && <span className="text-gray-500">|</span>}
              </React.Fragment>
            ))}
          </div>
          
          {/* Copyright */}
          <div className="text-center mt-4 text-gray-400 text-sm">
            © {new Date().getFullYear()} Homewala Property. All rights reserved
          </div>
        </div>
      </div>
      <BackToTopButton />
       <CallFloatingButton 
       phone="918925997080"
        position="bottom-right"
        size={42}
        showLabel={false}
       />
      <WhatsAppFloatingButton
        phone="918925997080"
        message="Hi, I'm interested in buying a property from Homewala!"
        position="bottom-right"
        size={42}
        showLabel={false}
      />
    </footer>
  );
};

export default Footer;


























// import React, { useEffect, useState } from "react";
// import { api } from "../axiosConfig";
// import { useNavigate } from "react-router-dom";
// import BackToTopButton from "./BackToTopButton";
// import { useDispatch, useSelector } from "react-redux";
// import { setFilterdData } from "../features/BasicSlice";
// import { toast } from "react-toastify"; // Added toast import

// const Footer = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch()
//   const [footerLinks, setFooterLinks] = useState([]);
//   const [activeTab, setActiveTab] = useState("Real Estate");
//   const { filter } = useSelector((store) => store.basic);
//   const [websiteInfo, setWebsiteInfo] = useState({
//     logo: '',
//     address: '',
//     email_address: '',
//     contact_number: ''
//   });

//   // Dummy tabs for now
//   const tabs = [
//     "Real Estate",
//     "Projects",
//     "City",
//     "Popular Searches",
//     "Contact Us",
//   ];

//   const fetchWebsiteInfo = async () => {
//     try {
//       const response = await api.get("/website-info");
//       console.log("website info", response.data.data);
//       setWebsiteInfo(response.data.data);
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to fetch website information");
//     }
//   };

//   useEffect(() => {
//     fetchWebsiteInfo();
//   }, []);

//   useEffect(() => {
//     const fetchFooterLinks = async () => {
//       try {
//         const response = await api.get("/get-footer-links");
//         if (response.data.status === "success") {
//           setFooterLinks(response.data.links);
//           console.log("/get-footer-links", response.data.links);
//         }
//       } catch (error) {
//         console.error("Failed to fetch footer links:", error);
//       }
//     };

//     fetchFooterLinks();
//   }, []);

//   const handleSearch = (value) => {
//     const updatedFilter = {
//       ...filter,
//       categoryId: value.categoryId,
//       property_area: value.property_area,
//     };
//     dispatch(setFilterdData(updatedFilter));
//     navigate("/list-view");
//   };

//   return (
//     <footer className="w-full bg-gray-900 text-white">
//       <div className="flex justify-center footer-tab">
//         {tabs.map((tab, index) => (
//           <button
//             key={index}
//             onClick={() => setActiveTab(tab)}
//             className={`flex-1 text-center py-4 text-[16px] font-[400] text-[#ffffff99] border-gray-700 last:border-r-0 uppercase ${activeTab === tab ? "text-blue-400 footer-active" : ""
//               }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       <div className="max-w-full mx-auto py-6 px-4 footer-tab-content">
//         {activeTab === "Real Estate" && (
//           <div>
//             <h5 className="font-medium text-lg mb-3 font-heading">
//               Properties for Sale
//             </h5>

//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               {footerLinks.map((value, index) => (
//                 <h1
//                   key={index}
//                   onClick={() => handleSearch(value)}
//                   className="text-md text-[#ffffffcc] cursor-pointer font-[400] hover:text-white transition"
//                 >
//                   {value.link}
//                 </h1>
//               ))}
//             </div>
//           </div>
//         )}
//         {activeTab === "Contact Us" && (
//           <div>
//             <h5 className="font-medium text-lg mb-3 font-heading">
//               Contact Information
//             </h5>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="contact-info">
//                 <div className="mb-2">
//                   <p className="text-[#ffffffcc]"><span className="text-blue-400 text-lg font-medium mb-2">Address : </span> {websiteInfo.address}</p>
//                 </div>

//                 <div className="mb-2">
//                   <p className="text-[#ffffffcc]"><span className="text-blue-400 text-lg font-medium mb-2">Email : </span> {websiteInfo.email_address}</p>
//                 </div>

//                 <div className="mb-2">
//                   <p className="text-[#ffffffcc] mb-4">
//                     <span className="text-blue-400 text-lg font-medium mb-2">Web : </span> homewala.com
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* Add other tab content here */}
//       </div>

//       <div className="text-center bg-[#0F1629BF] py-5">
//         <div className="flex justify-center items-center gap-5 text-[#18px] pb-5 footer-bottom-nav">
//           <h1
//             onClick={() => navigate("/")}
//             className="underline cursor-pointer"
//           >
//             Home
//           </h1>
//           |
//           <h1
//             onClick={() => navigate("/")}
//             className="underline cursor-pointer"
//           >
//             Buy
//           </h1>
//           |
//           <h1
//             onClick={() => navigate("/interior")}
//             className="underline cursor-pointer"
//           >
//             Interior
//           </h1>
//           |
//           <h1
//             onClick={() => navigate("/list-view")}
//             className="underline cursor-pointer"
//           >
//             Plot below 20L
//           </h1>
//           |
//           <h1
//             onClick={() => navigate("/")}
//             className="underline cursor-pointer"
//           >
//             Help
//           </h1>
//         </div>

//         {/* Copyright Section */}
//         <div className="text-sm text-blue-500">
//           © {new Date().getFullYear()} Chennai Property. All rights reserved.
//         </div>
//       </div>
//       <BackToTopButton />
//     </footer>
//   );
// };

// export default Footer;
