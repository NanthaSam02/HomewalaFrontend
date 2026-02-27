import React, { useRef, useEffect, useState } from 'react';
import { setIsModalOpen } from '../../features/BasicSlice';
import { useDispatch, useSelector } from 'react-redux';
import EnquiryImage from '../../assets/Enquiryimg.png';
import { IoMdClose } from "react-icons/io";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { TextField, Button } from '@mui/material';

// Define schema using Zod for validation
const enquirySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").max(50, "Name is too long"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
    message: z.string().min(10, "Message must be at least 10 characters long"),
});

const EnquiryModel = () => {
    const dispatch = useDispatch();
    const modalRef = useRef(null);
    const { isModalOpen } = useSelector(store => store.basic);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        trigger,
    } = useForm({
        resolver: zodResolver(enquirySchema),
        mode: 'onChange',
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await new Promise((res) => setTimeout(res, 2000));
            toast.success('Enquiry submitted successfully!');
            dispatch(setIsModalOpen(false));
            reset();
        } catch (error) {
            toast.error('Something went wrong!');
        }
        setLoading(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                dispatch(setIsModalOpen(false));
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
                dispatch(setIsModalOpen(false));
            }
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [dispatch]);

    return (
        <div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
                    <div ref={modalRef} className="bg-white rounded-lg shadow-lg flex w-[800px] min-h-[200px] relative transform transition-transform scale-95">
                        <div className="w-1/2 p-6 ">
                            <h2 className="text-2xl font-bold font-heading mb-2">Enquiry your Favorite</h2>
                            <p className="text-gray-500 mb-4 font-semibold">Property</p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    {...register("name")}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    onBlur={() => trigger("name")}
                                    className="mb-3"
                                />

                                <TextField
                                    label="Email ID"
                                    variant="outlined"
                                    fullWidth
                                    {...register("email")}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    onBlur={() => trigger("email")}
                                    className="mb-3"
                                />

                                <TextField
                                    label="Mobile Number"
                                    variant="outlined"
                                    fullWidth
                                    {...register("mobile")}
                                    error={!!errors.mobile}
                                    helperText={errors.mobile?.message}
                                    onBlur={() => trigger("mobile")}
                                    className="mb-3"
                                />

                                <TextField
                                    label="Message"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    {...register("message")}
                                    error={!!errors.message}
                                    helperText={errors.message?.message}
                                    onBlur={() => trigger("message")}
                                    className="mb-3"
                                />

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

                        <div className="w-1/2">
                            <img
                                src={EnquiryImage}
                                alt="Property"
                                className="h-full w-full object-cover rounded-r-lg clip-custom"
                            />
                        </div>

                        <button
                            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 rounded-full bg-[#535151F5] flex justify-center items-center"
                            onClick={() => dispatch(setIsModalOpen(false))}
                        >
                            <IoMdClose />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnquiryModel;
