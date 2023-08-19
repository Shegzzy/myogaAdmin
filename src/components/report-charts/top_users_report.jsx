import "../featured/featured.scss";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useState, useEffect } from "react";
import {
    collection,
    getDocs,
    where,
    query,
    getDoc,
    doc,
} from "firebase/firestore";
import { db } from "../../firebase";

const TopUsers = () => {
    const [userData, setUserData] = useState([]);
    useEffect(() => {

        const getUser = async () => {
            const usersBookingsInfo = {};

            const usersQuery = query(
                collection(db, "Users"),
            );
            const usersSnapshot = await getDocs(usersQuery);

            // Collecting Users IDs
            const usersIds = usersSnapshot.docs.map((usersDoc) => usersDoc.id);

            const bookingsQuery = query(
                collection(db, "Bookings"),
                where("Customer ID", "in", usersIds),
            );

            const bookingSnapshot = await getDocs(bookingsQuery);

            // Count the bookings and store user information
            bookingSnapshot.forEach((bookingDoc) => {
                const bookingData = bookingDoc.data();
                const customerId = bookingData["Customer ID"];

                if (!usersBookingsInfo[customerId]) {
                    usersBookingsInfo[customerId] = {
                        bookingCount: 0,
                        userName: "",
                    };
                }

                usersBookingsInfo[customerId].bookingCount++;

                // Fetch user name from the usersSnapshot
                const userDoc = usersSnapshot.docs.find((userDoc) => userDoc.id === customerId);
                if (userDoc) {
                    const userData = userDoc.data();
                    usersBookingsInfo[customerId].userName = userData.FullName; // Replace with the actual field name for user name
                }
            });
            setUserData(usersBookingsInfo);
        };

        getUser();
    });


    return (
        <div className="featured">
            <div className="top">
                <h1 className="title">Top 50 Users</h1>
            </div>
            <div className="bottom">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Booking Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(userData)
                            .filter(userId => userData[userId].bookingCount > 5)
                            .slice(0, 50)
                            .map(userId => {
                                const userEntry = userData[userId];
                                return (
                                    <tr key={userId} className="user-entry">
                                        <td>{userEntry.userName}</td>
                                        <td>{userEntry.bookingCount}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );

};



export default TopUsers;