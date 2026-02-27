import React, { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import Layout from './Layout';
import { api } from '../axiosConfig';
import PropertyCardWishlist from './PropertyCardWishlist';

const WishlistPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/buyer/wishlist');
      console.log('wishlist', response.data.data);
      setProperties(response.data.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="bg-gray-100 py-10 px-6 min-h-screen">
        <h2 className="text-center text-3xl font-light mb-2 font-heading">
          Your Wishlist<span className="font-bold font-heading"> Properties</span>
        </h2>
        <p className="text-center text-gray-500 mb-8">
          These are your saved properties
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">You haven't added any properties to your wishlist yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {properties.map((property) => (
              <PropertyCardWishlist
                key={property.id || property.propertId}
                fetchData={fetchData}
                property={property}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WishlistPage;

















// import React, { useEffect, useState } from 'react';
// import PropertyCard from './PropertyCard';
// import image1 from "../assets/propertyimg.png"
// import Layout from './Layout';
// import { api } from '../axiosConfig';
// import PropertyCardWishlist from './PropertyCardWishlist';

// const WishlistPage = () => {
//   const [properties, setProperties] = useState([])
//   // const [properties] = useState([
//   //   {
//   //     id: 1,
//   //     title: "Real Luxury Family House Villa",
//   //     location: "Est No. 77, Adyar, Chennai",
//   //     image: image1,
//   //     bedrooms: 6,
//   //     bathrooms: 3,
//   //     garages: 2,
//   //     area: "750 Sq ft",
//   //     price: "₹ 1.92 - 3.33 Cr",
//   //   },
//   //   {
//   //     id: 2,
//   //     title: "Modern Family House Villa",
//   //     location: "Est No. 88, Velachery, Chennai",
//   //     image: image1,
//   //     bedrooms: 5,
//   //     bathrooms: 2,
//   //     garages: 1,
//   //     area: "900 Sq ft",
//   //     price: "₹ 2.45 - 4.12 Cr",
//   //   },
//   //   {
//   //     id: 2,
//   //     title: "Modern Family House Villa",
//   //     location: "Est No. 88, Velachery, Chennai",
//   //     image: image1,
//   //     bedrooms: 5,
//   //     bathrooms: 2,
//   //     garages: 1,
//   //     area: "900 Sq ft",
//   //     price: "₹ 2.45 - 4.12 Cr",
//   //   },
//   //   {
//   //     id: 2,
//   //     title: "Modern Family House Villa",
//   //     location: "Est No. 88, Velachery, Chennai",
//   //     image: image1,
//   //     bedrooms: 5,
//   //     bathrooms: 2,
//   //     garages: 1,
//   //     area: "900 Sq ft",
//   //     price: "₹ 2.45 - 4.12 Cr",
//   //   },
//   //   {
//   //     id: 2,
//   //     title: "Modern Family House Villa",
//   //     location: "Est No. 88, Velachery, Chennai",
//   //     image: image1,
//   //     bedrooms: 5,
//   //     bathrooms: 2,
//   //     garages: 1,
//   //     area: "900 Sq ft",
//   //     price: "₹ 2.45 - 4.12 Cr",
//   //   },

//   // ]);

//   const fetchData = async () => {
//     const response = await api.get('/buyer/wishlist')
//     console.log('wishlist', response.data.data)
//     setProperties(response.data.data)
//   }
//   useEffect(() => {
//     fetchData()
//   }, [])
//   return (
//     <Layout>

//       <div className=" bg-gray-100 py-10 px-6">
//         <h2 className="text-center text-3xl font-light mb-2 font-heading ">
//           Your Wishlist<span className="font-bold font-heading"> Properties</span>
//         </h2>
//         <p className="text-center text-gray-500 mb-8">
//           These are our featured properties
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
//           {properties.map((property) => (

//             <PropertyCardWishlist key={property.id} fetchData={fetchData} property={property} />
//           ))}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default WishlistPage;
