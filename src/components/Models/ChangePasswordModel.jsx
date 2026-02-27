import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpen, setIsNavbarModalOpen } from '../../features/BasicSlice';
import { IoMdClose } from "react-icons/io";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ChangePasswordImage from '../../assets/ForgotPassword.png';
import { api } from '../../axiosConfig';
import {
    FaFacebookF,
    FaApple,
    FaArrowLeft,
    FaChevronLeft,
  } from "react-icons/fa";
// Define schema using Zod for validation
const changePasswordSchema = z.object({
    old_password: z.string().min(8, "Old Password must be at least 8 characters long"),
    new_password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
    confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

const ChangePasswordModel = () => {
    const dispatch = useDispatch();
    const modalRef = useRef(null);
    const { isModalOpen } = useSelector(store => store.basic);
    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        trigger,
    } = useForm({
        resolver: zodResolver(changePasswordSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const response = await api.post('/buyer/change-password', data);
            console.log('response', response.data);
            if (response.data.status === "success") {
                dispatch(setIsNavbarModalOpen(false));
                toast.success(response.data.message || "Password changed successfully!");
            }
        } catch (error) {
            console.log('Error response:', error.response?.data);

            // Handle error response
            if (error.response?.data) {
                if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    // If errors is an array, display the first error message
                    toast.error(error.response.data.errors[0]);
                } else if (error.response.data.message) {
                    // If there's a message property
                    toast.error(error.response.data.message);
                } else {
                    // Fallback
                    toast.error("Failed to change password. Please try again.");
                }
            } else {
                toast.error("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                dispatch(setIsNavbarModalOpen(false));
            }
        };

        if (isModalOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isModalOpen, dispatch]);

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
                <div ref={modalRef} className="bg-white rounded-lg shadow-lg flex w-[800px] min-h-[400px] relative transform transition-transform scale-95">
                    <div className="md:w-1/2 p-8">
                        <button
                            className="text-sm text-gray-500 mb-4 cursor-pointer flex gap-2"
                            onClick={() => dispatch(setIsNavbarModalOpen('login'))}
                        >
                                      <FaChevronLeft size={15} />Back to login
                        </button>
                        <h2 className="text-2xl font-bold mb-2 font-heading">Change password?</h2>
                        <p className="text-gray-500 mb-6">Don't worry, happens to all of us. Enter your old password below to change your password.</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                            {/* Old Password Field */}
                            <TextField
                                label="Old Password"
                                variant="outlined"
                                fullWidth
                                type={showOldPassword ? "text" : "password"}
                                {...register("old_password")}
                                error={!!errors.old_password}
                                helperText={errors.old_password?.message}
                                onBlur={() => trigger("old_password")}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
                                                {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {/* New Password Field */}
                            <TextField
                                label="Create Password"
                                variant="outlined"
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                {...register("new_password")}
                                error={!!errors.new_password}
                                helperText={errors.new_password?.message}
                                onBlur={() => trigger("new_password")}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {/* Confirm Password Field */}
                            <TextField
                                label="Re-enter Password"
                                variant="outlined"
                                fullWidth
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirm_password")}
                                error={!!errors.confirm_password}
                                helperText={errors.confirm_password?.message}
                                onBlur={() => trigger("confirm_password")}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </form>
                    </div>

                    <div className="md:w-1/2 md:flex hidden">
                        <img
                            src={ChangePasswordImage}
                            alt="Change Password"
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
        </div>
    );
};

export default ChangePasswordModel;


























// import React, { useRef, useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setIsModalOpen , setIsNavbarModalOpen } from '../../features/BasicSlice';
// import { IoMdClose } from "react-icons/io";
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'react-toastify';
// import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import ChangePasswordImage from '../../assets/ForgotPassword.png';
// import { api } from '../../axiosConfig';

// // Define schema using Zod for validation
// const changePasswordSchema = z.object({
//     old_password: z.string().min(8, "Old Password must be at least 8 characters long"),
//     password: z.string()
//         .min(8, "Password must be at least 8 characters long")
//         .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
//         .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//         .regex(/[0-9]/, "Password must contain at least one number")
//         .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
//     confirm_password: z.string()
// }).refine((data) => data.password === data.confirm_password, {
//     message: "Passwords do not match",
//     path: ["confirm_password"],
// });

// const ChangePasswordModel = () => {
//     const dispatch = useDispatch();
//     const modalRef = useRef(null);
//     const { isModalOpen } = useSelector(store => store.basic);
//     const [loading, setLoading] = useState(false);
//     const [showOldPassword, setShowOldPassword] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         reset,
//         trigger,
//     } = useForm({
//         resolver: zodResolver(changePasswordSchema),
//         mode: 'onChange',
//     });

//     const onSubmit = async (data) => {
//         setLoading(true);
    
//         try {
//             const response = await api.post('/buyer/change-password', data);
//             console.log('response', response.data);
//             if (response.data === "Login Successful") {
//                 // dispatch(setIsNavbarModalOpen(false));
//                 // toast.success(response.data.message);
//                 // localStorage.setItem('auth', response.data.token);
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         const handleOutsideClick = (event) => {
//             if (modalRef.current && !modalRef.current.contains(event.target)) {
//                 dispatch(setIsNavbarModalOpen(false));
//             }
//         };

//         if (isModalOpen) {
//             document.addEventListener("mousedown", handleOutsideClick);
//         } else {
//             document.removeEventListener("mousedown", handleOutsideClick);
//         }

//         return () => {
//             document.removeEventListener("mousedown", handleOutsideClick);
//         };
//     }, [isModalOpen, dispatch]);

//     useEffect(() => {
//         const handleKeyDown = (event) => {
//             if (event.key === "Escape") {
//                 dispatch(setIsNavbarModalOpen(false));
//             }
//         };
//         document.addEventListener("keydown", handleKeyDown);

//         return () => {
//             document.removeEventListener("keydown", handleKeyDown);
//         };
//     }, [dispatch]);

//     return (
//         <div>
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
//                 <div ref={modalRef} className="bg-white rounded-lg shadow-lg flex w-[800px] min-h-[400px] relative transform transition-transform scale-95">
//                     <div className="md:w-1/2 p-8">
//                         <button
//                             className="text-sm text-gray-500 mb-4 cursor-pointer"
//                             onClick={() => dispatch(setIsNavbarModalOpen('login'))}
//                         >
//                             &lt; Back to login
//                         </button>
//                         <h2 className="text-2xl font-bold mb-2 font-heading">Change password?</h2>
//                         <p className="text-gray-500 mb-6">Don't worry, happens to all of us. Enter your old password below to change your password.</p>

//                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            
//                             {/* Old Password Field */}
//                             <TextField
//                                 label="Old Password"
//                                 variant="outlined"
//                                 fullWidth
//                                 type={showOldPassword ? "text" : "password"}
//                                 {...register("old_password")}
//                                 error={!!errors.old_password}
//                                 helperText={errors.old_password?.message}
//                                 onBlur={() => trigger("old_password")}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
//                                                 {showOldPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     )
//                                 }}
//                             />

//                             {/* New Password Field */}
//                             <TextField
//                                 label="Create Password"
//                                 variant="outlined"
//                                 fullWidth
//                                 type={showPassword ? "text" : "password"}
//                                 {...register("password")}
//                                 error={!!errors.password}
//                                 helperText={errors.password?.message}
//                                 onBlur={() => trigger("password")}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton onClick={() => setShowPassword(!showPassword)}>
//                                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     )
//                                 }}
//                             />

//                             {/* Confirm Password Field */}
//                             <TextField
//                                 label="Re-enter Password"
//                                 variant="outlined"
//                                 fullWidth
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 {...register("confirm_password")}
//                                 error={!!errors.confirm_password}
//                                 helperText={errors.confirm_password?.message}
//                                 onBlur={() => trigger("confirm_password")}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                                                 {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     )
//                                 }}
//                             />

//                             {/* Submit Button */}
//                             <Button
//                                 type="submit"
//                                 variant="contained"
//                                 color="primary"
//                                 fullWidth
//                                 disabled={loading}
//                             >
//                                 {loading ? 'Submitting...' : 'Submit'}
//                             </Button>
//                         </form>
//                     </div>

//                     <div className="md:w-1/2 md:flex hidden">
//                         <img
//                             src={ChangePasswordImage}
//                             alt="Change Password"
//                             className="h-full w-full object-cover rounded-r-lg p-10"
//                         />
//                     </div>

//                     <button
//                         className="absolute top-4 right-4 text-gray-500 text-2xl"
//                         onClick={() => dispatch(setIsNavbarModalOpen(false))}
//                     >
//                         <IoMdClose />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChangePasswordModel;
