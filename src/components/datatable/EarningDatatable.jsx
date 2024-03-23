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
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);



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
            totalEarnings: totalEarnings.toFixed(0),
            fifteenPercent: (totalEarnings * 0.15).toFixed(0),
            eightyFivePercent: (totalEarnings * 0.85).toFixed(0),
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

    fetchData();

  }, []);

  // Function for weekly query
  useEffect(() => {
    let isMounted = true;
    let earningsTotal = 0;
    let sumCardPayments = 0;
    let sumCashPayments = 0;
    let totalPayOut = 0;
    let totalReceive = 0;
    let startOfPeriod, endOfPeriod;


    const fetchDataByWeek = async () => {
      if (isMounted) {
        try {
          setLoading(true);

          if (selectedFilter === "all") {
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
                totalEarnings: totalEarnings.toFixed(0),
                fifteenPercent: (totalEarnings * 0.15).toFixed(0),
                eightyFivePercent: (totalEarnings * 0.85).toFixed(0),
              };
            });

            const totalEarningsResults = await Promise.all(totalEarningsPromises);

            if (isMounted) {
              setData(totalEarningsResults);
            }
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

            console.log('Start of period: ' + startOfPeriod);
            console.log('End of period: ' + endOfPeriod);

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
                where("Company", "==", company.name),
                where("DateCreated", ">=", startOfPeriod.toISOString()),
                where("DateCreated", "<=", endOfPeriod.toISOString())
              );

              const earningsSnapshot = await getDocs(earningsQuery);
              const totalEarnings = earningsSnapshot.docs.reduce((total, doc) => {
                return total + parseFloat(doc.data().Amount);
              }, 0);

              return {
                id: company.id,
                name: company.name,
                totalEarnings: totalEarnings.toFixed(0),
                fifteenPercent: (totalEarnings * 0.15).toFixed(0),
                eightyFivePercent: (totalEarnings * 0.85).toFixed(0),
              };
            });

            const totalEarningsResults = await Promise.all(totalEarningsPromises);

            if (isMounted) {
              setData(totalEarningsResults);
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDataByWeek();
    return () => {
      isMounted = false;
    };
  }, [selectedFilter]);

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

    {
      field: 'totalEarnings', headerName: 'Total Earnings', width: 150, renderCell: (params) => {
        return (
          <div className='cellStatus'>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            })
              .format(params.row.totalEarnings)
              .replace(".00", "")}
          </div>
        )
      }
    },

    {
      field: 'fifteenPercent', headerName: '15% of Total Earnings', width: 200, renderCell: (params) => {
        return (
          <div className='cellStatus'>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            })
              .format(params.row.fifteenPercent)
              .replace(".00", "")}
          </div>
        )
      }
    },

    {
      field: 'eightyFivePercent', headerName: '85% of Total Earnings', width: 200, renderCell: (params) => {
        return (
          <div className='cellStatus'>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            })
              .format(params.row.eightyFivePercent)
              .replace(".00", "")}
          </div>
        )
      }
    },

    {
      field: '', headerName: 'To be Balanced', width: 200,
    },

    {
      field: '_', headerName: 'To Pay', width: 200,
    },

  ];

  return (
    <div className="datatable">
      <Snakbar ref={snackbarRef} message={msg} type={sType} />
      <div className="datatableTitle">
        Earnings Table

        <div className="filter-select-container">
          <select
            className="chart-selects"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All </option>
            <option value="7">Last Week </option>
            <option value="1">Two Weeks Ago </option>
            <option value="2">Three Weeks Ago </option>
            <option value="3">Four Weeks Ago </option>
          </select>
        </div>
      </div>
      {!loading ? (<DataGrid
        className="datagrid"
        rows={data}
        columns={companyEarningColumns}
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

export default EarningDatatable;
