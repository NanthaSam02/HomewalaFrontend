import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PropertySearchPage from "../components/PropertySearchPage";
import { api } from "../axiosConfig";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFilterdData } from "../features/BasicSlice";
import { Helmet } from "react-helmet-async";
import { PRIORITY_PROJECTS } from "../utils/projectPriority";


const ListView = () => {
  const { type, area } = useParams();
  const dispatch = useDispatch();
  const { filter } = useSelector((store) => store.basic);

  const location = useLocation();

  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----------- INITIAL SEO STATE ----------------
  const [seo, setSeo] = useState({
  title: "",
  description: "",
  keywords: "",
  canonical: "",
});

if (location.pathname === "/listview") {
  return null;
}

  // Helper for cleaning titles into H1
  const cleanH2TitleToH1 = (text) =>
    text.replace(/\d+\sresults\s\|\s*/i, "").replace(/\(.*?\)/g, "").trim();

useEffect(() => {
  const typeMap = {
    apartment: "Apartment",
    apartments: "Apartment",
    villa: "Villa",
    villas: "Villa",
    plot: "Plot",
    plots: "Plot",
  };

  if (type && area) {
    dispatch(
      setFilterdData({
        property_type: typeMap[type?.toLowerCase()] || type,
        property_area: area,
        paginate: 1
      })
    );
  }

}, [type, area]);


  // ---------------- FETCH BANNER --------------------
  useEffect(() => {
    const fetchListBanners = async () => {
      try {
        const response = await api.get("/banner-images", {
          params: { type: "list" },
        });

        if (response.data.data.length > 0) {
          setBanner(response.data.data[0]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchListBanners();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const reorderProjects = (data) => {
  let priorityNames = [];

  if (filter?.top_pick && PRIORITY_PROJECTS[filter.top_pick]) {
    priorityNames = PRIORITY_PROJECTS[filter.top_pick];
  }

  if (filter?.property_type && PRIORITY_PROJECTS[filter.property_type]) {
    priorityNames = PRIORITY_PROJECTS[filter.property_type];
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

  return [...priority, ...normal];
};

  // -------------- SEO + FILTER MAPPING (FIXED) -----------------
  useEffect(() => {
    const pathname = location.pathname.toLowerCase();
    let updatedFilter = { ...filter, paginate: 1 };

    const seoMapping = [
      {
        path: "/best-deals",
        title: "Best Deals in Chennai",
        desc: "Grab the best real estate deals in Chennai.",
        keywords: "real estate deals in Chennai, property offers, discount homes",
        filter: { top_pick: "Best Deals" },
      },
      {
        path: "/luxury-homes-in-chennai",
        title: "Luxury Homes in Chennai",
        desc: "Explore premium luxury homes in Chennai.",
        keywords: "luxury homes chennai, high-end villas, top apartments",
        filter: { top_pick: "Luxury Homes" },
      },
      {
        path: "/apartments-in-chennai",
        title: "Premium Apartments in Chennai | Flats in Chennai | Homewala",
        desc: "Looking for premium apartments in Chennai? Homewala brings you handpicked, RERA-certified flats.",
        keywords:"Apartment in Chennai, Apartment in Tamabram, Apartment in Kundrathur, Apartment in Siruseri, Apartment in Ponmar, Apartment in Ottiambakkam, Apartment in Padappai, Apartment in Pammal, Apartment in Sembakkam, Apartment in Thiruneermalai, Apartment in Mangadu, Apartment in Sithalpakkam, Apartment in Thalambur, Flats in Chennai, Flats in Tambaram, Flats in Kundrathur, Flats in Siruseri, Flats in Ponmar, Flats in Ottiambakkam, Flats in Padappai, Flats in Pammal, Flats in Sembakkam, Flats in Thiruneermalai, Flats in Mangadu, Flats in Sithalpakkam, Flats in Thalambur, Apartments in Pallavaram, Apartments in Pozhichalur, Apartments in Madambakkam, Apartments in Kolapakkam, Apartments in Naduveerapattu, Apartments in Manimangalam, Flats in Pallavaram, Flats in Pozhichalur, Flats in Madambakkam, Flats in Kolapakkam, Flats in Naduveerapattu, Flats in Manimangalam.",
        filter: { property_type: "Apartment" },
      },
      {
        path: "/plots-in-chennai",
        title: "Plots in Chennai | Homewala.com",
        desc: "Explore the best plots for sale in Chennai with Homewala.com  Choose from handpicked residential land options featuring legal approvals, excellent infrastructure access, and expert guidance to help you make informed, confident property decisions.",
        keywords: "Plots in Chennai, Plots in Tambaram, Plots in Kundrathur, Plots in Siruseri, Plots in Ponmar, Plots in Ottiambakkam, Plots in Padappai, Plots in Pammal, Plots in Sembakkam, Plots in Thiruneermalai, Plots in Mangadu, Plots in Sithalpakkam, Plots in Thalambur, Plots in Pallavaram, Plots in Pozhichalur, Plots in Madambakkam, Plots in Kolapakkam, Plots in Naduveerapattu, Plots in Manimangalam.",
        filter: { property_type: "Plot" },
      },
      {
        path: "/villas-in-chennai",
        title: "Villas for Sale in Chennai | Homewala.com",
        desc: "Explore a handpicked collection of luxury villas and villa plots in Chennai on Homewala.com - independent homes crafted for comfort, built with quality, and set in fast-growing, well-connected residential neighborhoods. Strategically located near major IT hubs, top schools, and renowned colleges, these premium homes offer the ideal blend of convenience, connectivity, and class..",
        keywords: "Villas in Chennai, Villas in Tambaram, Villas in Kundrathur, Villas in Siruseri, Villas in Ponmar, Villas in Ottiambakkam, Villas in Padappai, Villas in Pammal, Villas in Sembakkam, Villas in Thiruneermalai, Villas in Mangadu, Villas in Sithalpakkam, Villas in Thalambur, Villas in Pallavaram, Villas in Pozhichalur, Villas in Madambakkam, Villas in Kolapakkam, Villas in Naduveerapattu, Villas in Manimangalam.",
        filter: { property_type: "Villa" },
      },
      {
        path: "/individual-houses-in-chennai",
        title: "Individual house in chennai | Homewala.com",
        desc: "Homewala lists the best individual houses in Chennai—luxurious standalone homes with privacy, land ownership, and space to grow. Ideal for families and investors seeking secure, RERA-approved properties in well-connected residential zones.",
        keywords: "Individual house in chennai, Individual house in Tamabaram, Individual house in Kundrathur, Individual house in Siruseri, Individual house in Ponmar, Individual house in Ottiambakkam, Individual house in Padappai, Individual house in Pammal, Individual house in Sembakkam, Individual house in Thiruneermalai, Individual house in Mangadu, Individual house in Sithalpakkam, Individual house in Thalambur, Luxury homes in Pallavaram, Luxury homes in Pozhichalur, Luxury homes in Madambakkam, Luxury homes in Kolapakkam, Luxury homes in Naduveerapattu, Luxury homes in Manimangalam.",
        filter: { property_type: "Individual House" },
      },
      {
        path: "/nri-investment",
        title: "NRI Investment Properties",
        desc: "Exclusive properties for NRI investment in Chennai.",
        keywords: "NRI property investment India, real estate for NRI",
        filter: { top_pick: "NRI Investment" },
      },
      {
        path: "/properties-for-sale-in-chennai",
        title: "Properties for Sale in Chennai",
        desc: "Find the best real estate properties in Chennai.",
        keywords: "real estate Chennai, flats Chennai, homes Chennai",
       filter: {},
      },
    ];

    // MATCH URL
    const matched = seoMapping.find((item) => pathname.includes(item.path));

    if (matched) {
      setSeo({
        title: `${matched.title} | Homewala`,
        description: matched.desc,
        keywords: matched.keywords,
        canonical: `https://www.homewala.com${pathname}`,
        h1: matched.h1,
      });

      updatedFilter = { ...updatedFilter, ...matched.filter };
    } else {
      // fallback seo for unknown slugs
      const slugTitle = pathname
        .replace("/", "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      setSeo({
        title: `${slugTitle} | Homewala`,
        description: "Explore real estate in Chennai.",
        keywords: "real estate Chennai, properties Chennai, homewala",
        canonical: `https://www.homewala.com${pathname}`,
        h1: cleanH2TitleToH1(slugTitle),
      });
    }

    // UPDATE REDUX FILTER
  dispatch(setFilterdData({
  ...filter,
  ...updatedFilter,
}));
  }, [location.pathname, dispatch]);

  // ----------------- BANNER CLICK --------------------
  const handleBannerClick = () => {
    if (banner?.redirection_link) {
      window.open(banner.redirection_link, "_blank");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-20 text-red-500">Error: {error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
     

      {seo.title && seo.description && (
  <Helmet>
    <title>{seo.title}</title>
    <meta name="description" content={seo.description} />
    <meta name="keywords" content={seo.keywords} />
    <link rel="canonical" href={seo.canonical} />
    <meta name="robots" content="index,follow" />
  </Helmet>
)}

      {/* Banner */}
      <div
        className="container mx-auto relative mt-5"
        onClick={handleBannerClick}
        style={{ cursor: banner?.redirection_link ? "pointer" : "default" }}
      >
        {banner?.url ? (
          <img
            src={decodeURIComponent(banner.url)}
            alt="Banner"
            className="w-full h-full object-cover border-radius-5"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            No Banner Available
          </div>
        )}
      </div>

      {/* Filters + Property List */}
      <PropertySearchPage />
    </Layout>
  );
};

export default ListView;


// import React, { useState, useEffect } from "react";
// import Layout from "../components/Layout";
// import PropertySearchPage from "../components/PropertySearchPage";
// import { api } from "../axiosConfig";
// import { useParams, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setFilterdData } from "../features/BasicSlice";
// import { Helmet } from "react-helmet-async";
// import { PRIORITY_PROJECTS } from "../utils/projectPriority";


// const ListView = () => {
//   const { type, area } = useParams();
//   const dispatch = useDispatch();
//   const { filter } = useSelector((store) => store.basic);
//   const location = useLocation();

//   const [banner, setBanner] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ----------- INITIAL SEO STATE ----------------
//   const [seo, setSeo] = useState({
//   title: "",
//   description: "",
//   keywords: "",
//   canonical: "",
// });


//   // Helper for cleaning titles into H1
//   const cleanH2TitleToH1 = (text) =>
//     text.replace(/\d+\sresults\s\|\s*/i, "").replace(/\(.*?\)/g, "").trim();

// useEffect(() => {
//   const typeMap = {
//     apartment: "Apartment",
//     apartments: "Apartment",
//     villa: "Villa",
//     villas: "Villa",
//     plot: "Plot",
//     plots: "Plot",
//   };

//   if (type && area) {
//     dispatch(
//       setFilterdData({
//         property_type: typeMap[type?.toLowerCase()] || type,
//         property_area: area,
//         paginate: 1
//       })
//     );
//   }

// }, [type, area]);

//   // ---------------- FETCH BANNER --------------------
//   useEffect(() => {
//     const fetchListBanners = async () => {
//       try {
//         const response = await api.get("/banner-images", {
//           params: { type: "list" },
//         });

//         if (response.data.data.length > 0) {
//           setBanner(response.data.data[0]);
//         }
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchListBanners();
//   }, []);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const reorderProjects = (data) => {
//   let priorityNames = [];

//   if (filter?.top_pick && PRIORITY_PROJECTS[filter.top_pick]) {
//     priorityNames = PRIORITY_PROJECTS[filter.top_pick];
//   }

//   if (filter?.property_type && PRIORITY_PROJECTS[filter.property_type]) {
//     priorityNames = PRIORITY_PROJECTS[filter.property_type];
//   }

//   if (!priorityNames.length) return data;

//   const priority = [];
//   const normal = [];

//   data.forEach((item) => {
//     if (priorityNames.includes(item.project_name)) {
//       priority.push(item);
//     } else {
//       normal.push(item);
//     }
//   });

//   return [...priority, ...normal];
// };

//   // -------------- SEO + FILTER MAPPING (FIXED) -----------------
//   useEffect(() => {
//     const pathname = location.pathname.toLowerCase();
//     let updatedFilter = { ...filter, paginate: 1 };

//     const seoMapping = [
//       {
//         path: "/best-deals",
//         title: "Best Deals in Chennai",
//         desc: "Grab the best real estate deals in Chennai.",
//         keywords: "real estate deals in Chennai, property offers, discount homes",
//         filter: { top_pick: "Best Deals" },
//       },
//       {
//         path: "/luxury-homes-in-chennai",
//         title: "Luxury Homes in Chennai",
//         desc: "Explore premium luxury homes in Chennai.",
//         keywords: "luxury homes chennai, high-end villas, top apartments",
//         filter: { top_pick: "Luxury Homes" },
//       },
//       {
//         path: "/apartments-in-chennai",
//         title: "Premium Apartments in Chennai | Flats in Chennai | Homewala",
//         desc: "Looking for premium apartments in Chennai? Homewala brings you handpicked, RERA-certified flats.",
//         keywords:"Apartment in Chennai, Apartment in Tamabram, Apartment in Kundrathur, Apartment in Siruseri, Apartment in Ponmar, Apartment in Ottiambakkam, Apartment in Padappai, Apartment in Pammal, Apartment in Sembakkam, Apartment in Thiruneermalai, Apartment in Mangadu, Apartment in Sithalpakkam, Apartment in Thalambur, Flats in Chennai, Flats in Tambaram, Flats in Kundrathur, Flats in Siruseri, Flats in Ponmar, Flats in Ottiambakkam, Flats in Padappai, Flats in Pammal, Flats in Sembakkam, Flats in Thiruneermalai, Flats in Mangadu, Flats in Sithalpakkam, Flats in Thalambur, Apartments in Pallavaram, Apartments in Pozhichalur, Apartments in Madambakkam, Apartments in Kolapakkam, Apartments in Naduveerapattu, Apartments in Manimangalam, Flats in Pallavaram, Flats in Pozhichalur, Flats in Madambakkam, Flats in Kolapakkam, Flats in Naduveerapattu, Flats in Manimangalam.",
//         filter: { property_type: "Apartment" },
//       },
//       {
//         path: "/plots-in-chennai",
//         title: "Plots in Chennai | Homewala.com",
//         desc: "Explore the best plots for sale in Chennai with Homewala.com  Choose from handpicked residential land options featuring legal approvals, excellent infrastructure access, and expert guidance to help you make informed, confident property decisions.",
//         keywords: "Plots in Chennai, Plots in Tambaram, Plots in Kundrathur, Plots in Siruseri, Plots in Ponmar, Plots in Ottiambakkam, Plots in Padappai, Plots in Pammal, Plots in Sembakkam, Plots in Thiruneermalai, Plots in Mangadu, Plots in Sithalpakkam, Plots in Thalambur, Plots in Pallavaram, Plots in Pozhichalur, Plots in Madambakkam, Plots in Kolapakkam, Plots in Naduveerapattu, Plots in Manimangalam.",
//         filter: { property_type: "Plot" },
//       },
//       {
//         path: "/villas-in-chennai",
//         title: "Villas for Sale in Chennai | Homewala.com",
//         desc: "Explore a handpicked collection of luxury villas and villa plots in Chennai on Homewala.com - independent homes crafted for comfort, built with quality, and set in fast-growing, well-connected residential neighborhoods. Strategically located near major IT hubs, top schools, and renowned colleges, these premium homes offer the ideal blend of convenience, connectivity, and class..",
//         keywords: "Villas in Chennai, Villas in Tambaram, Villas in Kundrathur, Villas in Siruseri, Villas in Ponmar, Villas in Ottiambakkam, Villas in Padappai, Villas in Pammal, Villas in Sembakkam, Villas in Thiruneermalai, Villas in Mangadu, Villas in Sithalpakkam, Villas in Thalambur, Villas in Pallavaram, Villas in Pozhichalur, Villas in Madambakkam, Villas in Kolapakkam, Villas in Naduveerapattu, Villas in Manimangalam.",
//         filter: { property_type: "Villa" },
//       },
//       {
//         path: "/individual-houses-in-chennai",
//         title: "Individual house in chennai | Homewala.com",
//         desc: "Homewala lists the best individual houses in Chennai—luxurious standalone homes with privacy, land ownership, and space to grow. Ideal for families and investors seeking secure, RERA-approved properties in well-connected residential zones.",
//         keywords: "Individual house in chennai, Individual house in Tamabaram, Individual house in Kundrathur, Individual house in Siruseri, Individual house in Ponmar, Individual house in Ottiambakkam, Individual house in Padappai, Individual house in Pammal, Individual house in Sembakkam, Individual house in Thiruneermalai, Individual house in Mangadu, Individual house in Sithalpakkam, Individual house in Thalambur, Luxury homes in Pallavaram, Luxury homes in Pozhichalur, Luxury homes in Madambakkam, Luxury homes in Kolapakkam, Luxury homes in Naduveerapattu, Luxury homes in Manimangalam.",
//         filter: { property_type: "Individual House" },
//       },
//       {
//         path: "/nri-investment",
//         title: "NRI Investment Properties",
//         desc: "Exclusive properties for NRI investment in Chennai.",
//         keywords: "NRI property investment India, real estate for NRI",
//         filter: { top_pick: "NRI Investment" },
//       },
//       {
//         path: "/properties-for-sale-in-chennai",
//         title: "Properties for Sale in Chennai",
//         desc: "Find the best real estate properties in Chennai.",
//         keywords: "real estate Chennai, flats Chennai, homes Chennai",
//        filter: {},
//       },
//     ];

//     // MATCH URL
//     const matched = seoMapping.find((item) => pathname.includes(item.path));

//     if (matched) {
//       setSeo({
//         title: `${matched.title} | Homewala`,
//         description: matched.desc,
//         keywords: matched.keywords,
//         canonical: `https://www.homewala.com${pathname}`,
//         h1: matched.h1,
//       });

//       updatedFilter = { ...updatedFilter, ...matched.filter };
//     } else {
//       // fallback seo for unknown slugs
//       const slugTitle = pathname
//         .replace("/", "")
//         .replace(/-/g, " ")
//         .replace(/\b\w/g, (char) => char.toUpperCase());

//       setSeo({
//         title: `${slugTitle} | Homewala`,
//         description: "Explore real estate in Chennai.",
//         keywords: "real estate Chennai, properties Chennai, homewala",
//         canonical: `https://www.homewala.com${pathname}`,
//         h1: cleanH2TitleToH1(slugTitle),
//       });
//     }

//     // UPDATE REDUX FILTER
//   dispatch(setFilterdData({
//   ...filter,
//   ...updatedFilter,
// }));
//   }, [location.pathname, dispatch]);

//   // ----------------- BANNER CLICK --------------------
//   const handleBannerClick = () => {
//     if (banner?.redirection_link) {
//       window.open(banner.redirection_link, "_blank");
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="text-center py-20">Loading...</div>
//       </Layout>
//     );
//   }

//   if (error) {
//     return (
//       <Layout>
//         <div className="text-center py-20 text-red-500">Error: {error}</div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
     

//       {seo.title && seo.description && (
//   <Helmet>
//     <title>{seo.title}</title>
//     <meta name="description" content={seo.description} />
//     <meta name="keywords" content={seo.keywords} />
//     <link rel="canonical" href={seo.canonical} />
//     <meta name="robots" content="index,follow" />
//   </Helmet>
// )}

//       {/* Banner */}
//       <div
//         className="container mx-auto relative mt-5"
//         onClick={handleBannerClick}
//         style={{ cursor: banner?.redirection_link ? "pointer" : "default" }}
//       >
//         {banner?.url ? (
//           <img
//             src={decodeURIComponent(banner.url)}
//             alt="Banner"
//             className="w-full h-full object-cover border-radius-5"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gray-200">
//             No Banner Available
//           </div>
//         )}
//       </div>

//       {/* Filters + Property List */}
//       <PropertySearchPage />
//     </Layout>
//   );
// };

// export default ListView;
