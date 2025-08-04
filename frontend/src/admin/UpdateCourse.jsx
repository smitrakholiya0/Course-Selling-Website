import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../utils";

const UpdateCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isLodding, setIsLodding] = useState(false)

  useEffect(() => {
    const getCourseData = async () => {
      const response = await axios.get(`${BACKEND_URL}/course/${id}`, {
        withCredentials: true
      })
      console.log(response.data.course.title);
      setTitle(response.data.course.title)
      setDescription(response.data.course.description)
      setPrice(response.data.course.price)
      setImagePreview(response.data.course.image?.url)

    }
    getCourseData()
  }, [id])

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
      console.log("filer", file);
      console.log("before", image);
      setImage(file)
      console.log("afteer", image);

    }
  };


  const handleSubmit = async (e) => {
    console.log("last", image);

    setIsLodding(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (image) {
      formData.append("image", image);
    }


    const token = JSON.parse(localStorage.getItem("admin"));
    if (!token) {
      navigate("/admin/login");
      return;
    }
    try {
      const response = await axios.put(
        `${BACKEND_URL}/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      toast.success(response.data.message || "Course Updated successfully");
      navigate("/admin/our-courses");
      setTitle("");
      setPrice("");
      setImage("");
      setDescription("");
      setImagePreview("");
      setIsLodding(false)
    } catch (error) {
      console.log(error?.response?.data?.error || "Something went wrong");
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-8 rounded-md shadow-md border"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Update Course
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            value={title}
            type="text"
            placeholder="Enter your course title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder="Enter your description"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="Enter your course price"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Course Image */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">
            Course Image
          </label>

          {/* Placeholder image preview */}
          <img
            src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
            alt="Preview"
            className="h-30  object-cover mb-2 border rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded px-2 py-1 bg-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-lg font-medium"
        >
          Update Course
        </button>
      </form>
    </div>
  );
};

export default UpdateCourse;
