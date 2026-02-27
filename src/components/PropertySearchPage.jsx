import { FaFilter, FaSearch, FaList, FaMap, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import PropertyCard from "./PropertyCard";
import Switch from "@mui/material/Switch";
import SidebarFilters from "./SidebarFilters";
import SearchBar from "./SearchBar.JSX";
import MapView from "./MapView";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { setFilterdData, setPropertiesList } from "../features/BasicSlice";
import CircularProgress from '@mui/material/CircularProgress';
import { Drawer } from "@mui/material";
import { PRIORITY_PROJECTS } from "../utils/projectPriority";
import { useLocation } from "react-router-dom";



const PropertySearchPage = () => {
  const { viewType, propertiesList, filter } = useSelector(
    (store) => store.basic
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [prevFilter, setPrevFilter] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const resultsTopRef = useRef(null);

  const currentPage = filter?.page || propertiesList?.pagination?.current_page || 1;
  const totalPages = propertiesList?.pagination?.total_pages || 1;
  const hasNoResults = propertiesList?.data?.length === 0;

  const scrollToResults = () => {
    if (resultsTopRef.current) {
      const yOffset = -180;
      const element = resultsTopRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const handlePageChange = async (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    console.log('Page change requested:', page, 'Current page:', currentPage);
    
    try {
      setIsLoading(true);
      const updatedFilter = {
        ...filter,
        page: page,
        per_page: 10,
      };
      
      // Update filter state immediately so UI reflects the change
      dispatch(setFilterdData(updatedFilter));
      
      console.log('Sending API request with filter:', updatedFilter);
      
      const response = await api.post(
        "get-filtered-listview-properties",
        updatedFilter
      );

      console.log('API response received:', response.data);
      dispatch(setPropertiesList(response.data));
      setIsLoading(false);
      
      scrollToResults();
    } catch (error) {
      console.error("Failed to fetch property details:", error);
      setIsLoading(false);
    }
  };

  const SearchFetch = async (shouldScroll = false, resetToFirstPage = false) => {
    try {
      setIsLoading(true);
      
      // Prepare filter with proper pagination parameters
      const searchFilter = {
        ...filter,
        page: resetToFirstPage ? 1 : (filter.page || 1),
        per_page: 10
      };
      
      const response = await api.post(
        "get-filtered-listview-properties",
        searchFilter
      );

      dispatch(setPropertiesList(response.data));
      
      // Update the filter in store with pagination parameters
      if (resetToFirstPage || !filter.page) {
        dispatch(setFilterdData(searchFilter));
      }
      
      setIsLoading(false);

      if (shouldScroll) {
        setTimeout(() => {
          scrollToResults();
        }, 100);
      }
    } catch (error) {
      console.error("Failed to fetch property details:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    SearchFetch(false);
    setPrevFilter(filter);
  }, []);

  useEffect(() => {
    if (Object.keys(prevFilter).length > 0) {
      const isFilterChanged = JSON.stringify(filter) !== JSON.stringify(prevFilter);
      const isPaginationChange =
        isFilterChanged &&
        Object.keys(filter).length === Object.keys(prevFilter).length &&
        Object.keys(filter).every(key =>
          key === 'page' || key === 'per_page' || filter[key] === prevFilter[key]
        );

      if (isFilterChanged && !isPaginationChange) {
        // Reset to page 1 when filters change (not pagination)
        SearchFetch(true, true);
      }
      setPrevFilter(filter);
    }
  }, [filter]);

  // Function to generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7; // Number of page buttons to show (including ellipsis)
    
    // Always show first page
    pages.push(1);
    
    // Determine range of pages to show
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    // Adjust if we're near the start
    if (currentPage <= 4) {
      endPage = Math.min(6, totalPages - 1);
    }
    
    // Adjust if we're near the end
    if (currentPage >= totalPages - 3) {
      startPage = Math.max(totalPages - 5, 2);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const reorderProjects = (data) => {
  if (!data || data.length === 0) return data;

  let priorityNames = [];

  // Based on filter (Best Deals, NRI Investment, etc)
  if (filter?.top_pick && PRIORITY_PROJECTS[filter.top_pick]) {
    priorityNames = PRIORITY_PROJECTS[filter.top_pick];
  }

  if (!priorityNames.length) return data;

  const priority = [];
  const normal = [];

  data.forEach((item) => {
    if (priorityNames.includes(item.project_name)) {
      priority.push(item);
    } else {
      normal.push(item);
    }
  });

  // Maintain exact order you defined
  const orderedPriority = priorityNames
    .map((name) => priority.find((p) => p.project_name === name))
    .filter(Boolean);

  return [...orderedPriority, ...normal];
};

  return (
    <div className="container mx-auto px-2 sm:px-4">
      {/* Property Listings */}
      {viewType === "List" ? (
        <>
          {/* Sticky Header with Search and Filter */}
          <div className="sticky top-[65px] bg-white z-40 border-b">
            <div className="flex items-center justify-between p-2 gap-2">
              {/* Search Bar - Takes remaining space */}
              <div className="flex-grow">
                <SearchBar />
              </div>
              
              {/* Mobile Filter Button - Only visible on small screens */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-md whitespace-nowrap"
              >
                <FaFilter className="text-sm" />
                <span className="text-sm">Filters</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 my-3">
            {/* Mobile Filter Drawer */}
            <Drawer
              anchor="left"
              open={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                '& .MuiDrawer-paper': {
                  width: '80%',
                  maxWidth: '320px',
                  boxSizing: 'border-box',
                },
              }}
            >
              <div className="p-4 overflow-y-auto">
                <SidebarFilters onClose={() => setMobileFiltersOpen(false)} />
              </div>
            </Drawer>

            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden md:block w-full md:w-1/4 md:sticky top-4 h-fit">
              <SidebarFilters />
            </div>

            <div className="w-full md:w-3/4 md:ml-6 mt-0 md:mt-0">
              <div ref={resultsTopRef} style={{ height: 0, visibility: 'hidden' }}></div>

          {!isLoading && propertiesList?.dynamicHeading && (
  <div className="mb-4 px-2">
    {/* H1 */}
    <h1 className="text-xl font-semibold">
      {
        // Remove "51 results |" part
        propertiesList.dynamicHeading
          .replace(/^\d+\sresults\s\|\s*/i, "")
          .replace(/\(.*?\)/g, "")
          .trim()
      }
    </h1>

    {/* H2 */}
    <h2 className="text-sm text-gray-500">
      {propertiesList?.pagination?.total || 0} results | (Page{" "}
      {currentPage} of {totalPages})
    </h2>
  </div>
)}



              <div className="rounded-md bg-white flex flex-col gap-4">
                {isLoading && propertiesList?.data?.length === 0 ? (
                  <div className="flex justify-center items-center p-8">
                    <CircularProgress />
                  </div>
                ) : propertiesList && propertiesList.data ? (
                  propertiesList.data.length > 0 ? (
                   reorderProjects(propertiesList.data).map((property) => (
  <PropertyCard key={property.id} property={property} />
))

                  ) : (
                    <div className="flex justify-center items-center p-8">
                      <p className="text-gray-500">No sites available</p>
                    </div>
                  )
                ) : (
                  <div className="flex justify-center items-center p-8">
                    <CircularProgress />
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 mb-4 pt-5">
                  <nav className="inline-flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                    >
                      <FaChevronLeft className="inline mr-1" />
                      Back
                    </button>
                    
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                        disabled={page === '...'}
                        className={`px-3 py-1 rounded-md ${page === currentPage ? 'bg-blue-600 text-white' : page === '...' ? 'text-gray-400 cursor-default' : 'text-blue-600 hover:bg-blue-50'}`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                    >
                      Next
                      <FaChevronRight className="inline ml-1" />
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <MapView />
      )}
    </div>
  );
};

export default PropertySearchPage;