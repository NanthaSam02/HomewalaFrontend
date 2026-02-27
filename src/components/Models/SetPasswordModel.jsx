import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpen , setIsNavbarModalOpen} from '../../features/BasicSlice';
import { IoMdClose } from "react-icons/io";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SetPasswordImage from '../../assets/SetPassword.png';
import { api } from '../../axiosConfig';

// Define schema using Zod for validation
const setPasswordSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
        confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

const SetPasswordModel = () => {
    const dispatch = useDispatch();
    const modalRef = useRef(null);
    const { isModalOpen,user } = useSelector(store => store.basic);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        trigger,
    } = useForm({
        resolver: zodResolver(setPasswordSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response =await api.post('/reset-password',{...data,email:user.email});
            console.log(response.data)
            toast.success('Password updated successfully!');
            dispatch(setIsNavbarModalOpen(false));
            reset();
        } catch (error) {
            console.log(error.response.data.errors)
            toast.error('Something went wrong!');
        }
        setLoading(false);
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
            {/* {isModalOpen && ( */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
                <div ref={modalRef} className="bg-white rounded-lg shadow-lg flex w-[800px] min-h-[400px] relative transform transition-transform scale-95">
                    <div className="md:w-1/2 p-8">
                        <h2 className="text-2xl font-bold mb-2 font-heading">Set a password</h2>
                        <p className="text-gray-500 mb-6">
                            Your previous password has been reset. Please set a new password for your account.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <TextField
                                label="Create Password"
                                variant="outlined"
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                onBlur={() => trigger("password")}
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

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Setting Password...' : 'Set password'}
                            </Button>
                        </form>
                    </div>

                    <div className="md:w-1/2 md:flex hidden">
                        <img
                            src={SetPasswordImage}
                            alt="Set Password"
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

export default SetPasswordModel;
