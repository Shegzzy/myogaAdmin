import './settingData.scss';
import Dmode from '../settings/Dmode';
import LocationSet from '../settings/LocationSet';
import VehicleSet from '../settings/VehicleSet';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase';
import SupportSet from '../settings/SupportSet';
import AddModeModal from '../modal/AddModeModal';
import AddVehicleModal from '../modal/AddVehicleModal';
import AddLocationModal from '../modal/AddLocationModal';
import AddSupportModal from '../modal/AddSupportModal';

const SettingData = () => {

    const [Mdata, setMData] = useState([]);
    const [Ldata, setLData] = useState([]);
    const [Vdata, setVData] = useState([]);
    const [Sdata, setSData] = useState([]);

    useEffect(() => {
        fetchMode();
        fetchVehicle();
        fetchLocation();
        fetchSupport();

    });

    const fetchMode = () => {
        const unsub = onSnapshot(collection(db, "Settings/deliverymodes/modes"), (snapShot) => {
            let list = [];
            snapShot.docs.forEach(doc => {
                list.push({ id: doc.id, name: doc.data().name, rate: doc.data().rate, duration: doc.data().duration });
            });
            setMData(list);
            // setMsg(" Displaying Users Information ");
            // setType("success");
            // snackbarRef.current.show();
        }, (error) => {
            // setMsg(error.message);
            // setType("error");
            // snackbarRef.current.show();
        });

        return () => {
            unsub();
        }
    }
    const fetchVehicle = () => {
        const unsub = onSnapshot(collection(db, "Settings/deliveryVehicles/vehicles"), (snapShot) => {
            let list = [];
            snapShot.docs.forEach(doc => {
                list.push({ id: doc.id, name: doc.data().name });
            });
            setVData(list);
            // setMsg(" Displaying Users Information ");
            // setType("success");
            // snackbarRef.current.show();
        }, (error) => {
            // setMsg(error.message);
            // setType("error");
            // snackbarRef.current.show();
        });

        return () => {
            unsub();
        }
    }
    const fetchLocation = () => {
        const unsub = onSnapshot(collection(db, "Settings/locations/states"), (snapShot) => {
            let list = [];
            snapShot.docs.forEach(doc => {
                list.push({ id: doc.id, name: doc.data().name });
            });
            setLData(list);
            // setMsg(" Displaying Users Information ");
            // setType("success");
            // snackbarRef.current.show();
        }, (error) => {
            // setMsg(error.message);
            // setType("error");
            // snackbarRef.current.show();
        });

        return () => {
            unsub();
        }
    }

    const fetchSupport = () => {
        const unsub = onSnapshot(collection(db, "Settings/supports/types"), (snapShot) => {
            let list = [];
            snapShot.docs.forEach(doc => {
                list.push({ id: doc.id, name: doc.data().name });
            });
            setSData(list);
            // setMsg(" Displaying Users Information ");
            // setType("success");
            // snackbarRef.current.show();
        }, (error) => {
            // setMsg(error.message);
            // setType("error");
            // snackbarRef.current.show();
        });

        return () => {
            unsub();
        }
    }

    return (
        <div class="container mx-auto">
            <div className="setTile p-4"><p class="text-slate-400 hover:text-sky-400">System Settings</p></div>
            <div className="top">
                <div className="leftCard p-4">
                    <AddModeModal />
                    <div className="shadow-md flex flex-wrap justify-center">
                        {Mdata.map((data) => {
                            return (
                                < Dmode name={data.name} id={data.id} rate={data.rate} duration={data.duration} />
                            )
                        })}
                    </div>
                </div>
                <div className="rightCard p-4">
                    <AddLocationModal />
                    <div className='shadow-md flex flex-wrap justify-center'>
                        {Ldata.map((data) => {
                            return (
                                < LocationSet name={data.name} id={data.id} />
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
                                < VehicleSet name={data.name} id={data.id} />
                            )
                        })}
                    </div>
                </div>
                <div className="rightCard p-4">
                    <AddSupportModal />
                    <div className="shadow-md flex flex-wrap justify-center">
                        {Sdata.map((data) => {
                            return (
                                <SupportSet name={data.name} id={data.id} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default SettingData