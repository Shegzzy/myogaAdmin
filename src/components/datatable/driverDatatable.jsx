import "./driverDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { driverColumns } from "../../datatablesource";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { db } from "./../../firebase";
import Snakbar from "../snackbar/Snakbar";
import SearchIcon from "@mui/icons-material/Search";

const DriverDatatable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [holdingRider, setHoldingRider] = useState(false);
  const [releasingRider, setReleasingRider] = useState(false);

  const snackbarRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [sType, setType] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");


  useEffect(() => {
    const fetchData = async () => {
      let startOfPeriod, endOfPeriod;

      try {
        setLoading(true);
        if (selectedFilter === "all") {
          const querySnapshot = await getDocs(
            query(collection(db, "Drivers"),
            where("Verified", "in", ["1", "Hold"]),
            )
          );
          let list = [];

          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data(), documents: Array.isArray(doc.data().Documents) ? doc.data().Documents : [], });
          });

          list.sort((a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"]));

          setData(list);
          setMsg("Displaying All Riders");
          setType("success");
          snackbarRef.current.show();
        } else {
          const today = new Date();

          // Calculate the start and end dates based on the selected filter
          if (selectedFilter === "7") {
            // Last Week
            startOfPeriod = new Date(today);
            startOfPeriod.setDate(today.getDate() - today.getDay() - 7);
            endOfPeriod = new Date(today);
            endOfPeriod.setDate(today.getDate() - today.getDay() - 1);
          } else if (selectedFilter === "1") {
            // Two Weeks Ago
            startOfPeriod = new Date(today);
            startOfPeriod.setDate(today.getDate() - today.getDay() - 14);
            endOfPeriod = new Date(today);
            endOfPeriod.setDate(today.getDate() - today.getDay() - 8);
          } else if (selectedFilter === "2") {
            // Three Weeks Ago
            startOfPeriod = new Date(today);
            startOfPeriod.setDate(today.getDate() - today.getDay() - 21);
            endOfPeriod = new Date(today);
            endOfPeriod.setDate(today.getDate() - today.getDay() - 15);
          } else if (selectedFilter === "3") {
            // Four Weeks Ago
            startOfPeriod = new Date(today);
            startOfPeriod.setDate(today.getDate() - today.getDay() - 28);
            endOfPeriod = new Date(today);
            endOfPeriod.setDate(today.getDate() - today.getDay() - 22);
          } else if (selectedFilter === "30") {
            // Last Month
            startOfPeriod = new Date(today);
            startOfPeriod.setMonth(today.getMonth() - 1, 1);
            startOfPeriod.setHours(0, 0, 0, 0);
            endOfPeriod = new Date(startOfPeriod.getFullYear(), startOfPeriod.getMonth() + 1, 0);
            // endOfPeriod.setHours(23, 59, 59, 999);
          } else if (selectedFilter === "60") {
            // Two Months Ago
            startOfPeriod = new Date(today);
            startOfPeriod.setMonth(today.getMonth() - 2, 1);
            startOfPeriod.setHours(0, 0, 0, 0);
            endOfPeriod = new Date(today);
            endOfPeriod.setMonth(today.getMonth() - 1, 0);

          }

          const querySnapshot = await getDocs(query(
            collection(db, "Drivers"),
            where("Verified", "in", ["1", "Hold"]),
            where("Date Created", ">=", startOfPeriod.toISOString()),
            where("Date Created", "<=", endOfPeriod.toISOString())
          ));
          let list = [];

          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data(), documents: Array.isArray(doc.data().Documents) ? doc.data().Documents : [], });
          });

          list.sort((a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"]));

          setData(list);

        }
      } catch (error) {
        console.log(error);
        setMsg(error.message);
        setType("error");
        snackbarRef.current.show();
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => { };
  }, [selectedFilter]);


  // Function to search for riders
  const handleSearch = async () => {
    if (search.trim() === '') {
      const querySnapshot = await getDocs(query(collection(db, "Drivers"), where("Verified", "in", ["1", "Hold"])),
    );
      let list = [];

      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data(), documents: Array.isArray(doc.data().Documents) ? doc.data().Documents : [], });
      });

      list.sort((a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"]));

      setData(list);
      setMsg("Displaying All Riders");
      setType("success");
      snackbarRef.current.show();
    } else {
      const filteredData = data.filter((riderName) => {
        const name = riderName['FullName']?.toLowerCase() ?? "";
        return name.includes(search?.toLowerCase() ?? "");
      });

      if (filteredData.length === 0) {
        setMsg('No search results found.');
        setType("error");
        snackbarRef.current.show();
      }

      setData(filteredData);
    }
  };

  // function for holding a rider
  const handleRiderHold = async (id) => {
    setHoldingRider(true);

    try {
      const riderRef = doc(db, "Drivers", id);
      await updateDoc(riderRef, { Verified: "Hold" });

      const querySnapshot = await getDocs(query(collection(db, "Drivers"), where("Verified", "in", ["1", "Hold"])));
      let list = [];

      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data(), documents: Array.isArray(doc.data().Documents) ? doc.data().Documents : [], });
      });

      list.sort((a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"]));

      setData(list);
      setMsg("Rider is now on hold");
      setType("success");
      snackbarRef.current.show();
    } catch (e) {
      console.log(e);
      setMsg("Holding rider failed");
      setType("error");
      snackbarRef.current.show();
    } finally {
      setHoldingRider(false);
    }
  }

  // function for releasing a rider
  const handleRiderRelease = async (id) => {
    setReleasingRider(true);

    try {
      const riderRef = doc(db, "Drivers", id);
      await updateDoc(riderRef, { Verified: "1" });

      const querySnapshot = await getDocs(query(collection(db, "Drivers"), where("Verified", "in", ["1", "Hold"])));
      let list = [];

      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data(), documents: Array.isArray(doc.data().Documents) ? doc.data().Documents : [], });
      });

      list.sort((a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"]));

      setData(list);
      setMsg("Rider is now released");
      setType("success");
      snackbarRef.current.show();
    } catch (e) {
      console.log(e);
      setMsg("Rider release failed");
      setType("success");
      snackbarRef.current.show();
    } finally {
      setReleasingRider(false); 
    }
  }

  useEffect(() => {
    handleSearch();
  }, [search]);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 170,
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

              {
                params.row.Verified === '1' ? 
                  <div
                className="trackButton"
                onClick={() => handleRiderHold(params.row.id)}
              >
                {holdingRider ? "holding rider..." : "Hold Rider"}
              </div> :
              <div
                className="trackButton"
                onClick={() => handleRiderRelease(params.row.id)}
              >
                { releasingRider ? " releasing rider..." : "Release Rider"}
              </div>
              }
            
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <Snakbar ref={snackbarRef} message={msg} type={sType} />
      <div className="datatableTitle">
        Riders

        <div className="search">
          <input
            type="text"
            placeholder="Search rider's name..."
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search}
          />
          <SearchIcon />
        </div>

        <div className="filter-select-container">
          <select
            className="chart-selects"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="7">Last Week</option>
            <option value="1">Two Weeks Ago</option>
            <option value="2">Three Weeks Ago</option>
            <option value="3">Four Weeks Ago</option>
            <option value="30">Last Month</option>
            <option value="60">Two Months Ago</option>
          </select>
        </div>

      </div>

      {!loading ? (
        <DataGrid
          className="datagrid"
          rows={data}
          columns={driverColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
        // checkboxSelection
        />
      ) : (<div className="detailItem">
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
      </div>)
      }

    </div >
  );
};

export default DriverDatatable;
