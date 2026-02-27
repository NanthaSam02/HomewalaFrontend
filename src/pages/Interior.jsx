import React, { useState } from 'react'
import Layout from '../components/Layout'
import banner from '../assets/banner.jpg';
import PopularInteriorDesign from '../components/PopularInteriorDesign';
import image from '../assets/homeimg.jpg';
import image1 from '../assets/PopularInteriorDesign/1.png';
import image2 from '../assets/PopularInteriorDesign/2.png';
import image3 from '../assets/PopularInteriorDesign/3.png';
import image4 from '../assets/PopularInteriorDesign/4.png';
import image5 from '../assets/PopularInteriorDesign/5.png';
import image6 from '../assets/PopularInteriorDesign/6.png';

const Interior = () => {
    const [interiorDesigns, setInteriorDesigns] = useState([
        { id: 1, name: 'Mr. Sanjay Kumar', image: image1 },
        { id: 2, name: 'Mr. Kavin', image: image2 },
        { id: 3, name: 'Mr. Kishore Kumar', image: image3 },
        { id: 4, name: 'Mr. Pavilash', image: image4 },
        { id: 5, name: 'Mr. Dhanush', image: image5 },
        { id: 6, name: 'Mr. Jai Shankar', image: image6 },
    ]);
    return (
        <Layout>

            <div className="bg-cover bg-center relative h-128 bg-gray-50 "
                style={{ backgroundImage: `url(${banner})` }}
            >
            </div>
            <div className="flex flex-col md:col-span-2 h-auto md:h-80 w-full text-center md:text-left ">


                {/* <PopularInteriorDesign /> */}
                {/* <section className="pb-10 mx-10">
                    <div className="max-w-7xl mx-auto">

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {interiorDesigns.map((design, index) => (
                                <div
                                    key={design.id}
                                    className={`relative rounded-lg overflow-hidden shadow-lg ${index === 0 || index === 5 ? 'col-span-2' : ''}`}
                                >
                                    <img
                                        src={design.image}
                                        alt={design.name}
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent text-white w-full p-4">
                                        <p className="font-bold font-raleway">{design.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section> */}
            </div>
        </Layout>
    )
}

export default Interior