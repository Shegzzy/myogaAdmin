import "./bookingDatatable.scss";
import { DataGrid } from '@mui/x-data-grid';
import { bookingColumns, } from "../../datatablesource";
import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect, useRef } from 'react';
import { collection, deleteDoc, doc, onSnapshot, query, where, getDocs, or } from "firebase/firestore";
import { db } from './../../firebase';
import Snakbar from "../snackbar/Snakbar";
import SearchIcon from '@mui/icons-material/Search';

const BookingDatatable = () => {

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [Sdata, setSData] = useState([]);
    const [Search, setSearch] = useState('');

    const snackbarRef = useRef(null);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");

    useEffect(() => {
        // const fetchData = async () =>{
        //   let list = [];
        //   try{

        //     const querySnapshot = await getDocs(collection(db, "Users"));
        //     querySnapshot.forEach((doc) => {
        //       list.push({id: doc.id, ...doc.data()});
        //       console.log(doc.id, " => ", doc.data());
        //     });
        //      setData(list);
        //   }catch(error){
        //     console.log(error);
        //   }
        // };
        // fetchData()

        //Listening to Database
        const unsub = onSnapshot(collection(db, "Bookings"), (snapShot) => {
            let list = [];
            snapShot.docs.forEach(doc => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setData(list);
            setMsg(" Displaying All Bookings ");
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

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "Bookings", id));
            setData(data.filter(item => item.id !== id));
            setMsg("User Deleted Succesfully");
            setType("success");
            snackbarRef.current.show();
        } catch (erre) {
            setMsg(erre.message);
            setType("error");
            snackbarRef.current.show();
        }
    }

    const fetchSearch = async () => {
        const q = query(collection(db, "Bookings"), or(where("Booking Number", "==", Search), where("Customer Phone", "==", Search)));
        let list = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
        setSData(list);
    }

    const actionColumn = [{
        field: "action", headerName: "Action", Width: 250, renderCell: (params) => {
            return (
                <div className="cellAction">
                    <div className="viewButton" onClick={() => navigate(`/bookings/${params.id}`, { replace: true, state: { id: params.id } })}>View</div>
                    <div className="deleteButton" onClick={() => handleDelete(params.row.id)}>Delete</div>
                </div >
            )
        }
    }]

    return (
        <div className='datatable'>
            <Snakbar ref={snackbarRef} message={msg} type={sType} />
            <div className="datatableTitle">
                Add New Booking
                <Link to="/bookings/new" style={{ textDecoration: "none" }} className="link">
                    Add New
                </Link>
            </div>
            <div className="search">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    fetchSearch();
                }} >
                    <input type="text" placeholder="Search Booking Number..." onChange={(e) => { setSearch(e.target.value) }} value={Search} />
                    <SearchIcon />
                </form>
            </div>
            {Sdata.length === 0 ?
                <DataGrid
                    className="datagrid"
                    rows={data}
                    columns={bookingColumns.concat(actionColumn)}
                    pageSize={9}
                    rowsPerPageOptions={[9]}
                    checkboxSelection
                />
                :
                <DataGrid
                    className="datagrid"
                    rows={Sdata}
                    columns={bookingColumns.concat(actionColumn)}
                    pageSize={9}
                    rowsPerPageOptions={[9]}
                    checkboxSelection
                />

            }
        </div>
    )
}

export default BookingDatatable