
import "./statusDatatable.scss";
import { DataGrid } from '@mui/x-data-grid';
import { statusColumns, } from "../../datatablesource";
import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect, useRef } from 'react';
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from './../../firebase';
import Snakbar from "../snackbar/Snakbar";
import ModalContainer from "../modal/ModalContainer";

const StatusDatatable = () => {
    const [data, setData] = useState([]);

    const snackbarRef = useRef(null);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");

    useEffect(() => {

        //Listening to Database
        const unsub = onSnapshot(collection(db, "Order_Status"), (snapShot) => {
            let list = [];
            snapShot.docs.forEach(doc => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setData(list);
            setMsg(" Displaying  Booking Status ");
            setType("success");
            snackbarRef.current.show();
        }, (error) => {
            setMsg(error.message);
            setType("error");
            snackbarRef.current.show();
        });

        return () => {
            unsub();
        }
    }, []);

    // const handleDelete = async (id) => {
    //     try {
    //         await deleteDoc(doc(db, "Order_Status", id));
    //         setData(data.filter(item => item.id !== id));
    //         setMsg("User Deleted Succesfully");
    //         setType("success");
    //         snackbarRef.current.show();
    //     } catch (erre) {
    //         console.log(erre);
    //         setMsg(erre.message);
    //         setType("error");
    //         snackbarRef.current.show();
    //     }
    // }

    const actionColumn = [{
        field: "action", headerName: "Action", Width: 250, renderCell: (params) => {
            return (
                <div className="cellAction">
                    <ModalContainer id={params.row['Booking Number']} />
                </div >
            )
        }
    }]

    return (
        <div className='datatable'>
            <Snakbar ref={snackbarRef} message={msg} type={sType} />
            <div className="datatableTitle">
                Currrent Status of Bookings
                <Link to="/bookings/new" style={{ textDecoration: "none" }} className="link">
                    Add New
                </Link>
            </div>
            <DataGrid
                className="datagrid"
                rows={data}
                columns={statusColumns.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
            />
        </div>
    )
}

export default StatusDatatable