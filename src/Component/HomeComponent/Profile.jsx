import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const ProfilePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className=" bg-gray-100 p-4 flex flex-col lg:flex-row gap-6 py-10 px-4 md:px-10">
      {/* Sidebar */}
      <div className="bg-[#1e3473] text-white w-full h-auto lg:w-[30%] p-10 rounded-3xl shadow-md">
        <h2 className="text-2xl md:text-[49.5px] font-semibold mb-6">My Profile</h2>
        <ul className="space-y-2 text-[24px] font-medium">
          <li className="text-[#F7941D] text-[26px]">Account Details</li>
          <li>Orders</li>
          <li>Track Your Order</li>
          <li>Addresses</li>
          <li>My Favorites</li>
          <li>Loyalty</li>
        </ul>
        <hr className="my-6 border-gray-400" />
        <button className="text-white text-[26px] hover:text-[#F7941D]">Logout</button>
      </div>

      {/* Profile Details */}
      <div className="bg-[#F8F8FA] flex-1 p-4 lg:p-8 rounded-3xl shadow-md">
        <h3 className="text-xl md:text-[32px] text-center lg:text-left font-semibold mb-4 text-[#383838]">Profile Details</h3>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Profile Image & Edit Button */}
          <div className=" w-full lg:w-[20%] flex flex-col items-center justify-center gap-4">
            <div className="w-40 h-40 bg-[#EAECF0] rounded-full"></div>
            <button className="bg-[#F7941D] text-white text-[18px] px-10 py-1  mt-4 rounded-full">
              Edit
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4  bg-[#FFFFFF] py-6 px-6 rounded-xl">
            <div>
              <label className="block text-[16px] font-medium text-[#656565]">First Name</label>
              <input
                {...register("firstName", { required: "First name is required" })}
                className="mt-1 w-full border border-[#E2E2E2] rounded-full px-4 py-2 text-sm outline-none"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-[16px] font-medium text-[#656565]">Last Name</label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                className="mt-1 w-full border border-[#E2E2E2] rounded-full px-4 py-2 text-sm outline-none"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-[16px] font-medium text-[#656565]">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                className="mt-1 w-full border border-[#E2E2E2] rounded-full px-4 py-2 text-sm outline-none"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-[16px] font-medium text-[#656565]">Phone</label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                })}
                className="mt-1 w-full border  border-[#E2E2E2] rounded-full px-4 py-2 text-sm outline-none"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-[16px] font-medium text-[#656565]">Address</label>
              <textarea
                {...register("address", { required: "Address is required" })}
                className="mt-1 w-full border border-[#E2E2E2] rounded-xl px-4 py-2 text-sm outline-none resize-none"
                rows={3}
              />
              {errors.address && (
                <p className="text-xs text-red-500  mt-1">{errors.address.message}</p>
              )}
            </div>
            {/* <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-[#F7941D] text-white px-6 py-2 rounded-full">
                Save Changes
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
