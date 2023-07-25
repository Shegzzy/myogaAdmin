import "./singleDriver.scss";
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { db } from "../../firebase";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    getDocs,
    query,
    where
} from "firebase/firestore";
import DriverTable from "../../components/table/DriverTable";

const SingleDriver = (props) => {

    const location = useLocation();
    const userID = location.state.id;
    const [data, setData] = useState([]);
    const [bookingData, setBookingData] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [diff, setDiff] = useState(null);
    const [bookL, setBookL] = useState(null);
    const [earnL, setEarnL] = useState(null);
    const [oData, setOData] = useState([]);
    const [lWData, setLWData] = useState([]);
    const [lMData, setLData] = useState([]);
    const [mData, setMData] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const profile = [];
                const docRef = doc(db, "Drivers", userID);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    profile.push({ id: docSnap.id, ...docSnap.data() })
                    setData(profile);
                } else {
                    alert("No such document!");
                }
            } catch (error) {
                alert(error);
            }
        };
        fetchData();
        getEarnings();
        getBookings();
        getData();

    });

    const getEarnings = async () => {
        let isMounted = true;

        const bookingsQuery = query(
            collection(db, "Earnings"),
            where("Driver", "==", userID)
        );
        const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
            let totalAmount = 0;
            snapshot.forEach((doc) => {
                const booking = doc.data();
                totalAmount += parseFloat(booking.Amount);
            });
            if (isMounted) {
                setTotalEarnings(totalAmount);
                setEarnL(snapshot.docs.length);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }

    const getBookings = async () => {
        let isMounted = true;

        const bookingsQuery = query(
            collection(db, "Bookings"),
            where("Driver ID", "==", userID)
        );
        const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
            const bookingsData = [];
            snapshot.forEach((doc) => {
                const booking = doc.data();
                const bookingId = doc.id; // unique ID for this booking document
                bookingsData.push({ ...booking, id: bookingId }); // include ID in booking data
            });
            if (isMounted) {
                bookingsData.sort(
                    (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
                );
                setBookingData(bookingsData);
                setBookL(snapshot.docs.length);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }

    const getData = async () => {
        // let dataArray = [];
        // let dataOArray = [];
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeekAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        // const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2));

        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            0,
            23,
            59,
            59,
            999
        );

        //This Month's Earning Query
        const thisMonthQuery = query(
            collection(db, "Earnings"),
            where("Driver", "==", userID),
            where("DateCreated", ">=", firstDayOfMonth.toISOString()),
            where("DateCreated", "<=", today.toISOString())
        );

        //Last Month's Earning Query
        const lastMonthQuery = query(
            collection(db, "Earnings"),
            where("Driver", "==", userID),
            where("DateCreated", ">=", lastMonth.toISOString()),
            where("DateCreated", "<=", endOfMonth.toISOString())
        );
        // const prevMonthQuery = query(
        //   collection(db, "Earnings"),
        //   where("Company", "==", docs.data().company),
        //   where("timeStamp", "<=", lastMonth),
        //   where("timeStamp", ">", prevMonth)
        // );
        //A week ago
        const oneWeekQuery = query(
            collection(db, "Earnings"),
            where("Driver", "==", userID),
            where("timeStamp", "<=", today),
            where("timeStamp", ">", oneWeekAgo)
        );

        //Two weeks ago
        const twoWeekQuery = query(
            collection(db, "Earnings"),
            where("Driver", "==", userID),
            where("timeStamp", "<=", oneWeekAgo),
            where("timeStamp", ">", twoWeekAgo)
        );

        //Gettin the percentage difference
        let currentMonthPercentageDiff = 0;

        if (lMData > 0) {
            currentMonthPercentageDiff = ((mData - lMData) / lMData) * 100;
        } else {
            currentMonthPercentageDiff = 100;
        }
        const roundedDiff = currentMonthPercentageDiff.toFixed(0); // round up to 0 decimal places
        setDiff(roundedDiff);

        getDocs(lastMonthQuery).then((querySnapshot) => {
            let total = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                total += parseInt(data.Amount);
            });
            setLData(total);
        });

        getDocs(thisMonthQuery).then((querySnapshot) => {
            let total = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                total += parseInt(data.Amount);
            });
            setMData(total);
        });

        //Calculating a week ago amount
        getDocs(oneWeekQuery).then((querySnapshot) => {
            let total = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                total += parseFloat(data.Amount);
            });
            setOData(total);
        });

        //Calculating two weeks ago amount
        getDocs(twoWeekQuery).then((querySnapshot) => {
            let total = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                total += parseFloat(data.Amount);
            });
            setLWData(total);
        });

    };

    return (
        <div className='singleDriver'>
            <Sidebar />
            <div className="singleDriverContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <div className="editButton">
                            <Link to={`/edit/${userID}`} style={{ textDecoration: "none" }}>
                                Edit
                            </Link>
                        </div>
                        <h1 className="title">Information</h1>
                        {data.map((row) => (
                            < div className="item" >
                                <img src={row['Profile Photo']} alt="avatar" className="itemImg" />
                                <div className="details">
                                    <h1 className="name">{row.FullName}</h1>
                                    <div className="detailItem">
                                        <span className="itemKey">Email: </span>
                                        <span className="itemValue">{row.Email}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Phone: </span>
                                        <span className="itemValue">{row.Phone}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Address: </span>
                                        <span className="itemValue">{row.Address}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Company: </span>
                                        <span className="itemValue">{row.Company}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Verification: </span>
                                        <span className="itemValue">{row.Verified === "1" ? "Verified" : "Unverified"}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Gender: </span>
                                        <span className="itemValue">{row.Gender}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">DOB: </span>
                                        <span className="itemValue">{row['Date of Birth']}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">State: </span>
                                        <span className="itemValue">{row.State}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Status: </span>
                                        <span className="itemValue">{row.Online === "1" ? "Online" : "Offline"}</span>
                                    </div>
                                </div>
                                <div className="details">
                                    <h1 className="name">Vehicle Details</h1>
                                    <div className="detailItem">
                                        <span className="itemKey">Type: </span>
                                        <span className="itemValue">{row['Vehicle Type']}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Make: </span>
                                        <span className="itemValue">{row['Vehicle Make']}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Model: </span>
                                        <span className="itemValue">{row['Vehicle Model']}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">VNumber: </span>
                                        <span className="itemValue">{row['Vehicle Number']}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Year: </span>
                                        <span className="itemValue">{row['Vehicle Year']}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Color: </span>
                                        <span className="itemValue">{row['Vehicle Color']}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Current Location: </span>
                                        <span className="itemValue">{row['Driver Address']}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Latitude: </span>
                                        <span className="itemValue">{row['Driver Latitude']}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Longitude: </span>
                                        <span className="itemValue">{row['Driver Longitude']}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey">Documents: </span>
                                        {row?.Documents.map(doc => (
                                            < img src={doc} alt="avatar" className="itemImg" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="right">
                        <div className="featured">
                            <div className="top">
                                <h1 className="title">Total Earning</h1>
                            </div>
                            <div className="bottom">
                                <p className="amount">₦ {totalEarnings}</p>

                                <div className="summary">
                                    <div className="item">
                                        <div className="itemTitle">This Month Earning</div>
                                        <div className="itemResult">
                                            ₦{mData}
                                        </div>
                                        <div className="itemTitle">Last Month Earning</div>
                                        <div className="itemResult">
                                            ₦{lMData}
                                        </div>
                                        <div className="itemTitle">Last 7 Days Earning</div>
                                        <div className="itemResult">
                                            ₦{oData}
                                        </div>
                                        <div className="itemTitle">Last 2 Weeks Earning</div>
                                        <div className="itemResult">
                                            ₦{lWData}
                                        </div>
                                        <div className="itemTitle">Total Trips</div>
                                        <div className="itemResult">
                                            ₦{bookL}
                                        </div>
                                        <div className="itemTitle">Completed Trips</div>
                                        <div className="itemResult">
                                            ₦{earnL}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <h1 className="title">Last Bookings</h1>
                    <div className="b-bottom">
                        <DriverTable id={userID} />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default SingleDriver