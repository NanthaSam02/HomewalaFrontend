// import { api } from "../axiosConfig";

// // Function to update website metadata (title, description, favicon)
// const updateWebsiteMetadata = async () => {
//     try {
//         const response = await api.get("/website-info");
//         const websiteInfo = response.data.data;

//         // Update favicon
//         if (websiteInfo.favicon) {
//             const faviconLink = document.querySelector("link[rel='icon']");
//             if (faviconLink) {
//                 faviconLink.href = websiteInfo.favicon;
//             }
//         }

//         // Update title
//         if (websiteInfo.website_title) {
//             // document.title = websiteInfo.website_title;
//         }
//         // Update description
//         if (websiteInfo.website_description) {
//             const metaDescription = document.querySelector("meta[name='description']");
//             if (metaDescription) {
//                 // metaDescription.content = websiteInfo.website_description;
//             }
//         }

//         return websiteInfo;
//     } catch (error) {
//         console.error("Failed to fetch website information for metadata:", error);
//         return null;
//     }
// };

// export default updateWebsiteMetadata;

import { api } from "../axiosConfig";

const updateWebsiteMetadata = async () => {
  try {
    const response = await api.get("/website-info");
    const websiteInfo = response.data.data;

    if (websiteInfo.favicon) {
      const faviconLink = document.querySelector("link[rel='icon']");
      if (faviconLink) {
        faviconLink.href = websiteInfo.favicon;
      }
    }

    return websiteInfo;
  } catch (error) {
    console.error("Failed to fetch website information for metadata:", error);
    return null;
  }
};

export default updateWebsiteMetadata;
