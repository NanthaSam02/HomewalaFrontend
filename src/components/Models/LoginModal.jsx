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
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginImage from "../../assets/Enquiryimg.png";
import { api, setAccessToken } from "../../axiosConfig";

// Zod schema for validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});

const LoginModel = () => {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const { isModalOpen, isNavbarModalOpen } = useSelector(
    (store) => store.basic
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await api.post("/login", data);
      console.log("response", response.data);
      if (response.data.status === "success") {
        dispatch(setIsNavbarModalOpen(false));
        toast.success(response.data.message);
        console.log("access_token", response.data.data.token);
        localStorage.setItem("access_token", response.data.data.token);
        setAccessToken(response.data.data.token);
      }
    } catch (error) {
      console.log("Error response:", error.response?.data);

      // Handle the error format from the server
      if (error.response?.data) {
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          // If errors is an array, display the first error message
          toast.error(error.response.data.errors[0]);
        } else if (error.response.data.error) {
          // If there's a single error property
          toast.error(error.response.data.error);
        } else if (error.response.data.message) {
          // If there's a message property
          toast.error(error.response.data.message);
        } else {
          // Fallback
          toast.error("Login failed. Please check your credentials.");
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      // Always set loading to false, regardless of success or failure
      setLoading(false);
    }
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-lg flex w-[800px] min-h-[450px] relative transform transition-transform scale-95 form-modal-page"
        >
          <div className="w-1/2 p-8 form-left">
            <h2 className="text-2xl font-medium font-heading mb-2">Login</h2>
            <p className="text-gray-500 mb-6">
              Login to access your travelwise account
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

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                onBlur={() => trigger("password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <div className="flex justify-between items-center mt-2">
                <FormControlLabel control={<Checkbox />} label="Remember me" />
                <span
                  onClick={() =>
                    dispatch(setIsNavbarModalOpen("forgotpassword"))
                  }
                  className="text-red-500 text-sm cursor-pointer"
                >
                  Forgot Password?
                </span>
              </div>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="text-center mt-4">
              <p className="text-gray-600">
                Don't have an account?
                <span
                  onClick={() => {
                    dispatch(setIsNavbarModalOpen("signup"));
                  }}
                  className="text-red-500 cursor-pointer"
                >
                  {" "}
                  Sign up
                </span>
              </p>
            </div>

            {/* <div className="relative mt-6">
              <div className="absolute left-0 right-0 border-t border-gray-300 top-3"></div>
              <p className="text-center text-gray-500 relative bg-white px-2 w-fit mx-auto">
                Or login with
              </p>
            </div> */}

            {/* <div className="flex justify-center gap-4 mt-4">
              <Button
                variant="outlined"
                className="border-gray-300 rounded-lg px-8 py-2 flex items-center gap-2"
              >
                <FaFacebookF className="text-blue-500" />
              </Button>
              <Button
                variant="outlined"
                className="border-gray-300 rounded-lg px-8 py-2 flex items-center gap-2"
              >
                <FcGoogle />
              </Button>
              <Button
                variant="outlined"
                className="border-gray-300 rounded-lg px-8 py-2 flex items-center gap-2"
              >
                <FaApple />
              </Button>
            </div> */}
          </div>

          <div className="w-1/2 form-right">
            <img
              src={LoginImage}
              alt="Login"
              className="h-full w-full object-cover rounded-r-lg clip-custom"
            />
          </div>

          <button
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 rounded-full bg-[#535151F5] flex justify-center items-center"
            onClick={() => dispatch(setIsNavbarModalOpen(false))}
          >
            <IoMdClose />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModel;

























// import React, { useRef, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setIsModalOpen,
//   setIsNavbarModalOpen,
// } from "../../features/BasicSlice";
// import { IoMdClose } from "react-icons/io";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "react-toastify";
// import {
//   TextField,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   IconButton,
//   InputAdornment,
// } from "@mui/material";
// import { FaFacebookF, FaApple } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import LoginImage from "../../assets/Enquiryimg.png";
// import { api, setAccessToken } from "../../axiosConfig";

// // Zod schema for validation
// const loginSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters long")
//     .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//     .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//     .regex(/[0-9]/, "Password must contain at least one number")
//     .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
// });

// const LoginModel = () => {
//   const dispatch = useDispatch();
//   const modalRef = useRef(null);
//   const { isModalOpen, isNavbarModalOpen } = useSelector(
//     (store) => store.basic
//   );
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // React Hook Form setup
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     trigger,
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//     mode: "onChange",
//   });

//   const onSubmit = async (data) => {
//     setLoading(true);

//     try {
//       const response = await api.post("/login", data);
//       console.log("response", response.data);
//       if (response.data.status === "success") {
//         dispatch(setIsNavbarModalOpen(false));
//         toast.success(response.data.message);
//         console.log("access_token", response.data.data.token);
//         localStorage.setItem("access_token", response.data.data.token);
//         setAccessToken(response.data.data.token);
//       }
//     } catch (error) {
//       console.log(error.response.data.error);
//       toast.error(error.response.data.error);

//     }
//     // setLoading(false);
//   };

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         dispatch(setIsNavbarModalOpen(false));
//       }
//     };
//     if (isNavbarModalOpen) {
//       document.addEventListener("mousedown", handleOutsideClick);
//     } else {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, [isNavbarModalOpen, dispatch]);

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.key === "Escape") {
//         dispatch(setIsNavbarModalOpen(false));
//       }
//     };
//     document.addEventListener("keydown", handleKeyDown);
//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [dispatch]);

//   return (
//     <div>
//       {/* {isModalOpen && ( */}
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
//         <div
//           ref={modalRef}
//           className="bg-white rounded-lg shadow-lg flex w-[800px] min-h-[450px] relative transform transition-transform scale-95 form-modal-page"
//         >
//           <div className="w-1/2 p-8 form-left">
//             <h2 className="text-2xl font-medium font-heading mb-2">Login</h2>
//             <p className="text-gray-500 mb-6">
//               Login to access your travelwise account
//             </p>

//             <form onSubmit={handleSubmit(onSubmit)}className="space-y-4">
//               <TextField
//                 label="Email"
//                 variant="outlined"
//                 fullWidth
//                 {...register("email")}
//                 error={!!errors.email}
//                 helperText={errors.email?.message}
//                 onBlur={() => trigger("email")}
//               />

//               <TextField
//                 label="Password"
//                 type={showPassword ? "text" : "password"}
//                 variant="outlined"
//                 fullWidth
//                 {...register("password")}
//                 error={!!errors.password}
//                 helperText={errors.password?.message}
//                 onBlur={() => trigger("password")}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               <div className="flex justify-between items-center mt-2">
//                 <FormControlLabel control={<Checkbox />} label="Remember me" />
//                 <span
//                   onClick={() =>
//                     dispatch(setIsNavbarModalOpen("forgotpassword"))
//                   }
//                   className="text-red-500 text-sm cursor-pointer"
//                 >
//                   Forgot Password?
//                 </span>
//               </div>

//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 disabled={loading}
//               >
//                 {loading ? "Logging in..." : "Login"}
//               </Button>
//             </form>

//             <div className="text-center mt-4">
//               <p className="text-gray-600">
//                 Don't have an account?
//                 <span
//                   onClick={() => {
//                     dispatch(setIsNavbarModalOpen("signup"));
//                   }}
//                   className="text-red-500 cursor-pointer"
//                 >
//                   {" "}
//                   Sign up
//                 </span>
//               </p>
//             </div>

//             <div className="relative mt-6">
//               <div className="absolute left-0 right-0 border-t border-gray-300 top-3"></div>
//               <p className="text-center text-gray-500 relative bg-white px-2 w-fit mx-auto">
//                 Or login with
//               </p>
//             </div>

//             <div className="flex justify-center gap-4 mt-4">
//               <Button
//                 variant="outlined"
//                 className="border-gray-300 rounded-lg px-8 py-2 flex items-center gap-2"
//               >
//                 <FaFacebookF className="text-blue-500" />
//               </Button>
//               <Button
//                 variant="outlined"
//                 className="border-gray-300 rounded-lg px-8 py-2 flex items-center gap-2"
//               >
//                 <FcGoogle />
//               </Button>
//               <Button
//                 variant="outlined"
//                 className="border-gray-300 rounded-lg px-8 py-2 flex items-center gap-2"
//               >
//                 <FaApple />
//               </Button>
//             </div>
//           </div>

//           <div className="w-1/2 form-right">
//             <img
//               src={LoginImage}
//               alt="Login"
//               className="h-full w-full object-cover rounded-r-lg clip-custom"
//             />
//           </div>

//           <button
//             className="absolute top-4 right-4 text-white text-2xl w-10 h-10 rounded-full bg-[#535151F5] flex justify-center items-center"
//             onClick={() => dispatch(setIsNavbarModalOpen(false))}
//           >
//             <IoMdClose />
//           </button>
//         </div>
//       </div>
//       {/* )} */}
//     </div>
//   );
// };

// export default LoginModel;
