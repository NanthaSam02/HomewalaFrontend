import React from 'react'
import Layout from '../components/Layout'
import banner from '../assets/banner.jpg';
import SetPasswordModel from '../components/Models/SetPasswordModel';

const SetPassword = () => {
    return (
        <Layout>
            <div className="bg-cover bg-center relative" style={{ backgroundImage: `url(${banner})` }}>
                <div className="text-center text-white  py-60"></div>
            </div>
            <SetPasswordModel />
        </Layout>
    )
}

export default SetPassword