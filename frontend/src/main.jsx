import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51RpPmC2d1wXpXlYbIlOLYmnb75PjzgPYmWVbDyy6dmZeEO7N3nD6Cf2XUPYnMKcCFTTu4k5u3wVE1477AaPfaCv200CreWeKBt");

createRoot(document.getElementById('root')).render(


    <Elements stripe={stripePromise}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Elements>

)
