import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import propertyImage from "../../assets/propertyimg.png";
import Layout from '../Layout';
import { api } from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const postPropertySchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    terms: z.boolean().refine(val => val === true, { message: "You must accept the terms and privacy policy" })
});

const PostProperty = () => {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(postPropertySchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            message: '',
            terms: false,
        },
        mode: 'onChange',
    });


    const onSubmit = async (data) => {
        // Transform frontend keys to backend keys
        const transformedData = {
            first_name: data.firstName,  // Map frontend firstName to backend first_name
            last_name: data.lastName,    // Map lastName to last_name
            email: data.email,
            phone: data.phoneNumber,     // Map phoneNumber to phone
            details: data.message        // Map message to details
        };

        try {
            const response = await api.post('/register-vendor', transformedData);
            toast.success(response.data.status)

            console.log("Response:", response.data.status);
            navigate("/")

        } catch (error) {
            console.error("Error submitting form:", error.response?.data || error.message);

            // If there's a specific email error, display it
            if (error.response?.data?.errors?.email) {
                toast.error(error.response.data.errors.email[0]);
            }
            // If there's a general error message, display that instead
            else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            }
            // Fallback for any other errors
            else {
                toast.error("An error occurred. Please try again later.");
            }
        }
    };


    return (
        <Layout>
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white shadow-md rounded-lg flex flex-col md:flex-row w-full max-w-5xl">

                    {/* Form Section */}
                    <div className="w-full md:w-1/2 p-6 md:p-8">
                        <h2 className="text-2xl font-light font-heading text-center md:text-left">
                            Become a Partner of our <br />
                            <span className="font-bold font-heading">Builder group</span>
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <TextField
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                {...register("firstName")}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                {...register("lastName")}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
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
                                {...register("phoneNumber")}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber?.message}
                            />
                            <TextField
                                label="Why you Became a Builder Membership"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                {...register("message")}
                                error={!!errors.message}
                                helperText={errors.message?.message}
                                className="col-span-1 md:col-span-2"
                            />

                            <div className="col-span-1 md:col-span-2">
                                <FormControlLabel
                                    control={<Checkbox {...register("terms")} />}
                                    label={
                                        <span>
                                            I agree to all the{' '}
                                            <a href="#" className="text-blue-500">
                                                Terms and Privacy Policies
                                            </a>
                                        </span>
                                    }
                                />
                                {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}
                            </div>

                            <div className="col-span-1 md:col-span-2 flex justify-center">
                                <Button type="submit" variant="contained" color="primary" className="px-8 w-full md:w-auto">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Image Section */}
                    <div className="w-full md:w-1/2">
                        <img
                            src={propertyImage}
                            alt="Construction site"
                            className="h-64 md:h-full w-full object-cover rounded-b-lg md:rounded-r-lg md:rounded-b-none"
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PostProperty;
