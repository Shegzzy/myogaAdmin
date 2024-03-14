import "./earningDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { earningColumns } from "../../datatablesource";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { collection, deleteDoc, doc, onSnapshot, getDocs, query, where } from "firebase/firestore";
import { db } from "./../../firebase";
import Snakbar from "../snackbar/Snakbar";

const EarningDatatable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const snackbarRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [sType, setType] = useState("");

  useEffect(() => {

    const fetchData = async () => {
      try {
        // Fetch all companies
        const companiesSnapshot = await getDocs(collection(db, "Companies"));
        const companies = companiesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().company,
        }));

        // Fetch earnings for each company
        const totalEarningsPromises = companies.map(async (company) => {
          const earningsQuery = query(
            collection(db, "Earnings"),
            where("Company", "==", company.name)
          );

          const earningsSnapshot = await getDocs(earningsQuery);
          const totalEarnings = earningsSnapshot.docs.reduce((total, doc) => {
            return total + parseFloat(doc.data().Amount);
          }, 0);

          return {
            id: company.id,
            name: company.name,
            totalEarnings: totalEarnings.toFixed(1),
            fifteenPercent: (totalEarnings * 0.15).toFixed(2),
            eightyFivePercent: (totalEarnings * 0.85).toFixed(2),
          };
        });

        const totalEarningsResults = await Promise.all(totalEarningsPromises);
        setData(totalEarningsResults);

        setMsg(" Displaying Earnings Information ");
        setType("success");
        snackbarRef.current.show();
      } catch (error) {
        console.error("Error fetching data:", error);
        setMsg(error.message);
        setType("error");
        snackbarRef.current.show();
      }
    };

    //Listening to Database
    // const unsub = onSnapshot(
    //   collection(db, "Earnings"),
    //   (snapShot) => {
    //     let list = [];
    //     snapShot.docs.forEach((doc) => {
    //       list.push({ id: doc.id, ...doc.data() });
    //     });
    //     list.sort(
    //       (a, b) => new Date(b["DateCreated"]) - new Date(a["DateCreated"])
    //     );
    //     setData(list);
    //     setMsg(" Displaying Earnings Information ");
    //     setType("success");
    //     snackbarRef.current.show();
    //   },
    //   (error) => {
    //     setMsg(error.message);
    //     setType("error");
    //     snackbarRef.current.show();
    //   }
    // );

    fetchData();
    // return () => {
    //   unsub();
    // };
  }, []);

  const companyEarningColumns = [
    {
      field: 'company',
      headerName: 'Company',
      width: 150,
      renderCell: (params) => (
        <Link
          to={{
            pathname: `/company/${params.row.id}`,
            replace: true,
            state: { id: params.row.id },
          }}
        >{params.row.name}</Link>
      ),
    },
    { field: 'totalEarnings', headerName: 'Total Earnings', width: 150, },
    { field: 'fifteenPercent', headerName: '15% of Total Earnings', width: 200 },
    { field: 'eightyFivePercent', headerName: '85% of Total Earnings', width: 200 },
  ];

  return (
    <div className="datatable">
      <Snakbar ref={snackbarRef} message={msg} type={sType} />
      <div className="datatableTitle">
        Earnings Table

        <div className="filter-select-container">
          <select
            className="chart-selects"
          // value={selectedFilter}
          // onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="7">Last Week</option>
            <option value="1">Two Weeks Ago</option>
            <option value="2">Three Weeks Ago</option>
            <option value="3">Four Weeks Ago</option>
          </select>
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={companyEarningColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default EarningDatatable;
