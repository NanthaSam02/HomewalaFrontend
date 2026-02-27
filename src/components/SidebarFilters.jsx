import { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../axiosConfig";
import { setFilterdData } from "../features/BasicSlice";

// Utility function to format currency in Indian format (lakhs and crores)
const formatIndianCurrency = (value) => {
    if (value >= 10000000) { // 1 Crore or more
        return `${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) { // 1 Lakh or more
        return `${(value / 100000).toFixed(1)} L`;
    } else {
        return `₹${value.toLocaleString('en-IN')}`;
    }
};

// Utility function to format area
const formatArea = (value) => {
    return `${value.toLocaleString('en-IN')} sq ft`;
};

const SidebarFilters = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.basic?.filter ?? {});

    // Define maximum values for budget and area
    const BUDGET_MAX = 200000000; // 200 Crore
    const BUDGET_DEFAULT = [10000000, 50000000]; // Default: 1 Crore to 5 Crore range
    const AREA_MAX = 10000; // 10000 sq ft
    const AREA_DEFAULT = [1000, 3000]; // Default: 1000 to 3000 sq ft range

    // Initialize state with default values
    const [budget, setBudget] = useState(
        filter?.min_price !== undefined && filter?.max_price !== undefined
            ? [filter.min_price, filter.max_price]
            : BUDGET_DEFAULT
    );
    const [minBudget, setMinBudget] = useState(
        filter?.min_price !== undefined ? filter.min_price : BUDGET_DEFAULT[0]
    );
    const [maxBudget, setMaxBudget] = useState(
        filter?.max_price !== undefined ? filter.max_price : BUDGET_DEFAULT[1]
    );

    // Track temporary values during slider interaction
    const [tempBudget, setTempBudget] = useState(budget);
    const [tempArea, setTempArea] = useState(
        filter?.area_min !== undefined && filter?.area_max !== undefined
            ? [filter.area_min, filter.area_max]
            : AREA_DEFAULT
    );

    const [area, setArea] = useState(
        filter?.area_min !== undefined && filter?.area_max !== undefined
            ? [filter.area_min, filter.area_max]
            : AREA_DEFAULT
    );
    const [minArea, setMinArea] = useState(
        filter?.area_min !== undefined ? filter.area_min : AREA_DEFAULT[0]
    );
    const [maxArea, setMaxArea] = useState(
        filter?.area_max !== undefined ? filter.area_max : AREA_DEFAULT[1]
    );

    const [localities, setLocalities] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);

   const budgetOptions = [
    500000,      // 5L
    1000000,     // 10L
    2500000,     // 25L
    5000000,     // 50L
    10000000,    // 1Cr
    50000000,    // 5Cr
    100000000,   // 10Cr
    200000000    // 20Cr
];
    const areaOptions = [
        500, 1000, 1500, 2000, 3000, 4000, 5000, 10000
    ];

    // Initialize Redux with default values if no filter exists
    useEffect(() => {
        if (!isInitialized) {
            // Only initialize Redux if filter doesn't have necessary properties
            // Removed area and price filters initialization
            setIsInitialized(true);
        }
    }, [dispatch, filter, isInitialized]);

    // Fetch localities
    useEffect(() => {
        api.get("get-property-places-count")
            .then((res) => {
                if (res.data.status === "success") {
                    const uniqueLocalities = [...new Set(res.data.data.map(place => place.name))];
                    setLocalities(uniqueLocalities);
                }
            })
            .catch((error) => console.error("Error fetching localities:", error));
    }, []);

    // Sync component state with Redux when Redux updates
    useEffect(() => {
        if (filter && isInitialized) {
            // For Budget
            if (filter.min_price !== undefined && filter.max_price !== undefined) {
                setBudget([filter.min_price, filter.max_price]);
                setTempBudget([filter.min_price, filter.max_price]);
                setMinBudget(filter.min_price);
                setMaxBudget(filter.max_price);
            }

            // For Area
            if (filter.area_min !== undefined && filter.area_max !== undefined) {
                setArea([filter.area_min, filter.area_max]);
                setTempArea([filter.area_min, filter.area_max]);
                setMinArea(filter.area_min);
                setMaxArea(filter.area_max);
            }
        }
    }, [filter, isInitialized]);

    const filteredLocalities = localities.filter(locality =>
        locality.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // const toggleFilter = (key, value) => {
    //     const updatedFilter = { ...filter };
    //     if (!Array.isArray(updatedFilter[key])) {
    //         updatedFilter[key] = [];
    //     }

    //     // For all filters including property_area, maintain the toggle behavior
    //     if (updatedFilter[key].includes(value)) {
    //         updatedFilter[key] = updatedFilter[key].filter(item => item !== value);
    //     } else {
    //         updatedFilter[key] = [...updatedFilter[key], value];
    //     }
    //     dispatch(setFilterdData(updatedFilter));
    // };

   const toggleFilter = (key, value) => {
  // clone existing filter safely
  const updatedFilter = { ...filter };

  // make sure it's an array
  if (!Array.isArray(updatedFilter[key])) {
    updatedFilter[key] = [];
  }

  // check if selected
  const alreadySelected = updatedFilter[key].includes(value);

  if (alreadySelected) {
    // remove value if already selected
    updatedFilter[key] = updatedFilter[key].filter((item) => item !== value);
  } else {
    // add new value
    updatedFilter[key] = [...updatedFilter[key], value];
  }

  // 👇 force state refresh even if same data (solves click-issue)
  dispatch(setFilterdData({ ...updatedFilter }));
};
    
     // Add the missing updateRangeFilter function
    const updateRangeFilter = (minKey, maxKey, newValue) => {
        const updatedFilter = { ...filter };
        updatedFilter[minKey] = newValue[0];
        updatedFilter[maxKey] = newValue[1];
        dispatch(setFilterdData(updatedFilter));
    };

    // Handle slider change without updating Redux
    const handleTempBudgetChange = (e, newValue) => {
        setTempBudget(newValue);
    };

    // Apply changes on slider commit (when user stops dragging)
    const handleBudgetChangeCommitted = (e, newValue) => {
        setBudget(newValue);
        setMinBudget(newValue[0]);
        setMaxBudget(newValue[1]);
        updateRangeFilter("min_price", "max_price", newValue);
    };

const handleMinBudgetChange = (e) => {
    const newMin = Number(e.target.value);

    if (newMin < 500000) return; 
    if (newMin > maxBudget) return;

    const newBudget = [newMin, maxBudget];
    setMinBudget(newMin);
    setBudget(newBudget);
    setTempBudget(newBudget);

    updateRangeFilter("min_price", "max_price", newBudget);
};


const handleMaxBudgetChange = (e) => {
    const newMax = Number(e.target.value);

    if (newMax < minBudget) return;

    const newBudget = [minBudget, newMax];
    setMaxBudget(newMax);
    setBudget(newBudget);
    setTempBudget(newBudget);

    updateRangeFilter("min_price", "max_price", newBudget);
};

    // Handle temporary area slider changes
    const handleTempAreaChange = (e, newValue) => {
        setTempArea(newValue);
    };

    // Apply area changes when slider interaction is complete
    const handleAreaChangeCommitted = (e, newValue) => {
        setArea(newValue);
        setMinArea(newValue[0]);
        setMaxArea(newValue[1]);
        updateRangeFilter("area_min", "area_max", newValue);
    };

    const handleMinAreaChange = (e) => {
        const newMin = Number(e.target.value);
        if (newMin <= maxArea) {
            setMinArea(newMin);
            const newArea = [newMin, maxArea];
            setArea(newArea);
            setTempArea(newArea);
            updateRangeFilter("area_min", "area_max", newArea);
        }
    };

    const handleMaxAreaChange = (e) => {
        const newMax = Number(e.target.value);
        if (newMax >= minArea) {
            setMaxArea(newMax);
            const newArea = [minArea, newMax];
            setArea(newArea);
            setTempArea(newArea);
            updateRangeFilter("area_min", "area_max", newArea);
        }
    };

    const isSelected = (key, value) => {
        return Array.isArray(filter?.[key]) && filter[key].includes(value);
    };

    const filters = {
        bedrooms: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"],
        constructionStatus: ["New Launch", "Under Construction", "Ready to Move"],
        furnishingStatus: ["Unfurnished", "Semi-furnished", "Furnished"],
    };

    // Custom label formatter for the Budget slider
    const valueLabelFormatBudget = (value) => {
        return formatIndianCurrency(value);
    };

    // Custom label formatter for the Area slider
    const valueLabelFormatArea = (value) => {
        return formatArea(value);
    };

    return (
        <div className="sticky top-[150px] p-3 rounded-md shadow-md md:overflow-y-scroll h-screen overflow-x-hidden py-5">
            <hr className="border-1 my-4" />

            <h3 className="text-xl font-medium mb-4">Localities</h3>
            <input
                type="text"
                placeholder="Search your location"
                className="border p-2 rounded-md w-full mb-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredLocalities.map((locality, index) => {
                const isChecked = (filter?.property_area ?? []).includes(locality);
                return (
                    <div
                        key={index}
                        className="flex items-center mb-2 cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            id={`locality-${index}`}
                            checked={isChecked}
                            onChange={() => toggleFilter("property_area", locality)}
                            className="cursor-pointer mr-2"
                        />
                        <label
                            htmlFor={`locality-${index}`}
                            className="text-gray-700 cursor-pointer select-none"
                        >
                            {locality}
                        </label>
                    </div>
                );
            })}

            <hr className="border-1 my-4" />

            <h3 className="text-xl font-medium mb-4">Budget</h3>
           <Slider
    value={tempBudget}
    onChange={handleTempBudgetChange}
    onChangeCommitted={handleBudgetChangeCommitted}
    min={500000}
    max={200000000}
    step={500000}
    valueLabelDisplay="auto"
    valueLabelFormat={valueLabelFormatBudget}
/>

            <div className="flex justify-between mb-4 space-x-2">
              <select
    value={minBudget}
    onChange={handleMinBudgetChange}
    className="border p-2 rounded-md w-1/2 md:w-1/3 text-[10px] h-8"
>
    {budgetOptions.map((amount, index) => (
        <option key={index} value={amount}>
            {formatIndianCurrency(amount)}
        </option>
    ))}
</select>

              <select
    value={maxBudget}
    onChange={handleMaxBudgetChange}
    className="border p-2 rounded-md w-1/2 md:w-1/3 text-[10px] h-8"
>
    {budgetOptions.map((amount, index) => (
        <option key={index} value={amount}>
            {formatIndianCurrency(amount)}
        </option>
    ))}
</select>
            </div>

            <hr className="border-1 my-4" />
            <h3 className="text-xl font-medium mb-4">Area (sq ft)</h3>
            <Slider
                value={tempArea}
                onChange={handleTempAreaChange}
                onChangeCommitted={handleAreaChangeCommitted}
                min={0}
                max={AREA_MAX}
                step={100}
                valueLabelDisplay="auto"
                valueLabelFormat={valueLabelFormatArea}
            />

            <div className="flex justify-between mb-4 space-x-2">
                <select
                    value={minArea}
                    onChange={handleMinAreaChange}
                    className="border p-2 rounded-md w-1/2 md:w-1/3 text-[10px] h-8"
                >
                    {areaOptions.map((areaValue, index) => (
                        <option className="text-[10px]" key={index} value={areaValue}>
                            {areaValue === 0 ? "Min Area" : `${areaValue} sq ft`}
                        </option>
                    ))}
                </select>

                <select
                    value={maxArea}
                    onChange={handleMaxAreaChange}
                    className="border p-2 rounded-md w-1/2 md:w-1/3 text-[10px] h-8"
                >
                    {areaOptions.map((areaValue, index) => (
                        <option className="text-[10px]" key={index} value={areaValue}>
                            {areaValue === AREA_MAX ? "10000+ sq ft" : `${areaValue} sq ft`}
                        </option>
                    ))}
                </select>
            </div>
            <hr className="border-1 my-4" />

            <h3 className="text-xl font-medium mb-4">No. of Bedrooms</h3>
            <div className="flex flex-wrap gap-2">
                {filters.bedrooms.map((bedroom, index) => (
                    <button
                        key={index}
                        className={`border px-3 py-1 rounded-md transition-all ${isSelected('beds', bedroom) ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                        onClick={() => toggleFilter("beds", bedroom)}
                        type="button"
                    >
                        {bedroom}
                    </button>
                ))}
            </div>

            <hr className="border-1 my-4" />

            <h3 className="text-xl font-medium mb-4">Construction Status</h3>
            <div className="flex flex-wrap gap-2">
                {filters.constructionStatus.map((status, index) => (
                    <button
                        key={index}
                        className={`border px-3 py-1 rounded-md transition-all ${isSelected('construction_status', status) ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                        onClick={() => toggleFilter("construction_status", status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <hr className="border-1 my-4" />

            <h3 className="text-xl font-medium mb-4">Furnishing Status</h3>
            <div className="flex flex-wrap gap-2">
                {filters.furnishingStatus.map((status, index) => (
                    <button
                        key={index}
                        className={`border px-3 py-1 rounded-md transition-all ${isSelected('furnished_status', status) ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                        onClick={() => toggleFilter("furnished_status", status)}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SidebarFilters;