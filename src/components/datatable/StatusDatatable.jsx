import "./statusDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { statusColumns } from "../../datatablesource";
// import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "./../../firebase";
import Snakbar from "../snackbar/Snakbar";
import SearchIcon from "@mui/icons-material/Search";
import ModalContainer from "../modal/ModalContainer";

const StatusDatatable = () => {
  const [data, setData] = useState([]);

  const snackbarRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [sType, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBookingStatus = async () => {
      try {
        setLoading(true);

        const querySnapshot = await getDocs(query(
          collection(db, "Order_Status"),
        ));

        let list = [];
        const driverMap = new Map();
        const userMap = new Map();

        // Fetch driver and user IDs
        querySnapshot.forEach((doc) => {
          const { "Driver ID": driverID, "Customer ID": customerID } = doc.data();
          userMap.set(customerID, "");
          driverMap.set(driverID, "");
        });


        // Populate driver names
        await Promise.all(Array.from(driverMap.keys()).map(async (driverID) => {
          try {
            const driverDoc = await getDoc(doc(db, "Drivers", driverID));
            if (driverDoc.exists()) {
              const driverName = driverDoc.data().FullName;
              driverMap.set(driverID, driverName);
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
              userMap.delete(userID); // Remove non-existing user ID from the map
            }
          } catch (error) {
            console.error(`Error fetching user with ID ${userID}: ${error}`);
            // Handle error (e.g., show error message)
          }
        }));

        querySnapshot.forEach((docs) => {
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
      } catch (error) {
        setMsg(error.message);
        setType("error");
        snackbarRef.current.show();
      } finally {
        setLoading(false);
      }
    }

    fetchBookingStatus();
  }, []);

  // Function to search for riders
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      try {
        setLoading(true);

        const querySnapshot = await getDocs(
          collection(db, "Order_Status"),
        );

        let list = [];
        const driverMap = new Map();
        const userMap = new Map();

        // Fetch driver and user IDs
        querySnapshot.forEach((doc) => {
          const { "Driver ID": driverID, "Customer ID": customerID } = doc.data();
          userMap.set(customerID, "");
          driverMap.set(driverID, "");
        });


        // Populate driver names
        await Promise.all(Array.from(driverMap.keys()).map(async (driverID) => {
          try {
            const driverDoc = await getDoc(doc(db, "Drivers", driverID));
            if (driverDoc.exists()) {
              const driverName = driverDoc.data().FullName;
              driverMap.set(driverID, driverName);
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
              userMap.delete(userID); // Remove non-existing user ID from the map
            }
          } catch (error) {
            console.error(`Error fetching user with ID ${userID}: ${error}`);
            // Handle error (e.g., show error message)
          }
        }));

        querySnapshot.forEach((docs) => {
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
      } catch (error) {
        setMsg(error.message);
        setType("error");
        snackbarRef.current.show();
      } finally {
        setLoading(false);
      }
    } else {
      const filteredData = data.filter((bookingNumber) => {
        const name = bookingNumber['Booking Number']?.toLowerCase() ?? "";
        return name.includes(searchTerm?.toLowerCase() ?? "");
      });

      if (filteredData.length === 0) {
        setMsg('No search results found.');
        setType("error");
        snackbarRef.current.show();
      }

      setData(filteredData);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);


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

        <div className="search">
          <input
            type="text"
            placeholder="Search Booking Number..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            value={searchTerm}
          />
          <SearchIcon />
        </div>
      </div>
      {!loading ? (<DataGrid
        className="datagrid"
        rows={data}
        columns={statusColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
      />) : (<div className="detailItem">
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
      </div>)}
    </div>
  );
};

export default StatusDatatable;
