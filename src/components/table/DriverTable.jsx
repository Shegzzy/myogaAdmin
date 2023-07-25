import './driverTable.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { getDocs, where, query, collection } from "firebase/firestore";
import { db } from './../../firebase';

const DriverTable = (props) => {

    const [data, setData] = useState([]);
    const bookID = props.id;

    useEffect(() => {
        //Listening to Database
        fetchBooking();
    });

    const fetchBooking = async () => {
        try {
            const booking = [];
            const q = query(collection(db, "Bookings"), where("Driver ID", "==", bookID));
            const docSnap = await getDocs(q);
            docSnap.forEach((doc) => {
                booking.push({ id: doc.id, ...doc.data() });
            });
            setData(booking);
        } catch (error) {
            alert("Error", error.message);
        }
    };

    return (
        <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className="tableCell">Booking Number</TableCell>
                        <TableCell className="tableCell">Customer</TableCell>
                        <TableCell className="tableCell">Phone</TableCell>
                        <TableCell className="tableCell">Pick Up</TableCell>
                        <TableCell className="tableCell">Drop Off</TableCell>
                        <TableCell className="tableCell">Distance</TableCell>
                        <TableCell className="tableCell">Amount</TableCell>
                        <TableCell className="tableCell">Payment Method</TableCell>
                        <TableCell className="tableCell">Status</TableCell>
                        <TableCell className="tableCell">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="tableCell" >{row['Booking Number']}</TableCell>
                            <TableCell className="tableCell" >{row['Customer Name']}</TableCell>
                            <TableCell className="tableCell" >{row['Customer Phone']}</TableCell>
                            <TableCell className="tableCell" >{row['PickUp Address']}</TableCell>
                            <TableCell className="tableCell" >{row['DropOff Address']}</TableCell>
                            <TableCell className="tableCell" >{row.Distance}</TableCell>
                            <TableCell className="tableCell" >{row.Amount}</TableCell>
                            <TableCell className="tableCell" >{row['Payment Method']}</TableCell>
                            <TableCell className="tableCell">
                                <span className={`status ${row.Status}`}>{row.Status}</span>
                            </TableCell>
                            <TableCell className="tableCell" >{row['Date Created']}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DriverTable