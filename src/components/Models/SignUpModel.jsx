import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpen, setIsNavbarModalOpen, setUser } from '../../features/BasicSlice';
import { IoMdClose } from "react-icons/io";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { TextField, Button, Checkbox, FormControlLabel, IconButton, InputAdornment } from '@mui/material';
import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SignupImage from '../../assets/Signupimg.png';
import { api } from '../../axiosConfig';

// Zod schema for validation
const signupSchema = z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    // password: z.string()
    //     .min(8, "Password must be at least 8 characters")
    //     .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    //     .regex(/[a-z]/, "Must contain at least one lowercase letter")
    //     .regex(/[0-9]/, "Must contain at least one number")
    //     .regex(/[@$!%*?&]/, "Must contain at least one special character"),
    // confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, { message: "You must accept terms and privacy policies" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const SignUpModel = () => {

    const dispatch = useDispatch();
    const modalRef = useRef(null);
    const { isModalOpen, isNavbarModalOpen, user } = useSelector(store => store.basic);
    const [loading, setLoading] = useState(false);
    // const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data) => {
        setLoading(true);
        console.log(data);
        try {
            const response = await api.post('/register-user', data);
            if (response.data.status === "success") {
                const update = { ...user, email: data.email };
                console.log('update', update);
                dispatch(setIsNavbarModalOpen('Verify'));
                dispatch(setUser({ ...user, email: data.email }));
                toast.success(response.data.data.otp_test);
                console.log('response', response.data);
            }
        } catch (error) {
            console.log('Error response:', error.response?.data);

            // Handle the new error format
            if (error.response?.data?.status === "error" && error.response?.data?.errors) {
                // If errors is an array, display the first error message
                if (Array.isArray(error.response.data.errors)) {
                    toast.error(error.response.data.errors[0]);
                }
                // If errors is an object with nested arrays (your original format)
                else if (typeof error.response.data.errors === 'object') {
                    const firstErrorKey = Object.keys(error.response.data.errors)[0];
                    const firstError = error.response.data.errors[firstErrorKey][0];
                    toast.error(firstError);
                }
                // Fallback error message
                else {
                    toast.error('Registration failed. Please try again.');
                }
            } else {
                toast.error('An error occurred during registration. Please try again.');
            }
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
                <div ref={modalRef} className="top-10 bg-white rounded-lg shadow-lg flex w-[900px] min-h-[450px] relative transform transition-transform scale-95 form-modal-page">
                    <div className="w-1/2 p-8 overflow-y-auto max-h-screen form-left">
                        <h2 className="text-2xl font-medium font-heading mb-2">Sign up</h2>
                        <p className="text-gray-500 mb-6">Let's get you all set up so you can access your personal account.</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    fullWidth
                                    {...register("first_name")}
                                    error={!!errors.first_name}
                                    helperText={errors.first_name?.message}
                                />
                                <TextField
                                    label="Last Name"
                                    variant="outlined"
                                    fullWidth
                                    {...register("last_name")}
                                    error={!!errors.last_name}
                                    helperText={errors.last_name?.message}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    {...register("email")}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                                <TextField
                                    label="Phone Number"
                                    variant="outlined"
                                    fullWidth
                                    {...register("phone")}
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                />
                            </div>

                            <FormControlLabel
                                control={<Checkbox {...register("terms")} />}
                                label={<span>I agree to all the <a href="#" className="text-red-500">Terms</a> and <a href="#" className="text-red-500">Privacy Policies</a></span>}
                            />
                            {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create account'}
                            </Button>
                        </form>

                        <div className="text-center mt-4">
                            <p className="text-gray-600">
                                Already have an account?
                                <span onClick={() => dispatch(setIsNavbarModalOpen('login'))} className="text-red-500 cursor-pointer"> Login</span>
                            </p>
                        </div>
                        {/* <div className="relative mt-6">
                            <div className="absolute left-0 right-0 border-t border-gray-300 top-3"></div>
                            <p className="text-center text-gray-500 relative bg-white px-2 w-fit mx-auto">Or login with</p>
                        </div> */}
                        {/* <div className="flex justify-center gap-4 mt-6">
                            <Button variant="outlined"><FaFacebookF className="text-blue-500" /></Button>
                            <Button variant="outlined"><FcGoogle /></Button>
                            <Button variant="outlined"><FaApple /></Button>
                        </div> */}
                    </div>

                    <div className="w-1/2 form-right">
                        <img src={SignupImage} alt="Signup" className="h-full w-full object-cover rounded-r-lg clip-custom" />
                    </div>

                    <button className="absolute top-4 right-4 text-white text-2xl w-10 h-10 rounded-full bg-[#535151F5] flex justify-center items-center" onClick={() => dispatch(setIsNavbarModalOpen(false))}>
                        <IoMdClose />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpModel;



























// import React, { useRef, useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setIsModalOpen ,setIsNavbarModalOpen ,setUser } from '../../features/BasicSlice';
// import { IoMdClose } from "react-icons/io";
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'react-toastify';
// import { TextField, Button, Checkbox, FormControlLabel, IconButton, InputAdornment } from '@mui/material';
// import { FaFacebookF, FaApple } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import SignupImage from '../../assets/Signupimg.png';
// import { api } from '../../axiosConfig';
// // Zod schema for validation
// const signupSchema = z.object({
//     first_name: z.string().min(2, "First name must be at least 2 characters"),
//     last_name: z.string().min(2, "Last name must be at least 2 characters"),
//     email: z.string().email("Invalid email address"),
//     phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
//     // password: z.string()
//     //     .min(8, "Password must be at least 8 characters")
//     //     .regex(/[A-Z]/, "Must contain at least one uppercase letter")
//     //     .regex(/[a-z]/, "Must contain at least one lowercase letter")
//     //     .regex(/[0-9]/, "Must contain at least one number")
//     //     .regex(/[@$!%*?&]/, "Must contain at least one special character"),
//     // confirmPassword: z.string(),
//     terms: z.boolean().refine(val => val === true, { message: "You must accept terms and privacy policies" })
// }).refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
// });

// const SignUpModel = () => {
    
//     const dispatch = useDispatch();
//     const modalRef = useRef(null);
//     const { isModalOpen ,isNavbarModalOpen ,user} = useSelector(store => store.basic);
//     const [loading, setLoading] = useState(false);
//     // const [showPassword, setShowPassword] = useState(false);
//     // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     // React Hook Form setup
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         trigger,
//     } = useForm({
//         resolver: zodResolver(signupSchema),
//         mode: 'onChange',
//     });

//     const onSubmit = async (data) => {
//         setLoading(true);
//         console.log(data)
//         try {
//             const response =await api.post('/register-user',data)
//             if(response.data.status === "success"){
//                 const update = { ...user, email: data.email };
//                 console.log('update',update)
//                 dispatch(setIsNavbarModalOpen('Verify'))
//                 dispatch(setUser({...user, email: data.email })); 
//                 toast.success(response.data.data.otp_test);
//                 // toast.success('Signup successful!');
//                 console.log('response',response.data)
//             }
//         } catch (error) {
//             console.log(error.response.data.errors.email)
//             toast.error(error.response.data.errors.email[0]);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         const handleOutsideClick = (event) => {
//             if (modalRef.current && !modalRef.current.contains(event.target)) {
//                 dispatch(setIsNavbarModalOpen(false));
//             }
//         };
//         if (isNavbarModalOpen) {
//             document.addEventListener("mousedown", handleOutsideClick);
//         } else {
//             document.removeEventListener("mousedown", handleOutsideClick);
//         }
//         return () => {
//             document.removeEventListener("mousedown", handleOutsideClick);
//         };
//     }, [isNavbarModalOpen, dispatch]);

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
//             {/* {isModalOpen && ( */}
//             <div className="fixed  inset-0  bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
//                 <div ref={modalRef} className="top-10 bg-white rounded-lg shadow-lg flex w-[900px] min-h-[450px] relative transform transition-transform scale-95 form-modal-page">
//                     <div className="w-1/2 p-8 overflow-y-auto max-h-screen form-left">
//                         <h2 className="text-2xl font-medium font-heading mb-2">Sign up</h2>
//                         <p className="text-gray-500 mb-6">Let's get you all set up so you can access your personal account.</p>

//                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <TextField
//                                     label="First Name"
//                                     variant="outlined"
//                                     fullWidth
//                                     {...register("first_name")}
//                                     error={!!errors.first_name}
//                                     helperText={errors.first_name?.message}
//                                 />
//                                 <TextField
//                                     label="Last Name"
//                                     variant="outlined"
//                                     fullWidth
//                                     {...register("last_name")}
//                                     error={!!errors.last_name}
//                                     helperText={errors.last_name?.message}
//                                 />
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <TextField
//                                     label="Email"
//                                     variant="outlined"
//                                     fullWidth
//                                     {...register("email")}
//                                     error={!!errors.email}
//                                     helperText={errors.email?.message}
//                                 />
//                                 <TextField
//                                     label="Phone Number"
//                                     variant="outlined"
//                                     fullWidth
//                                     {...register("phone")}
//                                     error={!!errors.phone}
//                                     helperText={errors.phone?.message}
//                                 />
//                             </div>

//                             {/* <TextField
//                                 label="Password"
//                                 type={showPassword ? "text" : "password"}
//                                 variant="outlined"
//                                 fullWidth
//                                 {...register("password")}
//                                 error={!!errors.password}
//                                 helperText={errors.password?.message}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton onClick={() => setShowPassword(!showPassword)}>
//                                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     )
//                                 }}
//                             /> */}

//                             {/* <TextField
//                                 label="Confirm Password"
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 variant="outlined"
//                                 fullWidth
//                                 {...register("confirmPassword")}
//                                 error={!!errors.confirmPassword}
//                                 helperText={errors.confirmPassword?.message}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                                                 {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     )
//                                 }}
//                             /> */}

//                             <FormControlLabel
//                                 control={<Checkbox {...register("terms")} />}
//                                 label={<span>I agree to all the <a href="#" className="text-red-500">Terms</a> and <a href="#" className="text-red-500">Privacy Policies</a></span>}
//                             />
//                             {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}

//                             <Button
//                                 type="submit"
//                                 variant="contained"
//                                 color="primary"
//                                 fullWidth
//                                 disabled={loading}
                          
//                             >
//                                 {loading ? 'Creating Account...' : 'Create account'}
//                             </Button>
//                         </form>

//                         <div className="text-center mt-4">
//                             <p className="text-gray-600">
//                                 Already have an account?
//                                 <span onClick={()=>dispatch(setIsNavbarModalOpen('login'))} className="text-red-500 cursor-pointer"> Login</span>
//                             </p>
//                         </div>
//                         <div className="relative mt-6">
//                             <div className="absolute left-0 right-0 border-t border-gray-300 top-3"></div>
//                             <p className="text-center text-gray-500 relative bg-white px-2 w-fit mx-auto">Or login with</p>
//                         </div>
//                         <div className="flex justify-center gap-4 mt-6">
//                             <Button variant="outlined"><FaFacebookF className="text-blue-500" /></Button>
//                             <Button variant="outlined"><FcGoogle /></Button>
//                             <Button variant="outlined"><FaApple /></Button>
//                         </div>
//                     </div>

//                     <div className="w-1/2 form-right">
//                         <img src={SignupImage} alt="Signup" className="h-full w-full object-cover rounded-r-lg clip-custom" />
//                     </div>

//                     <button className="absolute top-4 right-4 text-white text-2xl w-10 h-10 rounded-full bg-[#535151F5] flex justify-center items-center" onClick={() => dispatch(setIsNavbarModalOpen(false))}>
//                         <IoMdClose />
//                     </button>
//                 </div>
//             </div>
//             {/* )} */}
//         </div>
//     );
// };

// export default SignUpModel;
