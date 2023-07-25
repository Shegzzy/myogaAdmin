import "./table.scss"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from './../../firebase';

const TableJ = () => {

    const [data, setData] = useState([]);

    useEffect(() => {

        //Listening to Database
        const unsub = onSnapshot(collection(db, "Bookings"), (snapShot) => {
            let list = [];
            snapShot.docs.forEach(doc => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setData(list);

        }, (error) => {
            alert("Error", error.message);
        });

        return () => {
            unsub();
        }
    }, []);


    return (<TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
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
    </TableContainer>)
}

export default TableJ
