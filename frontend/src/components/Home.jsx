import React, { useEffect, useState } from 'react'
// import logo1 from "../../public/logo.webp"
import logo from "../public/logo.webp"
import axios from "axios"
import { Link } from "react-router-dom"
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from 'react-hot-toast';
import { BACKEND_URL } from "../../utils";


function Home() {

    const [courses, setCourses] = useState([]);
    const [isLoggin, setIsLoggin] = useState(false)


    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/course/courses`,
                    { withCredentials: true }
                )
                setCourses(response.data.courses)
                // console.log(response.data.courses)


            } catch (error) {
                console.log("error in fetch course")
            }
        }
        fetchCourse()
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("user") || localStorage.getItem("admin")

        if (token) {
            setIsLoggin(true)
        }
        else {
            setIsLoggin(false)
        }
    }, [])


    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };


    const handleLogout = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/user/logout`, {}, {
                withCredentials: true,
            })
            toast.success(response.data.message)
            localStorage.clear()
            setIsLoggin(false)
        } catch (error) {
            console.log("Error in logging Out", error);
            toast.error(error.response.data.message || "error in logging out")
        }
    }



    return (
        <div className='bg-gradient-to-r from-black to-blue-950'>
            <div className='h-screen text-white container mx-auto max-w-9/12'>
                <header className='flex items-center justify-between p-6'>
                    <div className='flex items-center space-x-2'>
                        <img src={logo} alt="" className='w-10 h-10 rounded-full' />
                        <h1 className='text-2xl text-orange-500 font-bold'>Course Wala</h1>
                    </div>
                    <div className='space-x-4'>

                        {
                            isLoggin ? <><button onClick={handleLogout} className='bg-transparent text-white py-2 px-4 border border-white rounded'>
                                Log Out
                            </button></> : <>
                                <Link to={"/login"} className='bg-transparent text-white py-2 px-4 border border-white rounded'>
                                    Login
                                </Link>
                                <Link to={"/signup"} className='bg-transparent text-white py-2 px-4 border border-white rounded'>
                                    SignUp
                                </Link>
                            </>
                        }

                    </div>
                </header>

                <section className='text-center py-20'>
                    <h1 className='text-4xl font-semibold text-orange-500 '>Course Wala</h1>
                    <br />
                    <br />
                    <p className='text-gray-500'>Level up with expert-crafted courses tailored for your success.</p>
                    <div className='space-x-4 mt-8'>
                        <Link to={"/courses"} className='bg-green-500 py-3 px-6 text-white rounded font-semibold hover:bg-white duration-300 hover:text-black'>
                            Explore Courses
                        </Link>
                        <Link to={"https://www.linkedin.com/in/smitrakholiya0/"} className='bg-white text-black py-3 px-6 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white'>
                            Courses videos
                        </Link>
                    </div>
                </section>
                <section>
                    <Slider className="" {...settings}>
                        {courses.map((course) => (
                            <div key={course._id} className="p-2 sm:p-3 md:p-4">
                                <div className="relative flex-shrink-0 w-full max-w-xs mx-auto transition-transform duration-300 transform hover:scale-105">
                                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                                        <img
                                            className="h-32 w-full object-contain bg-white"
                                            src={course.image.url}
                                            alt={course.title}
                                        />
                                        <div className="p-4 text-center">
                                            <h2 className="text-lg sm:text-xl font-bold text-white">
                                                {course.title}
                                            </h2>
                                            <Link
                                                to={`/buy/${course._id}`}
                                                className="mt-4 inline-block bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300"
                                            >
                                                Enroll Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>

                </section>
                <hr />

                <footer className="my-12">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center space-x-2">
                                <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                                <h1 className="text-2xl text-orange-500 font-bold">
                                    Course Wala
                                </h1>
                            </div>
                            <div className="mt-3 ml-2 md:ml-8">
                                <p className="mb-2">Follow us</p>
                                <div className="flex space-x-4">
                                    <a href="">
                                        <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                                    </a>
                                    <a href="">
                                        <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                                    </a>
                                    <a href="">
                                        <FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="items-center mt-6 md:mt-0 flex flex-col">
                            <h3 className="text-lg font-semibold md:mb-4">connects</h3>
                            <ul className=" space-y-2 text-gray-400">
                                <li className="hover:text-white cursor-pointer duration-300">
                                    youtube- learn coding
                                </li>
                                <li className="hover:text-white cursor-pointer duration-300">
                                    telegram- learn coding
                                </li>
                                <li className="hover:text-white cursor-pointer duration-300">
                                    Github- learn coding
                                </li>
                            </ul>
                        </div>
                        <div className="items-center mt-6 md:mt-0 flex flex-col">
                            <h3 className="text-lg font-semibold mb-4">
                                copyrights &#169; 2024
                            </h3>
                            <ul className=" space-y-2 text-center text-gray-400">
                                <li className="hover:text-white cursor-pointer duration-300">
                                    Terms & Conditions
                                </li>
                                <li className="hover:text-white cursor-pointer duration-300">
                                    Privacy Policy
                                </li>
                                <li className="hover:text-white cursor-pointer duration-300">
                                    Refund & Cancellation
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Home
