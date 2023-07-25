import "./singleCompany.scss"
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
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
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

const SingleCompany = (props) => {

    const location = useLocation();
    const userID = location.state.id;
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [rData, setRData] = useState(null);
    const [riderL, setRiderL] = useState(null);
    const [earnL, setEarnL] = useState(null);
    const [oData, setOData] = useState([]);
    const [lWData, setLWData] = useState([]);
    const [lMData, setLData] = useState([]);
    const [mData, setMData] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);

    useEffect(() => {
        fetchUser();
        getEarnings();
        getData();
        getRiders();
    });

    const fetchUser = async () => {
        try {
            const profile = [];
            const docRef = doc(db, "Companies", userID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                profile.push({ id: docSnap.id, ...docSnap.data() })
                setUser(profile);
                setName(docSnap.data().company);
            } else {
                alert("No such document!");
            }
        } catch (error) {
            alert(error);
        }
    }

    const getEarnings = async () => {
        let isMounted = true;

        const bookingsQuery = query(
            collection(db, "Earnings"),
            where("Company", "==", name)
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
            where("Company", "==", name),
            where("DateCreated", ">=", firstDayOfMonth.toISOString()),
            where("DateCreated", "<=", today.toISOString())
        );

        //Last Month's Earning Query
        const lastMonthQuery = query(
            collection(db, "Earnings"),
            where("Company", "==", name),
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
            where("Company", "==", name),
            where("timeStamp", "<=", today),
            where("timeStamp", ">", oneWeekAgo)
        );

        //Two weeks ago
        const twoWeekQuery = query(
            collection(db, "Earnings"),
            where("Company", "==", name),
            where("timeStamp", "<=", oneWeekAgo),
            where("timeStamp", ">", twoWeekAgo)
        );


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

    const getRiders = async () => {
        let isMounted = true;

        const bookingsQuery = query(
            collection(db, "Drivers"),
            where("Company", "==", name)
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
                setRData(bookingsData);
                setRiderL(snapshot.docs.length);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }

    return (
        <div className='singleCompany'>
            <Sidebar />
            <div className="singleCompanyContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <div className="editButton">
                            <Link to={`/editcompany/${userID}`} style={{ textDecoration: "none" }}>
                                Edit
                            </Link>
                        </div>

                        <h1 className="title">Information</h1>
                        {user ? (
                            user.map((row) => (
                                <div className="item">
                                    <img src={row["Profile Photo"]} alt="" className="itemImg" />
                                    <div className="details">
                                        <h1 className="itemTitle">{row.company}</h1>
                                        <div className="detailItem">
                                            <span className="itemKey">Email:</span>
                                            <span className="itemValue">{row.email}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Phone:</span>
                                            <span className="itemValue">{row.phone}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Address:</span>
                                            <span className="itemValue">{row.address}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">State:</span>
                                            <span className="itemValue">{row.location}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">CAC Reg Number:</span>
                                            <span className="itemValue">{row.regnumber}</span>
                                        </div>
                                        <div className="detailItem">
                                            <span className="itemKey">Date Joined:</span>
                                            <span className="itemValue">{row.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
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
                    <div className="right">
                        <div className="featured">
                            <div className="top">
                                <h1 className="title">Total Earning</h1>
                            </div>
                            <div className="bottom">
                                <p className="amount">₦ {totalEarnings}</p>
                                <div className="summary">
                                    <div className="item">
                                        <div className="itemTitle">This Month</div>
                                        <div className="itemResult positive">
                                            <KeyboardArrowUpOutlinedIcon
                                                fontSize="small"
                                                style={{ color: "green" }}
                                            />
                                            <div className="resultAmount"
                                                style={{ color: "green" }}
                                            >
                                                ₦{mData}
                                            </div>
                                        </div>
                                        <div className="itemTitle">Total Trips</div>
                                        <div className="itemResult positive">
                                            <KeyboardArrowUpOutlinedIcon
                                                fontSize="small"
                                                style={{ color: "green" }}
                                            />
                                            <div className="resultAmount"
                                                style={{ color: "green" }}
                                            >
                                                {earnL}
                                            </div>
                                        </div>
                                        <div className="itemTitle">Total Riders</div>
                                        <div className="itemResult positive">
                                            <KeyboardArrowUpOutlinedIcon
                                                fontSize="small"
                                                style={{ color: "green" }}
                                            />
                                            <div className="resultAmount"
                                                style={{ color: "green" }}
                                            >
                                                {riderL}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <h1 className="title">Riders</h1>
                    <TableContainer component={Paper} className="table">
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="tableCell">Rider Name</TableCell>
                                    <TableCell className="tableCell">Email</TableCell>
                                    <TableCell className="tableCell">Address</TableCell>
                                    <TableCell className="tableCell">Location </TableCell>
                                    <TableCell className="tableCell">Vehicle Number</TableCell>
                                    <TableCell className="tableCell">Status</TableCell>
                                    <TableCell className="tableCell">Date Joined</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rData ? (
                                    rData.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="tableCell">
                                                {row.FullName}
                                            </TableCell>
                                            <TableCell className="tableCell">
                                                {row.Email}
                                            </TableCell>
                                            <TableCell className="tableCell">
                                                {row.Address}
                                            </TableCell>
                                            <TableCell className="tableCell">
                                                {row.State}
                                            </TableCell>
                                            <TableCell className="tableCell" width={200}>
                                                {row["Vehicle Number"]}
                                            </TableCell>
                                            <TableCell className="tableCell">
                                                {row.Verified === "1" ? "Verified" : "Unverified"}
                                            </TableCell>
                                            <TableCell className="tableCell">
                                                {new Date(row["Date Created"]).toLocaleDateString(
                                                    "en-US"
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            No data available.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div >
    )
}

export default SingleCompany