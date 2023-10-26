import "./driverDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { driverColumns } from "../../datatablesource";
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
  or,
} from "firebase/firestore";
import { db } from "./../../firebase";
import Snakbar from "../snackbar/Snakbar";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import MapModal from "../modal/mapModal";

const DriverDatatable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [Sdata, setSData] = useState([]);
  const [Search, setSearch] = useState("");

  const snackbarRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [sType, setType] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedRiderLocation, setSelectedRiderLocation] = useState(null);
  const [loadScriptKey, setLoadScriptKey] = useState(Date.now());

  useEffect(() => {
    //Listening to Database
    const unsub = onSnapshot(
      collection(db, "Drivers"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        list.sort(
          (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
        );
        setData(list);
        setMsg(" Displaying Users Information ");
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

  const fetchSearch = async () => {
    const q = query(
      collection(db, "Drivers"),
      or(where("FullName", "==", Search), where("Email", "==", Search))
    );
    let list = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
      // doc.data() is never undefined for query doc snapshots
    });
    setSData(list);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Drivers", id));
      setData(data.filter((item) => item.id !== id));
      setMsg("User Deleted Succesfully");
      setType("success");
      snackbarRef.current.show();
    } catch (erre) {
      setMsg(erre.message);
      setType("error");
      snackbarRef.current.show();
    }
  };

  // const handleTrackButtonClick = async (id) => {
  //   try {
  //     const riderRef = doc(db, "Drivers", id);

  //     // Set up a real-time listener for the rider's document
  //     const unsubscribe = onSnapshot(riderRef, (docSnapshot) => {
  //       if (docSnapshot.exists()) {
  //         const riderData = docSnapshot.data();
  //         setSelectedRiderLocation(riderData);
  //         setShowMapModal(true);
  //         setLoadScriptKey(Date.now());
  //       } else {
  //         toast.error("Rider data not found.");
  //       }
  //     });

  //     // Return a function to unsubscribe from the listener when the component unmounts
  //     return () => {
  //       unsubscribe();
  //     };
  //   } catch (error) {
  //     toast.error("Error fetching rider data.");
  //   }
  // };

  // Function to close the map modal
  const handleCloseMapModal = () => {
    setShowMapModal(false);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="viewButton"
              onClick={() =>
                navigate(`/drivers/${params.id}`, {
                  replace: true,
                  state: { id: params.id },
                })
              }
            >
              View
            </div>

            {/* <div
              className="trackButton"
              onClick={() => handleTrackButtonClick(params.row.id)}
            >
              Track Rider
            </div> */}

            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <Snakbar ref={snackbarRef} message={msg} type={sType} />
      <div className="datatableTitle">
        Add New Driver
        <Link
          to="/drivers/new"
          style={{ textDecoration: "none" }}
          className="link"
        >
          Add New
        </Link>
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
            placeholder="Search Driver Name..."
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
          columns={driverColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      ) : (
        <DataGrid
          className="datagrid"
          rows={Sdata}
          columns={driverColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />

      )}

      {showMapModal && (
        <MapModal
          riderLocation={selectedRiderLocation}
          show={showMapModal}
          handleClose={handleCloseMapModal}
          loadScriptKey={loadScriptKey}
        />
      )}
    </div>
  );
};

export default DriverDatatable;
