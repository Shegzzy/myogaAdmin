import "./companyDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { companyColumns, companyRows } from "../../datatablesource";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { collection, deleteDoc, doc, onSnapshot, getDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./../../firebase";
import Snakbar from "../snackbar/Snakbar";

const CompanyDatatable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

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
      collection(db, "Companies"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        list.sort((a, b) => new Date(b["date"]) - new Date(a["date"]));
        setData(list);
        setMsg(" Displaying Companies Information ");
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

  const handleHold = async (id) => {
    try {
      const companyDoc = await getDoc(doc(db, "Companies", id));
      const companyName = companyDoc.data().company;

      const ridersQuery = query(collection(db, "Drivers"), where("Company", "==", companyName));
      const companyRiders = await getDocs(ridersQuery);

      const updatePromises = companyRiders.docs.map(async (rider) => {
        // console.log(rider.id);
        const riderRef = doc(db, "Drivers", "0PHY9I8OhahJHiNhlr2sv7CV5rL2");
        await updateDoc(riderRef, { Verified: "1" });
      });

      await Promise.all(updatePromises);

      setMsg(`${companyName} is now on hold`);
      setType("success");
      snackbarRef.current.show();
    } catch (error) {
      setMsg(error.message);
      setType("error");
      snackbarRef.current.show();
    }
  };


  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="viewButton"
              onClick={() =>
                navigate(`/company/${params.id}`, {
                  replace: true,
                  state: { id: params.id },
                })
              }
            >
              View
            </div>
            <div
              className="deleteButton"
              onClick={() => handleHold(params.row.id)}
            >
              Hold
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
        Company
        {/* <Link
          to="/company/new"
          style={{ textDecoration: "none" }}
          className="link"
        >
          Add New
        </Link> */}
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={companyColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
      // checkboxSelection
      />
    </div>
  );
};

export default CompanyDatatable;
