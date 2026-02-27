import Navbar from "./Navbar";
import Footer from "./Footer";
import LoginModel from "./Models/LoginModal";
import SignUpModel from "./Models/SignUpModel";
import ForgotPasswordModel from "./Models/ForgotPasswordModel";
import VerifyCodeModel from "./Models/VerifyCodeModel";
import SetPasswordModel from "./Models/SetPasswordModel";
import ChangePasswordModel from "./Models/ChangePasswordModel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { api } from "../axiosConfig";
import { setPropertiesList, setUser } from "../features/BasicSlice";
import FooterLayout from "./FooterLayout";
const Layout = ({ children }) => {
  const { isNavbarModalOpen, filter } = useSelector((store) => store.basic);
  const dispatch = useDispatch();
  const auth = localStorage.getItem("access_token");
  // const SearchFetch = async () => {
  //   try {
  //     const response = await api.post(
  //       `get-filtered-listview-properties`,
  //       filter
  //     );
  //     dispatch(setPropertiesList(response.data));
  //   } catch (error) {
  //     console.error("Failed to fetch property details:", error);
  //   }
  // };
  const authFetch = async () => {
    try {
      const response = await api.get("/buyer/profile");
      dispatch(setUser(response.data.data));
    } catch (error) {
      console.error("Failed to fetch property details:", error);
    }
  };
  useEffect(() => {
    // SearchFetch();
    if (auth) {
      authFetch();
    }
  }, []);

  return (
    <>
      <div className="z-50">
        <Navbar />
      </div>
      {/* Remove overflow-x-hidden and add relative to allow sticky children */}
      <div className="min-h-screen flex flex-col relative page-content">
        <main className=" relative">{children}</main>
        <Footer />
        {/* <FooterLayout /> */}
      </div>
      {isNavbarModalOpen === "login" ? (
        <LoginModel />
      ) : isNavbarModalOpen === "signup" ? (
        <SignUpModel />
      ) : isNavbarModalOpen === "forgotpassword" ? (
        <ForgotPasswordModel />
      ) : isNavbarModalOpen === "Verify" ? (
        <VerifyCodeModel />
      ) : isNavbarModalOpen === "setpassword" ? (
        <SetPasswordModel />
      ) : isNavbarModalOpen === "changepassword" ? (
        <ChangePasswordModel />
      ) : null}
    </>
  );
};

export default Layout;
