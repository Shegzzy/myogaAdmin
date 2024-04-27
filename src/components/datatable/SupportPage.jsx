import './supportPage.scss';
import SupportCard from '../support/SupportCard';
import React, { useState, useEffect } from 'react';
import { collection, where, query, getDocs } from "firebase/firestore";
import { db } from '../../firebase';
import ViewSupport from '../modal/ViewSupport';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import TablePagination from '@mui/material/TablePagination';
import { format } from 'date-fns';


const SupportPage = () => {

    const [data, setSData] = useState([]);
    const [attendedData, setAttendedData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [activeTab, setActiveTab] = useState("new");


    useEffect(() => {
        fetchSupport();
        fetchAttendedSupport();
    }, []);

    const fetchSupport = async () => {
        const unsub = query(
            collection(db, "supportTickets"),
            where("status", "==", "new"),);

        const supportData = await getDocs(unsub);
        let list = [];
        // const support = supportData.docs.map((supportDoc) => supportDoc.data());
        supportData.forEach((support) => {
            list.push({ id: support.id, ...support.data() });

        });

        list.sort(
            (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
        );

        setSData(list);


        return () => {
            unsub();
        }
    }

    const fetchAttendedSupport = async () => {
        const unsub = query(
            collection(db, "supportTickets"),
            where("status", "==", "attended"),);

        const supportData = await getDocs(unsub);
        let list = [];
        supportData.forEach((support) => {
            list.push({ id: support.id, ...support.data() });
        });

        list.sort(
            (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
        );

        setAttendedData(list);


        return () => {
            unsub();
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const switchToRiders = () => {
        setTimeout(() => {
            setActiveTab("new")
        })
    }

    const switchToEarnings = () => {
        setTimeout(() => {
            setActiveTab("attended")
        })
    }


    return (
        <div className='support-page'>
            <div className="s-top">
                <div className="s-title">
                    Supports
                </div>
            </div>
            <div className="s-bottom">
                <div className="table-navs">
                    {/* Riders tab */}
                    <h1 className={`title ${activeTab === "new" ? "active" : ""}`} onClick={switchToRiders}>
                        New
                    </h1>

                    {/* Earnings tab */}
                    <h1 className={`title ${activeTab === "attended" ? "active" : ""}`} onClick={switchToEarnings}>
                        Attended
                    </h1>
                </div>

                {activeTab === "new" && (<TableContainer component={Paper} className="table">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className="tableCell">Name</TableCell>
                                <TableCell className="tableCell">Email</TableCell>
                                <TableCell className="tableCell">Subject </TableCell>
                                <TableCell className="tableCell">Type</TableCell>
                                <TableCell className="tableCell">Status</TableCell>
                                <TableCell className="tableCell">Date Created</TableCell>
                                <TableCell className="tableCell">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {data.length !== 0 ? (
                                data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="tableCell">
                                            {row.name}
                                        </TableCell>
                                        <TableCell className="tableCell">{row.email}</TableCell>
                                        <TableCell className="tableCell">{row.subject}</TableCell>
                                        <TableCell className="tableCell">{row.type}</TableCell>
                                        <TableCell className="tableCell">{row.status}</TableCell>

                                        <TableCell className="tableCell">
                                            {format(new Date(row.dateCreated), 'dd/MM/yyyy')}
                                        </TableCell>

                                        <TableCell className="tableCell">
                                            <ViewSupport
                                                id={row.id}
                                                name={row.name}
                                                subject={row.subject}
                                                type={row.type}
                                                ticket={row.ticket}
                                                date={row.dateCreated}
                                                message={row.message}
                                                status={row.status}
                                                email={row.email} />
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
                </TableContainer>)}
                {activeTab === "new" && (<TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />)}

                {activeTab === "attended" && (<TableContainer component={Paper} className="table">
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className="tableCell">Name</TableCell>
                                <TableCell className="tableCell">Email</TableCell>
                                <TableCell className="tableCell">Subject </TableCell>
                                <TableCell className="tableCell">Type</TableCell>
                                <TableCell className="tableCell">Status</TableCell>
                                <TableCell className="tableCell">Attended Date</TableCell>
                                <TableCell className="tableCell">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {attendedData.length !== 0 ? (
                                attendedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="tableCell">
                                            {row.name}
                                        </TableCell>
                                        <TableCell className="tableCell">{row.email}</TableCell>
                                        <TableCell className="tableCell">{row.subject}</TableCell>
                                        <TableCell className="tableCell">{row.type}</TableCell>
                                        <TableCell className="tableCell">{row.status}</TableCell>

                                        <TableCell className="tableCell">
                                            {new Date(row.timeStamp.seconds * 1000).toLocaleString()}
                                        </TableCell>

                                        <TableCell className="tableCell">
                                            <ViewSupport
                                                id={row.id}
                                                name={row.name}
                                                subject={row.subject}
                                                type={row.type}
                                                ticket={row.ticket}
                                                date={row.dateCreated}
                                                message={row.message}
                                                status={row.status}
                                                email={row.email} />
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
                </TableContainer>)}
                {activeTab === "attended" && (<TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    component="div"
                    count={attendedData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />)}
            </div>

        </div>
    )
}

export default SupportPage