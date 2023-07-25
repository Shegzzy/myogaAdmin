import React from 'react';
import './drivers.scss';
import { useState, useRef } from "react";
import { updateDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from '../../firebase';
import Snakbar from '../snackbar/Snakbar';

const Drivers = (props) => {
    const driverID = props.id;
    const bookID = props.bookID;
    const bookingNum = props.bookNum;
    const customer = props.customer;
    const snackbarRef = useRef(null);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const docRef = doc(db, 'Bookings', bookID);
            const updateTimestamp = await updateDoc(docRef, {
                'Driver ID': driverID,
                Status: 'active'.toString(),
                timeStamp: serverTimestamp()
            });

            createStatus();

        } catch (e) {
            setMsg(e.message);
            setType("error");
            snackbarRef.current.show();
        }

    }

    const createStatus = async () => {

        const addRef = await setDoc(doc(db, "Order_Status", bookID), {
            'Order Assigned': '1',
            'Out For PickUp': '0',
            'Parcel Picked': '0',
            'Going to DropOff': '0',
            'Arrived at PickUp': '0',
            'Arrived at DropOff': '0',
            'Completed': '0',
            'Customer ID': customer.toString(),
            'Driver ID': driverID.toString(),
            'Booking Number': bookingNum.toString(),
            'ID': bookID.toString(),
            timeStamp: serverTimestamp(),
            'Date Created': new Date().toString(),
        });
        console.log("Document written with ID: ", addRef);
        setMsg("Booking Assigned Successfully", addRef);
        setType("success");
        snackbarRef.current.show();
    }

    return (
        <div class="m-2 py-8 px-8 max-w-sm bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
            <img class="object-cover rounded-full h-[100px] w-[100px] block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0" src={props.img} alt="Woman's Face" />
            <div class="text-center space-y-2 sm:text-left">
                <div class="space-y-0.5">
                    <Snakbar ref={snackbarRef} message={msg} type={sType} />
                    <p class="text-lg text-black font-semibold">
                        {props.name}
                    </p>
                    <p class="text-slate-500 font-medium">
                        {props.vehicle}
                    </p>
                    <p class="text-slate-500 font-medium">
                        {props.online === '1' ? 'Online' : 'Offline'}
                    </p>
                </div>
                <button onClick={handleUpdate} class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Assign</button>
            </div>
        </div>
    )
}

export default Drivers