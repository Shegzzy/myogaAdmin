import "../featured/featured.scss";
import { useState, useEffect } from "react";
import {
    collection,
    getDocs,
    where,
    query,
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

            // Split usersIds into chunks of 30 or fewer IDs
            const chunks = [];
            for (let i = 0; i < usersIds.length; i += 30) {
                chunks.push(usersIds.slice(i, i + 30));
            }

            // Perform queries for each chunk of usersIds
            for (const chunk of chunks) {
                const bookingsQuery = query(
                    collection(db, "Bookings"),
                    where("Customer ID", "in", chunk),
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
                        usersBookingsInfo[customerId].userName = userData.FullName;
                    }
                });
            }

            setUserData(usersBookingsInfo);
        };

        getUser();
    }, []);



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
                            .filter(userId => userData[userId].bookingCount >= 5)
                            .map(userId => {
                                const userEntry = userData[userId];
                                return {
                                    userId: userId,
                                    userName: userEntry.userName,
                                    bookingCount: userEntry.bookingCount
                                };
                            })
                            .sort((a, b) => b.bookingCount - a.bookingCount)
                            .slice(0, 50)
                            .map((user, index) => (
                                <tr key={user.userId} className="user-entry">
                                    <td>{user.userName}</td>
                                    <td>{user.bookingCount}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

};



export default TopUsers;