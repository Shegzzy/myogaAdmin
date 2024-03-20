import "./statusDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { statusColumns } from "../../datatablesource";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { collection, deleteDoc, doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "./../../firebase";
import Snakbar from "../snackbar/Snakbar";
import ModalContainer from "../modal/ModalContainer";

const StatusDatatable = () => {
  const [data, setData] = useState([]);

  const snackbarRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [sType, setType] = useState("");

  useEffect(() => {
    // Listening to Database
    const unsub = onSnapshot(
      collection(db, "Order_Status"),
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
              driverMap.delete(driverID); // Remove non-existing driver ID from the map
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
              userMap.delete(userID); // Remove non-existing user ID from the map
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

        // Sort the list
        list.sort(
          (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
        );

        // Update state with the final list
        setData(list);
        setMsg("Displaying Booking Status");
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

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      Width: 250,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <ModalContainer id={params.row["Booking Number"]} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <Snakbar ref={snackbarRef} message={msg} type={sType} />
      <div className="datatableTitle">
        Currrent Status of Bookings
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
  );
};

export default StatusDatatable;
