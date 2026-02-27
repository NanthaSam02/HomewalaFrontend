import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Avatar } from "@mui/material";
import Layout from "./Layout";
import { AiFillEdit } from "react-icons/ai";
import { api } from "../axiosConfig";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  address: z.string().min(3, "Location must be at least 3 characters"),
  zip_code: z.string().min(6, "Pincode must be at least 6 characters"),
});

const ProfilePage = () => {
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const { user } = useSelector((store) => store.basic);

  useEffect(() => {
    // Fetch profile data when component mounts
    const fetchProfileData = async () => {
      try {
        const response = await api.get("/buyer/profile");
        if (response.data.status === "success") {
          setProfileData(response.data.data);
          // Set the profile image preview if available
          if (response.data.data.profile_image) {
            setProfileImagePreview(response.data.data.profile_image);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfileData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      zip_code: "",
    },
    mode: "onChange",
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profileData) {
      reset({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        zip_code: profileData.zip_code || "",
      });
    }
  }, [profileData, reset]);

  const firstNameValue = watch("first_name");

  const onSubmit = async (data) => {
    try {
      // Create a FormData object for multipart/form-data submission
      const formData = new FormData();

      // Append text data to FormData
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      // Append image file if available
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      // Log the FormData (for debugging)
      console.log("Submitting profile data with image");

      // Configure the request for multipart/form-data
      const response = await api.post("/buyer/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      console.log(response.data);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Store the actual file for form submission
      setProfileImageFile(file);

      // Create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);

      // Clean up the object URL when no longer needed
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8 w-full max-w-5xl my-5">
          <h2 className="text-center text-2xl font-bold mb-6">Profile</h2>

          <div className="flex justify-center mb-6 relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="profile-image-input"
            />
            <label
              htmlFor="profile-image-input"
              className="cursor-pointer relative"
            >
              <Avatar
                src={profileImagePreview || "https://via.placeholder.com/150"}
                alt="Profile"
                sx={{ width: 120, height: 120 }}
                className="border-8 border-gray-300"
              >
                {!profileImagePreview && firstNameValue
                  ? firstNameValue.charAt(0).toUpperCase()
                  : ""}
              </Avatar>
              <div
                className="absolute top-[-5px] right-[-9px] bg-blue-500 text-white p-2 rounded-full shadow-md"
                size="small"
                component="span"
              >
                <AiFillEdit size={20} />
              </div>
            </label>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              {...register("first_name")}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              InputLabelProps={{
                shrink: true
              }}
            />

            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              {...register("last_name")}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              InputLabelProps={{
                shrink: true
              }}
            />

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputLabelProps={{
                shrink: true
              }}
            />

            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              InputLabelProps={{
                shrink: true
              }}
            />

            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
              InputLabelProps={{
                shrink: true
              }}
            />

            <TextField
              label="Pincode"
              variant="outlined"
              fullWidth
              {...register("zip_code")}
              error={!!errors.zip_code}
              helperText={errors.zip_code?.message}
              InputLabelProps={{
                shrink: true
              }}
            />

            <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="px-10 w-full md:w-auto"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;























// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { TextField, Button, Avatar } from "@mui/material";
// import Layout from "./Layout";
// import { AiFillEdit } from "react-icons/ai";
// import { api } from "../axiosConfig";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";

// const profileSchema = z.object({
//   first_name: z.string().min(2, "First name must be at least 2 characters"),
//   last_name: z.string().min(2, "Last name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   phone: z
//     .string()
//     .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
//   address: z.string().min(3, "Location must be at least 3 characters"),
//   zip_code: z.string().min(6, "Pincode must be at least 6 characters"),
// });

// const ProfilePage = () => {
//   const [profileImage, setProfileImage] = useState(null);
//   const { user } = useSelector((store) => store.basic);
//   useEffect(() => {
//     console.log("user", user);
//   }, []);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm({
//     resolver: zodResolver(profileSchema),
//     defaultValues: user
//       ? {
//           first_name: user.first_name || "",
//           last_name: user.last_name || "",
//           email: user.email || "",
//           phone: user.phone || "",
//           address: user.address || "",
//           zip_code: user.zip_code || "",
//         }
//       : {},
//     mode: "onChange",
//   });

//   const firstNameValue = watch("firstName");

//   const onSubmit = async (data) => {
//     console.log("Profile data submitted:", { data, profileImage });

//     try {
//       const response = await api.post("/buyer/update-profile", {
//         ...data,
//         profileImage,
//       });
//       console.log(response.data);
//       toast.success(response.data.message);
//     } catch (error) {
//       console.error("Failed to fetch property details:", error);

//       toast.error(error.response.data.error);
//     }
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setProfileImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <Layout>
//       <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
//         <div className="bg-white shadow-md rounded-lg p-6 md:p-8 w-full max-w-5xl my-5">
//           <h2 className="text-center text-2xl font-bold mb-6">Profile</h2>

//           <div className="flex justify-center mb-6 relative">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="hidden"
//               id="profile-image-input"
//             />
//             <label
//               htmlFor="profile-image-input"
//               className="cursor-pointer relative"
//             >
//               <Avatar
//                 src={profileImage || "https://via.placeholder.com/150"}
//                 alt="Profile"
//                 sx={{ width: 120, height: 120 }}
//                 className="border-8 border-gray-300"
//               >
//                 {!profileImage && firstNameValue
//                   ? firstNameValue.charAt(0).toUpperCase()
//                   : ""}
//               </Avatar>
//               <div
//                 className="absolute top-[-5px] right-[-9px] bg-blue-500 text-white p-2 rounded-full shadow-md"
//                 size="small"
//                 component="span"
//               >
//                 <AiFillEdit size={20} />
//               </div>
//             </label>
//           </div>

//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="grid grid-cols-1 md:grid-cols-2 gap-6"
//           >
//             <TextField
//               label="First Name"
//               variant="outlined"
//               fullWidth
//               {...register("first_name")}
//               error={!!errors.first_name}
//               helperText={errors.first_name?.message}
//             />

//             <TextField
//               label="Last Name"
//               variant="outlined"
//               fullWidth
//               {...register("last_name")}
//               error={!!errors.last_name}
//               helperText={errors.last_name?.message}
//             />

//             <TextField
//               label="Email"
//               variant="outlined"
//               fullWidth
//               {...register("email")}
//               error={!!errors.email}
//               helperText={errors.email?.message}
//             />

//             <TextField
//               label="Phone Number"
//               variant="outlined"
//               fullWidth
//               {...register("phone")}
//               error={!!errors.phone}
//               helperText={errors.phone?.message}
//             />

//             <TextField
//               label="Location"
//               variant="outlined"
//               fullWidth
//               {...register("address")}
//               error={!!errors.address}
//               helperText={errors.address?.message}
//             />

//             <TextField
//               label="Pincode"
//               variant="outlined"
//               fullWidth
//               {...register("zip_code")}
//               error={!!errors.zip_code}
//               helperText={errors.zip_code?.message}
//             />

//             <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 className="px-10 w-full md:w-auto"
//               >
//                 Save
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ProfilePage;
