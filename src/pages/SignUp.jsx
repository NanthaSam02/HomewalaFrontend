import React from "react";
import Layout from "../components/Layout";
import banner from "../assets/banner.jpg";
import SignUpModel from "../components/Models/SignUpModel";

const SignUp = () => {
  return (
    <Layout>
      <div
        className="bg-cover bg-center relative"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="text-center text-white  py-60"></div>
      </div>
      <div className=" overflow-y-scroll ">
        <SignUpModel />
      </div>
    </Layout>
  );
};

export default SignUp;
