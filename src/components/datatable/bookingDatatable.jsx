import "./bookingDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { bookingColumns } from "../../datatablesource";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
  getDoc,
  or,
} from "firebase/firestore";
import { db } from "./../../firebase";
import Snakbar from "../snackbar/Snakbar";
import SearchIcon from "@mui/icons-material/Search";

const BookingDatatable = () => {
  //   const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [Sdata, setSData] = useState([]);
  const [Search, setSearch] = useState("");

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
    const unsub = onSnapshot(
      collection(db, "Bookings"),
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
    );

    return () => {
      unsub();
    };
  }, []);

  // const handleDelete = async (id) => {
  //   try {
  //     await deleteDoc(doc(db, "Bookings", id));
  //     setData(data.filter((item) => item.id !== id));
  //     setMsg("User Deleted Succesfully");
  //     setType("success");
  //     snackbarRef.current.show();
  //   } catch (erre) {
  //     setMsg(erre.message);
  //     setType("error");
  //     snackbarRef.current.show();
  //   }
  // };

  const fetchSearch = async () => {
    const q = query(
      collection(db, "Bookings"),
      or(
        where("Booking Number", "==", Search),
        where("Customer Phone", "==", Search)
      )
    );
    let list = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
    setSData(list);
  };

  // const actionColumn = [
  //   {
  //     field: "action",
  //     headerName: "Action",
  //     Width: 250,
  //     renderCell: (params) => {
  //       return (
  //         <div className="cellAction">
  //           {/* <div className="viewButton" onClick={() => navigate(`/bookings/${params.id}`, { replace: true, state: { id: params.id } })}>View</div> */}
  //           <div
  //             className="deleteButton"
  //             onClick={() => handleDelete(params.row.id)}
  //           >
  //             Delete
  //           </div>
  //         </div>
  //       );
  //     },
  //   },
  // ];

  return (
    <div className="datatable">
      <Snakbar ref={snackbarRef} message={msg} type={sType} />
      <div className="datatableTitle">
        AllBookings
      </div>
      <div className="search">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchSearch();
          }}
        >
          <input
            type="text"
            placeholder="Search Booking Number..."
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={Search}
          />
          <SearchIcon />
        </form>
      </div>
      {Sdata.length === 0 ? (
        <DataGrid
          className="datagrid"
          rows={data}
          columns={bookingColumns}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      ) : (
        <DataGrid
          className="datagrid"
          rows={Sdata}
          columns={bookingColumns}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      )}
    </div>
  );
};

export default BookingDatatable;
