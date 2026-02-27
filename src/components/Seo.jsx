import { Helmet } from "react-helmet-async";

/**
 * ✅ PROJECT SEO MASTER OBJECT
 * slug = key
 */
const projectSeoMap = {
  "rathi's-king's-palace": {
    title: "Rathi’s King’s Palace in Chennai | Premium Apartments for Sale",
    description:
      "Rathi’s King’s Palace offers premium apartments with modern amenities. Best price deals and site visit available with Homewala.",
    keywords:
      "Rathi’s King’s Palace, apartments in Chennai, premium flats Chennai",
  },

  "propshell-arcadia-aerocity": {
    title: "Propshell Arcadia Aerocity | Flats Near Airport Chennai",
    description:
      "Buy luxury flats at Propshell Arcadia Aerocity near Chennai Airport. Excellent connectivity and modern lifestyle.",
    keywords:
      "Propshell Arcadia, Aerocity flats, flats near Chennai airport, Propshell properties",
  },

  "twd-properties-k-g-f": {
    title: "TWD Properties KGF | Affordable Homes in Chennai",
    description:
      "TWD Properties KGF offers affordable residential properties with great location advantage. Enquire now with Homewala.",
    keywords:
      "TWD Properties KGF, affordable homes Chennai, TWD properties, budget flats Chennai",
  },
};


/**
 * ✅ SINGLE SEO COMPONENT
 */
const Seo = ({ slug, property }) => {
  const seoData = projectSeoMap[slug];

  const title =
    seoData?.title ||
    `${property?.title || "Property"} in ${property?.location || "Chennai"} | Homewala`;

  const description =
    seoData?.description ||
    `Explore ${property?.title || "property"} located in ${
      property?.location || "Chennai"
    }. Price, amenities, floor plans & site visit available.`;

  const keywords =
    seoData?.keywords ||
    `${property?.title}, property in ${property?.location}, Chennai real estate`;

  const canonical = `https://www.homewala.com/property/${slug}`;

  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <link rel="canonical" href={canonical} />
  
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Homewala" />
    <meta name="publisher" content="Homewala" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default Seo;
