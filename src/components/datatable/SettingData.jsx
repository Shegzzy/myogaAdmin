import './settingData.scss';
import Dmode from '../settings/Dmode';
import LocationSet from '../settings/LocationSet';
import VehicleSet from '../settings/VehicleSet';
import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase';
import SupportSet from '../settings/SupportSet';
import AddModeModal from '../modal/AddModeModal';
import AddVehicleModal from '../modal/AddVehicleModal';
import AddLocationModal from '../modal/AddLocationModal';
import AddSupportModal from '../modal/AddSupportModal';
import Snakbar from "../snackbar/Snakbar";

const SettingData = () => {

    const [Mdata, setMData] = useState([]);
    const [Ldata, setLData] = useState([]);
    const [Vdata, setVData] = useState([]);
    const [Sdata, setSData] = useState([]);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");
    const snackbarRef = useRef(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        try {
            setLoading(true);

            fetchMode();
            fetchVehicle();
            fetchLocation();
            fetchSupport();

        } catch (error) {
            setMsg(error.message);
            setType("error");
            snackbarRef.current.show();
        } finally {
            setLoading(false);
        }
    }, [loading, Mdata]);

    const fetchMode = async () => {
        try {
            let list = [];
            const fetchDeliveryModes = await getDocs(
                collection(db, "Settings/deliverymodes/modes"),
            );

            fetchDeliveryModes.forEach((doc) => {
                list.push({ id: doc.id, name: doc.data().name, rate: doc.data().rate, duration: doc.data().duration, minimumPrice: doc.data().minimumPrice, startPrice: doc.data().startPrice });
            })
            setMData(list);

        } catch (error) {
            setMsg(error.message);
            setType("error");
            snackbarRef.current.show();
        }
    }

    const fetchVehicle = async () => {

        try {
            let list = [];
            const fetchVehicles = await getDocs(
                collection(db, "Settings/deliveryVehicles/vehicles"),
            );

            fetchVehicles.forEach((doc) => {
                list.push({ id: doc.id, name: doc.data().name });
            })
            setVData(list);

        } catch (error) {
            setMsg(error.message);
            setType("error");
            snackbarRef.current.show();
        }

    }

    const fetchLocation = async () => {
        try {
            let list = [];
            const fetchLocations = await getDocs(
                collection(db, "Settings/locations/states"),
            );

            fetchLocations.forEach((doc) => {
                list.push({ id: doc.id, name: doc.data().name });
            })
            setLData(list);

        } catch (error) {
            setMsg(error.message);
            setType("error");
            snackbarRef.current.show();
        }
    }

    const fetchSupport = async () => {
        try {
            let list = [];
            const fetchLocations = await getDocs(
                collection(db, "Settings/supports/types"),
            );

            fetchLocations.forEach((doc) => {
                list.push({ id: doc.id, name: doc.data().name });
            })
            setSData(list);

        } catch (error) {
            setMsg(error.message);
            setType("error");
            snackbarRef.current.show();
        }
    }

    return (
        <div class="container mx-auto">
            <Snakbar ref={snackbarRef} message={msg} type={sType} />

            <div className="setTile p-4"><p class="text-slate-400 hover:text-sky-400">System Settings</p></div>
            <div className="top">
                <div className="leftCard p-4">
                    <AddModeModal />
                    <div className="shadow-md flex flex-wrap justify-center">
                        {Mdata.map((data) => {
                            return (
                                < Dmode key={data.id} name={data.name} id={data.id} rate={data.rate} duration={data.duration} minimumPrice={data.minimumPrice} startPrice={data.startPrice} />)
                        })}
                    </div>
                </div>
                <div className="rightCard p-4">
                    <AddLocationModal />
                    <div className='shadow-md flex flex-wrap justify-center'>
                        {Ldata.map((data) => {
                            return (
                                < LocationSet key={data.id} name={data.name} id={data.id} />
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="bottom">
                <div className="leftCard p-4">
                    <AddVehicleModal />
                    <div className="shadow-md flex flex-wrap justify-center">
                        {Vdata.map((data) => {
                            return (
                                < VehicleSet key={data.id} name={data.name} id={data.id} />
                            )
                        })}
                    </div>
                </div>
                <div className="rightCard p-4">
                    <AddSupportModal />
                    <div className="shadow-md flex flex-wrap justify-center">
                        {Sdata.map((data) => {
                            return (
                                <SupportSet key={data.id} name={data.name} id={data.id} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default SettingData