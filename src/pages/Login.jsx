import React from 'react'
import Layout from '../components/Layout'
import LoginModel from '../components/Models/LoginModal'
import banner from '../assets/banner.jpg';

const Login = () => {
    return (
        <Layout>
            <div className="bg-cover bg-center relative" style={{ backgroundImage: `url(${banner})` }}>
                <div className="text-center text-white  py-60"></div>
            </div>
            <LoginModel />
        </Layout>
    )
}

export default Login