import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsModalOpen,
  setIsNavbarModalOpen,
} from "../../features/BasicSlice";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { TextField, Button } from "@mui/material";
import {
  FaFacebookF,
  FaApple,
  FaArrowLeft,
  FaChevronLeft,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import ForgotPasswordImage from "../../assets/ForgotPassword.png";
import { api } from "../../axiosConfig";

// Define schema using Zod for validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPasswordModel = () => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const { isModalOpen, isNavbarModalOpen } = useSelector(
    (store) => store.basic
  );
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/forgot-password", data);

      toast.success(response.data.data.otp);
      console.log(response.data);
      dispatch(setIsNavbarModalOpen("Verify"));
      reset();
    } catch (error) {
      toast.error(error.response.data.errors[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        dispatch(setIsNavbarModalOpen(false));
      }
    };

    if (isNavbarModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isNavbarModalOpen, dispatch]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        dispatch(setIsNavbarModalOpen(false));
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  return (
    <div>
      {/* {isModalOpen && ( */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-lg flex w-[800px] min-h-[400px] relative transform transition-transform scale-95 form-modal-page"
        >
          <div className="w-1/2 p-8 form-left">
            <button
              className="text-sm text-gray-500 mb-4 cursor-pointer flex items-center justify-center gap-2"
              onClick={() => dispatch(setIsNavbarModalOpen("login"))}
            >
              <FaChevronLeft size={15} />
              Back to login
            </button>
            <h2 className="text-2xl font-bold mb-2 font-heading">
              Forgot your password?
            </h2>
            <p className="text-gray-500 mb-6">
              Don't worry, happens to all of us. Enter your email below to
              recover your password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                onBlur={() => trigger("email")}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>

            <div className="text-center mt-6 relative">
              <div className="absolute left-0 right-0 border-t border-gray-300 top-3"></div>
              <p className="text-center text-gray-500 relative bg-white px-2 w-fit mx-auto">
                Or login with
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outlined">
                <FaFacebookF className="text-blue-500" />
              </Button>
              <Button variant="outlined">
                <FcGoogle />
              </Button>
              <Button variant="outlined">
                <FaApple />
              </Button>
            </div>
          </div>

          <div className=" form-right md:w-1/2 md:flex hidden">
            <img
              src={ForgotPasswordImage}
              alt="Forgot Password"
              className="h-full w-full object-cover rounded-r-lg p-10"
            />
          </div>

          <button
            className="absolute top-4 right-4 text-gray-500 text-2xl"
            onClick={() => dispatch(setIsNavbarModalOpen(false))}
          >
            <IoMdClose />
          </button>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default ForgotPasswordModel;
