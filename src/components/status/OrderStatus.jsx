import './orderStatus.scss';
import React from 'react';
import { useEffect, useState } from 'react';
import { doc, getDocs, getDoc, where, query, collection } from "firebase/firestore";
import { db } from "../../firebase";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const OrderStatus = (props) => {

    const bookID = props.id;
    const [CusID, setCusID] = useState();
    const [DriverID, setDriverID] = useState();
    const [Ddata, setDdata] = useState([]);
    const [Bdata, setBdata] = useState([]);
    const [Cdata, setCdata] = useState([]);
    const [orderA, setOrderA] = useState();
    const [outPick, setOutPick] = useState();
    const [parcelP, setParcelP] = useState();
    const [goingD, setGoingD] = useState();
    const [arrivedD, setArrivedD] = useState();
    const [arrivedP, setArrivedP] = useState();
    const [complete, setComplete] = useState();

    useEffect(() => {
        fetchBooking();
        fetchUser();
        fetchDriver();


    });

    const fetchBooking = async () => {
        try {
            const booking = [];
            const q = query(collection(db, "Order_Status"), where("Booking Number", "==", bookID));
            const docSnap = await getDocs(q);
            docSnap.forEach((doc) => {
                setCusID(doc.data()['Customer ID']);
                setDriverID(doc.data()['Driver ID']);
                setOrderA(doc.data()['Order Assigned']);
                setOutPick(doc.data()['Out For PickUp']);
                setArrivedP(doc.data()['Arrive at PickUp']);
                setParcelP(doc.data()['Parcel Picked']);
                setGoingD(doc.data()['Going to DropOff']);
                setArrivedD(doc.data()['Arrive DropOff']);
                setComplete(doc.data().Completed);
                booking.push({ bookN: doc.data()['Booking Number'], orderA: doc.data()['Order Assigned'], outPick: doc.data()['Out For PickUp'], parcelP: doc.data()['Parcel Picked'], goingD: doc.data()['Going to DropOff'], arrivedP: doc.data()['Arrive at PickUp'], arrivedD: doc.data()['Arrive DropOff'], complete: doc.data().Completed })
                console.log(doc.id, " => ", doc.data());
            });
            setBdata(booking);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUser = async () => {
        try {
            const userData = [];
            const docRef = doc(db, "Users", CusID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                userData.push({ name: docSnap.data().FullName, email: docSnap.data().Email, phone: docSnap.data().Phone, gender: docSnap.data().Gender, img: docSnap.data()['Profile Photo'] })
                setCdata(userData);
                console.log("Document USER data:", docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDriver = async () => {
        try {
            const DriverData = [];
            const docRef = doc(db, "Drivers", DriverID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                DriverData.push({ name: docSnap.data().FullName, email: docSnap.data().Email, company: docSnap.data().Company, phone: docSnap.data().Phone, gender: docSnap.data().Gender, img: docSnap.data()['Profile Photo'], vehicleT: docSnap.data()['Vehicle Type'], vehicleN: docSnap.data()['Vehicle Number'], vehicleC: docSnap.data()['Vehicle Color'] })
                setDdata(DriverData);
                console.log("Document DRIVER data:", docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className='container mx-auto'>
            <div className='contents flex flex-wrap justify-center'>
                <div class="flex-1">
                    <div class="m-2 py-8 px-8 max-w-sm bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
                        <img class="object-cover rounded-full h-[100px] w-[100px] block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0" src={Ddata.map(Ddata => (Ddata.img))} alt="Woman's Face" />
                        <div class="text-center space-y-2 sm:text-left">
                            <div class="space-y-0.5">

                                <p class="text-lg text-black font-semibold">
                                    {Ddata.map(Ddata => (Ddata.name))}
                                </p>
                                <p class="text-slate-500 font-medium">
                                    {Ddata.map(Ddata => (Ddata.phone))}
                                </p>
                                <p class="text-slate-500 font-medium">
                                    {Ddata.map(Ddata => (Ddata.company))}
                                </p>
                                <p class="text-slate-500 font-medium">
                                    {Ddata.map(Ddata => (Ddata.vehicleT))}
                                </p>
                                <p class="text-slate-500 font-medium">
                                    {Ddata.map(Ddata => (Ddata.vehicleC))}
                                </p>
                                <p class="text-slate-500 font-medium">
                                    {Ddata.map(Ddata => (Ddata.vehicleN))}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex-1">
                    <div class="m-2 py-8 px-8 max-w-sm bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
                        <img class="object-cover rounded-full h-[100px] w-[100px] block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0" src={Cdata.map(Cdata => (Cdata.img))} alt="Woman's Face" />
                        <div class="text-center space-y-2 sm:text-left">
                            <div class="space-y-0.5">

                                <p class="text-lg text-black font-semibold">
                                    {Cdata.map(Cdata => (Cdata.name))}
                                </p>
                                <p class="text-slate-500 font-medium">
                                    {Cdata.map(Cdata => (Cdata.email))}
                                </p>
                                <p class="text-slate-500 font-medium">
                                    {Cdata.map(Cdata => (Cdata.phone))}
                                </p>
                                <p class="text-slate-500 font-medium">
                                    {Cdata.map(Cdata => (Cdata.gender))}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid py-8 px-8">
                <div>{orderA === "1" ? <div class='m-4'>< CheckCircleIcon className='icon-active text-green' /> Order Assigned</div> : <div class='m-4'>< CheckCircleIcon className='icon-inactive' /> Order Not Assigned</div>}</div>
                <div>{outPick === "1" ? <div class='m-4'><TwoWheelerIcon className='icon-active text-green' /> Rider on his way</div> : <div class='m-4'><TwoWheelerIcon className='icon-inactive' /> Waiting...</div>}</div>
                <div>{arrivedP === "1" ? <div class='m-4'><FlightLandIcon className='icon-active text-green' /> Rider Arrived at Pick Up</div> : <div class='m-4'><FlightLandIcon className='icon-inactive' /> Waiting...</div>}</div>
                <div>{parcelP === "1" ? <div class='m-4'>< LocalShippingIcon className='icon-active text-green' /> Parcel Picked </div> : <div class='m-4'>< LocalShippingIcon className='icon-inactive' /> Waiting... </div>}</div>
                <div>{goingD === "1" ? <div class='m-4'>< LocalPostOfficeIcon className='icon-active text-green' /> Rider going delivery</div> : <div class='m-4'>< LocalPostOfficeIcon className='icon-inactive' /> Waiting...</div>}</div>
                <div>{arrivedD === "1" ? <div class='m-4'><FlightLandIcon className='icon-active text-green' /> Rider Arrived at Drop</div> : <div class='m-4'><FlightLandIcon className='icon-inactive' /> Waiting...</div>}</div>
                <div>{complete === "1" ? <div class='m-4'>< HowToRegIcon className='icon-active text-green' /> Order Completed</div> : <div class='m-4'>< HowToRegIcon className='icon-inactive' /> Waiting...</div>}</div>
            </div>
        </div >
    )
}

export default OrderStatus