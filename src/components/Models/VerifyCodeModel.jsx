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
import VerifyCodeImage from '../../assets/VerifyCode.png';
import { api } from '../../axiosConfig';
import { FaChevronLeft } from "react-icons/fa";

// Define schema using Zod for validation
const verifyCodeSchema = z.object({
    otp_code: z.string()
});

const VerifyCodeModel = () => {
    const dispatch = useDispatch();
    const modalRef = useRef(null);
    const { isModalOpen, isNavbarModalOpen, user } = useSelector(store => store.basic);
    const [loading, setLoading] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);

    const resendOTP = async () => {
        if (resendDisabled) return;

        try {
            const response = await api.post('resend-otp', { 'email': user.email });
            console.log('resend', response.data.message);
            toast.success(response.data.message);

            // Disable resend button and start countdown
            setResendDisabled(true);
            setCountdown(30);

            const timer = setInterval(() => {
                setCountdown(prevCount => {
                    if (prevCount <= 1) {
                        clearInterval(timer);
                        setResendDisabled(false);
                        return 0;
                    }
                    return prevCount - 1;
                });
            }, 1000);

            // Cleanup timer
            return () => clearInterval(timer);
        } catch (error) {
            console.log('error', error);
            toast.error('Failed to resend code. Please try again.');
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        trigger,
    } = useForm({
        resolver: zodResolver(verifyCodeSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data) => {
        console.log(data);
        setLoading(true);
        const update = { ...data, email: user.email };
        console.log('update', update);
        try {
            const response = await api.post('/verify-otp', update);
            toast.success('Verification successful!');
            dispatch(setIsNavbarModalOpen("setpassword"));
            reset();
            console.log(response.data);
        } catch (error) {
            toast.error(error.response.data.errors[0]);
            console.log(error.response.data.errors);
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
                <div ref={modalRef} className="bg-white rounded-lg shadow-lg flex w-[800px] min-h-[400px] relative transform transition-transform scale-95">
                    <div className="md:w-1/2 p-8">
                        <button
                            className="text-sm text-gray-500 mb-4 cursor-pointer flex gap-2"
                            onClick={() => dispatch(setIsNavbarModalOpen('login'))}
                        >
                            <FaChevronLeft size={15} />
                            Back to login
                        </button>
                        <h2 className="text-2xl font-bold mb-2 font-heading">Verify code</h2>
                        <p className="text-gray-500 mb-6">An authentication code has been sent to your email.</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <TextField
                                label="Enter Code"
                                variant="outlined"
                                fullWidth
                                type={showCode ? "text" : "password"}
                                {...register("otp_code")}
                                error={!!errors.code}
                                helperText={errors.otp_code?.message}
                                onBlur={() => trigger("otp_code")}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowCode(!showCode)}>
                                                {showCode ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <div className="text-left text-sm">
                                <span>Didn't receive a code? </span>
                                {resendDisabled ? (
                                    <span className="text-gray-400">Resend in {countdown}s</span>
                                ) : (
                                    <span onClick={resendOTP} className="text-red-500 cursor-pointer">Resend</span>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Verify'}
                            </Button>
                        </form>
                    </div>

                    <div className="md:w-1/2 md:flex hidden">
                        <img
                            src={VerifyCodeImage}
                            alt="Verify Code"
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

export default VerifyCodeModel;