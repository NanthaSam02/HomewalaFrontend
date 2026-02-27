import React from 'react'
import Layout from '../components/Layout'
import banner from '../assets/banner.jpg';
import ChangePasswordModel from '../components/Models/ChangePasswordModel';

const ChangePassword = () => {
    return (
        <Layout>
            <div className="bg-cover bg-center relative" style={{ backgroundImage: `url(${banner})` }}>
                <div className="text-center text-white  py-60"></div>
            </div>
            <ChangePasswordModel />
        </Layout>
    )
}

export default ChangePassword