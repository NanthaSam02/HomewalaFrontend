import React, { useState, useEffect } from "react";
import BackToTopButton from "./BackToTopButton";

const FooterLayout = () => {
  const mockTabs = [
    { name: "Real Estate", links: ["Overview", "Updates", "News"] },
    { name: "Rentals", links: ["Apartments", "Villas", "Commercial"] },
    { name: "Project", links: ["Company", "Team", "Careers"] },
    { name: "City", links: ["Support", "FAQs", "Feedback"] },
    { name: "Popular Searches", links: ["Trending", "Top Rated", "New Listings"] },
  ];

  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setTabs(mockTabs);
      setActiveTab(mockTabs[0].name);
    }, 1000); 
  }, []);

  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="flex justify-center footer-tab">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 text-center py-4 text-[16px] font-[400] text-[#ffffff99] border-gray-700 last:border-r-0 uppercase ${
              activeTab === tab.name ? "text-blue-400 footer-active" : ""
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex justify-center">
          <div className="w-1/4 border-r border-gray-700 pr-6">
            {tabs
              .find((tab) => tab.name === activeTab)
              ?.links.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="block py-2 px-4 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
                >
                  {link}
                </a>
              ))}
          </div>

       
        </div>
      </div>
      <div className="py-6 text-center text-sm text-gray-400 border-t border-gray-700">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </div>

      <BackToTopButton />
    </footer>
  );
};

export default FooterLayout;
