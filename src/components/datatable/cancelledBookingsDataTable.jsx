import "./cancelledBookings.scss";
import "./bookingDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { cancelledBookingColumns, refundedBookingColumns } from "../../datatablesource";
// import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
    collection,
    doc,
    onSnapshot,
    query,
    where,
    getDocs,
    getDoc,
} from "firebase/firestore";
import { db } from "./../../firebase";
import Snakbar from "../snackbar/Snakbar";
import SearchIcon from "@mui/icons-material/Search";

const CancelledBookingDataTable = () => {
    const [data, setData] = useState([]);
    const [refunds, setRefunds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const snackbarRef = useRef(null);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");
    const [activeTab, setActiveTab] = useState("cancelled");

    // Fuction for weekly and monthly filters
    useEffect(() => {
        const fetchBookingDataByWeek = async () => {
            try {
                setLoading(true);

                let startOfPeriod, endOfPeriod;

                if (selectedFilter === "all") {
                    const querySnapshot = await getDocs(query(
                        collection(db, "Cancelled Bookings"),
                        where("Status", "==", "cancelled"))
                    );

                    const queryRefunds = await getDocs(query(
                        collection(db, "Cancelled Bookings"),
                        where("Status", "==", "refunded"))
                    );

                    let list = [];
                    let refundList = [];

                    const driverMap = new Map();
                    const userMap = new Map();

                    // Fetch driver and user IDs
                    querySnapshot.forEach((doc) => {
                        const { "Driver ID": driverID, "Customer ID": customerID } = doc.data();
                        userMap.set(customerID, "");
                        driverMap.set(driverID, "");
                    });

                    queryRefunds.forEach((doc) => {
                        const { "Driver ID": driverID, "Customer ID": customerID } = doc.data();
                        userMap.set(customerID, "");
                        driverMap.set(driverID, "");
                    });



                    // Populate driver names
                    await Promise.all(Array.from(driverMap.keys()).map(async (driverID) => {
                        try {
                            const driverDoc = await getDoc(doc(db, "Drivers", driverID));
                            if (driverDoc.exists()) {
                                const driverName = driverDoc.data().FullName;
                                driverMap.set(driverID, driverName);
                            } else {
                                console.log(`Driver with ID ${driverID} does not exist.`);
                                driverMap.delete(driverID);
                            }
                        } catch (error) {
                            console.error(`Error fetching driver with ID ${driverID}: ${error}`);
                        }
                    }));

                    // Populate user names
                    await Promise.all(Array.from(userMap.keys()).map(async (userID) => {
                        try {
                            const userDoc = await getDoc(doc(db, "Users", userID));
                            if (userDoc.exists()) {
                                const userName = userDoc.data().FullName;
                                userMap.set(userID, userName); // Set user name in the map
                            } else {
                                console.log(`User with ID ${userID} does not exist.`);
                                userMap.delete(userID);
                            }
                        } catch (error) {
                            console.error(`Error fetching user with ID ${userID}: ${error}`);
                        }
                    }));

                    querySnapshot.forEach((docs) => {
                        const { "Driver ID": driverID, "Customer ID": customerID, ...rest } = docs.data();
                        const customerName = userMap.get(customerID);
                        const driverName = driverMap.get(driverID);

                        list.push({
                            id: docs.id,
                            ...docs.data(),
                            "Customer Name": customerName,
                            "Driver Name": driverName
                        });
                    });

                    queryRefunds.forEach((docs) => {
                        const { "Driver ID": driverID, "Customer ID": customerID, ...rest } = docs.data();
                        const customerName = userMap.get(customerID);
                        const driverName = driverMap.get(driverID);

                        refundList.push({
                            id: docs.id,
                            ...docs.data(),
                            "Customer Name": customerName,
                            "Driver Name": driverName
                        });
                    });

                    list.sort(
                        (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
                    );

                    refundList.sort(
                        (a, b) => new Date(b["Refunded Date"]) - new Date(a["Refunded Date"])
                    );

                    setData(list);
                    setRefunds(refundList);
                    setMsg(" Displaying Cancelled Bookings ");
                    setType("success");
                    snackbarRef.current.show();
                } else {
                    const today = new Date();

                    // Calculate the start and end dates based on the selected filter
                    if (selectedFilter === "7") {
                        // Last Week
                        startOfPeriod = new Date(today);
                        startOfPeriod.setDate(today.getDate() - today.getDay() - 7);
                        endOfPeriod = new Date(today);
                        endOfPeriod.setDate(today.getDate() - today.getDay() - 1);
                    } else if (selectedFilter === "1") {
                        // Two Weeks Ago
                        startOfPeriod = new Date(today);
                        startOfPeriod.setDate(today.getDate() - today.getDay() - 14);
                        endOfPeriod = new Date(today);
                        endOfPeriod.setDate(today.getDate() - today.getDay() - 8);
                    } else if (selectedFilter === "2") {
                        // Three Weeks Ago
                        startOfPeriod = new Date(today);
                        startOfPeriod.setDate(today.getDate() - today.getDay() - 21);
                        endOfPeriod = new Date(today);
                        endOfPeriod.setDate(today.getDate() - today.getDay() - 15);
                    } else if (selectedFilter === "3") {
                        // Four Weeks Ago
                        startOfPeriod = new Date(today);
                        startOfPeriod.setDate(today.getDate() - today.getDay() - 28);
                        endOfPeriod = new Date(today);
                        endOfPeriod.setDate(today.getDate() - today.getDay() - 22);
                    } else if (selectedFilter === "30") {
                        // Last Month
                        startOfPeriod = new Date(today);
                        startOfPeriod.setMonth(today.getMonth() - 1, 1);
                        startOfPeriod.setHours(0, 0, 0, 0);
                        endOfPeriod = new Date(startOfPeriod.getFullYear(), startOfPeriod.getMonth() + 1, 0);
                        // endOfPeriod.setHours(23, 59, 59, 999);
                    } else if (selectedFilter === "60") {
                        // Two Months Ago
                        startOfPeriod = new Date(today);
                        startOfPeriod.setMonth(today.getMonth() - 2, 1);
                        startOfPeriod.setHours(0, 0, 0, 0);
                        endOfPeriod = new Date(today);
                        endOfPeriod.setMonth(today.getMonth() - 1, 0);

                    }

                    console.log('Start of period: ' + startOfPeriod);
                    console.log('End of period: ' + endOfPeriod);

                    const querySnapshot = await getDocs(query(
                        collection(db, "Cancelled Bookings"),
                        where("Status", "==", "cancelled"),
                        where("Date Created", ">=", startOfPeriod.toISOString()),
                        where("Date Created", "<=", endOfPeriod.toISOString())
                    ));

                    let list = [];
                    const driverMap = new Map();
                    const userMap = new Map();

                    // Fetch driver and user IDs
                    querySnapshot.forEach((doc) => {
                        const { "Driver ID": driverID, "Customer ID": customerID } = doc.data();
                        userMap.set(customerID, "");
                        driverMap.set(driverID, "");
                    });



                    // Populate driver names
                    await Promise.all(Array.from(driverMap.keys()).map(async (driverID) => {
                        try {
                            const driverDoc = await getDoc(doc(db, "Drivers", driverID));
                            if (driverDoc.exists()) {
                                const driverName = driverDoc.data().FullName;
                                driverMap.set(driverID, driverName); // Set driver name in the map
                            } else {
                                console.log(`Driver with ID ${driverID} does not exist.`);
                                driverMap.delete(driverID);
                            }
                        } catch (error) {
                            console.error(`Error fetching driver with ID ${driverID}: ${error}`);
                        }
                    }));

                    // Populate user names
                    await Promise.all(Array.from(userMap.keys()).map(async (userID) => {
                        try {
                            const userDoc = await getDoc(doc(db, "Users", userID));
                            if (userDoc.exists()) {
                                const userName = userDoc.data().FullName;
                                userMap.set(userID, userName); // Set user name in the map
                            } else {
                                console.log(`User with ID ${userID} does not exist.`);
                                userMap.delete(userID);
                            }
                        } catch (error) {
                            console.error(`Error fetching user with ID ${userID}: ${error}`);
                            // Handle error (e.g., show error message)
                        }
                    }));

                    querySnapshot.forEach((docs) => {
                        const { "Driver ID": driverID, "Customer ID": customerID, ...rest } = docs.data();
                        const customerName = userMap.get(customerID);
                        const driverName = driverMap.get(driverID);

                        list.push({
                            id: docs.id,
                            ...docs.data(),
                            "Customer Name": customerName,
                            "Driver Name": driverName
                        });
                    });

                    list.sort(
                        (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
                    );
                    setData(list);
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDataByWeek();
    }, [selectedFilter]);


    // Function to search for riders
    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            activeTab === "cancelled" ?
            onSnapshot(
                query(collection(db, "Cancelled Bookings"), where("Status", "==", "cancelled")),
                async (snapShot) => {
                    let list = [];
                    const driverMap = new Map();
                    const userMap = new Map();
                    // Fetch driver and user IDs
                    snapShot.forEach((docs) => {
                        const { "Driver ID": driverID, "Customer ID": customerID } = docs.data();
                        userMap.set(customerID, "");
                        driverMap.set(driverID, "");
                    });


                    // Populate driver names
                    await Promise.all(Array.from(driverMap.keys()).map(async (driverID) => {
                        try {
                            const driverDoc = await getDoc(doc(db, "Drivers", driverID));
                            if (driverDoc.exists()) {
                                const driverName = driverDoc.data().FullName;
                                driverMap.set(driverID, driverName); // Set driver name in the map
                            } else {
                                console.log(`Driver with ID ${driverID} does not exist.`);
                                driverMap.delete(driverID);
                            }
                        } catch (error) {
                            console.error(`Error fetching driver with ID ${driverID}: ${error}`);
                        }
                    }));

                    // Populate user names
                    await Promise.all(Array.from(userMap.keys()).map(async (userID) => {
                        try {
                            const userDoc = await getDoc(doc(db, "Users", userID));
                            if (userDoc.exists()) {
                                const userName = userDoc.data().FullName;
                                userMap.set(userID, userName); // Set user name in the map
                            } else {
                                console.log(`User with ID ${userID} does not exist.`);
                                userMap.delete(userID);
                            }
                        } catch (error) {
                            console.error(`Error fetching user with ID ${userID}: ${error}`);
                            // Handle error (e.g., show error message)
                        }
                    }));

                    snapShot.forEach((docs) => {
                        const { "Driver ID": driverID, "Customer ID": customerID, ...rest } = docs.data();
                        const customerName = userMap.get(customerID);
                        const driverName = driverMap.get(driverID);

                        list.push({
                            id: docs.id,
                            ...docs.data(),
                            "Customer Name": customerName,
                            "Driver Name": driverName
                        });
                    });

                    list.sort(
                        (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
                    );
                    setData(list);
                    setMsg(" Displaying All Bookings ");
                    setType("success");
                    snackbarRef.current.show();
                },
                (error) => {
                    setMsg(error.message);
                    setType("error");
                    snackbarRef.current.show();
                }
            ) : onSnapshot(
                query(collection(db, "Cancelled Bookings"), where("Status", "==", "refunded")),
                async (snapShot) => {
                    let list = [];
                    const driverMap = new Map();
                    const userMap = new Map();
                    // Fetch driver and user IDs
                    snapShot.forEach((docs) => {
                        const { "Driver ID": driverID, "Customer ID": customerID } = docs.data();
                        userMap.set(customerID, "");
                        driverMap.set(driverID, "");
                    });


                    // Populate driver names
                    await Promise.all(Array.from(driverMap.keys()).map(async (driverID) => {
                        try {
                            const driverDoc = await getDoc(doc(db, "Drivers", driverID));
                            if (driverDoc.exists()) {
                                const driverName = driverDoc.data().FullName;
                                driverMap.set(driverID, driverName); // Set driver name in the map
                            } else {
                                console.log(`Driver with ID ${driverID} does not exist.`);
                                driverMap.delete(driverID);
                            }
                        } catch (error) {
                            console.error(`Error fetching driver with ID ${driverID}: ${error}`);
                        }
                    }));

                    // Populate user names
                    await Promise.all(Array.from(userMap.keys()).map(async (userID) => {
                        try {
                            const userDoc = await getDoc(doc(db, "Users", userID));
                            if (userDoc.exists()) {
                                const userName = userDoc.data().FullName;
                                userMap.set(userID, userName); // Set user name in the map
                            } else {
                                console.log(`User with ID ${userID} does not exist.`);
                                userMap.delete(userID);
                            }
                        } catch (error) {
                            console.error(`Error fetching user with ID ${userID}: ${error}`);
                            // Handle error (e.g., show error message)
                        }
                    }));

                    snapShot.forEach((docs) => {
                        const { "Driver ID": driverID, "Customer ID": customerID, ...rest } = docs.data();
                        const customerName = userMap.get(customerID);
                        const driverName = driverMap.get(driverID);

                        list.push({
                            id: docs.id,
                            ...docs.data(),
                            "Customer Name": customerName,
                            "Driver Name": driverName
                        });
                    });

                    list.sort(
                        (a, b) => new Date(b["Refunded Date"]) - new Date(a["Refunded Date"])
                    );
                    setRefunds(list);
                    setMsg(" Displaying All Refunds ");
                    setType("success");
                    snackbarRef.current.show();
                },
                (error) => {
                    setMsg(error.message);
                    setType("error");
                    snackbarRef.current.show();
                }
            );
        } else if(activeTab === "cancelled") {
            const filteredData = data.filter((bookingNumber) => {
                const name = bookingNumber['Booking Number']?.toLowerCase() ?? "";
                return name.includes(searchTerm?.toLowerCase() ?? "");
            });

            if (filteredData.length === 0) {
                setMsg('No search results found.');
                setType("error");
                snackbarRef.current.show();
            }

            setData(filteredData);
        } else {
            const filteredData = refunds.filter((bookingNumber) => {
                const name = bookingNumber['Booking Number']?.toLowerCase() ?? "";
                return name.includes(searchTerm?.toLowerCase() ?? "");
            });

            if (filteredData.length === 0) {
                setMsg('No search results found.');
                setType("error");
                snackbarRef.current.show();
            }

            setRefunds(filteredData);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm]);

    const switchToCancelled = () => {
        setTimeout(() => {
            setActiveTab("cancelled")
        })
    }

    const switchToRefunds = () => {
        setTimeout(() => {
            setActiveTab("refunded")
        })
    }

    return (
        <div className="datatable">
            <Snakbar ref={snackbarRef} message={msg} type={sType} />
            <div className="datatableTitle">
                Cancelled Bookings

                <div className="search">
                    <input
                        type="text"
                        placeholder="Search Booking Number..."
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                        value={searchTerm}
                    />
                    <SearchIcon />
                </div>

                <div className="filter-select-container">
                    <select
                        className="chart-selects"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="7">Last Week</option>
                        <option value="1">Two Weeks Ago</option>
                        <option value="2">Three Weeks Ago</option>
                        <option value="3">Four Weeks Ago</option>
                        <option value="30">Last Month</option>
                        <option value="60">Two Months Ago</option>
                    </select>
                </div>

            </div>

            <div className="s-bottom">
                <div className="table-navs">
                    {/* Cancelled tab */}
                    <h1 className={`title ${activeTab === "cancelled" ? "active" : ""}`} onClick={switchToCancelled}>
                        Cancelled Bookings
                    </h1>

                    {/* Refunds tab */}
                    <h1 className={`title ${activeTab === "refunded" ? "active" : ""}`} onClick={switchToRefunds}>
                        Refunds
                    </h1>
                </div>

                {!loading ? (
                    <>
                        {activeTab === "cancelled" && (
                            <DataGrid
                                className="datagrid"
                                rows={data}
                                columns={cancelledBookingColumns}
                                pageSize={9}
                                rowsPerPageOptions={[9]}
                            // checkboxSelection
                            />
                        )}

                        {activeTab === "refunded" && (
                            <DataGrid
                                className="datagrid"
                                rows={refunds}
                                columns={refundedBookingColumns}
                                pageSize={9}
                                rowsPerPageOptions={[9]}
                            // checkboxSelection
                            />
                        )}
                    </>
                ) : (
                    <div className="detailItem">
                        <span className="itemKey">
                            <div className="no-data-message">
                                <div className="single-container">
                                    <div className="loader">
                                        <div className="lds-dual-ring"></div>
                                        <div>Loading... </div>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CancelledBookingDataTable;
