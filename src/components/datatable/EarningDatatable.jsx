import "./earningDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
// import { earningColumns } from "../../datatablesource";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "./../../firebase";
import Snakbar from "../snackbar/Snakbar";
import SearchIcon from "@mui/icons-material/Search";
import PaymentModal from "../modal/paymentModal";


const EarningDatatable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const snackbarRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [sType, setType] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("7");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [payOut, setPayOut] = useState(0);
  const [toReceive, setToReceive] = useState(0);



  // Function for weekly query
  useEffect(() => {
    let isMounted = true;
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

              let cashEarnings = 0;
              let cardEarnings = 0;
              let totalReceive = 0;
              let totalPayOut = 0;
              // let bookingNumbers = [];


              const earningsSnapshot = await getDocs(earningsQuery);

              // Iterate through earnings
              for (const doc of earningsSnapshot.docs) {
                const bookingID = doc.data().BookingID;
                // bookingNumbers.push(doc.data().BookingID);
                // console.log(bookingNumbers);

                // Query the "Bookings" collection directly
                const bookingQuery = query(
                  collection(db, "Bookings"),
                  where("Booking Number", "==", bookingID),
                  limit(1)
                );

                const bookingSnapshot = await getDocs(bookingQuery);

                if (!bookingSnapshot.empty) {
                  const paymentMethod = bookingSnapshot.docs[0].data()["Payment Method"];
                  const amount = parseFloat(doc.data().Amount);

                  // Add earnings based on payment method
                  if (paymentMethod === 'Cash on Delivery') {
                    cashEarnings += amount;
                  } else if (paymentMethod === 'Card') {
                    cardEarnings += amount;
                  }



                  if (cardEarnings > ((cashEarnings + cardEarnings) * 0.15).toFixed(0)) {

                    totalReceive = cardEarnings - ((cashEarnings + cardEarnings) * 0.15).toFixed(0);
                    totalPayOut = 0;
                    // console.log(totalReceive);

                    if (isMounted) {
                      setToReceive(totalReceive);
                      setPayOut(0);
                    }
                  } else if (cardEarnings < ((cashEarnings + cardEarnings) * 0.15).toFixed(0)) {

                    totalPayOut = ((cashEarnings + cardEarnings) * 0.15).toFixed(0) - cardEarnings;
                    totalReceive = 0;
                    // console.log(totalPayOut);

                    if (isMounted) {
                      setPayOut(totalPayOut);
                      setToReceive(0);
                    }
                  } else {
                    totalPayOut = ((cashEarnings + cardEarnings) * 0.15).toFixed(0) - cardEarnings;
                    totalReceive = cardEarnings - ((cashEarnings + cardEarnings) * 0.15).toFixed(0);

                    console.log(totalPayOut);
                    console.log(totalReceive);


                    if (isMounted) {
                      setToReceive(totalReceive);
                      setPayOut(totalPayOut);
                    }

                  }
                }
              }

              return {
                id: company.id,
                name: company.name,
                cashEarnings: cashEarnings.toFixed(0),
                cardEarnings: cardEarnings.toFixed(0),
                totalEarnings: (cashEarnings + cardEarnings).toFixed(0),
                fifteenPercent: ((cashEarnings + cardEarnings) * 0.15).toFixed(0),
                eightyFivePercent: ((cashEarnings + cardEarnings) * 0.85).toFixed(0),
                toBeBalanced: totalReceive,
                toPayOut: totalPayOut
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
              startOfPeriod.setHours(0, 0, 0, 0);

              endOfPeriod = new Date(today);
              endOfPeriod.setDate(today.getDate() - today.getDay() - 1);
              endOfPeriod.setHours(23, 59, 59, 999);
            } else if (selectedFilter === "1") {
              // Two Weeks Ago
              startOfPeriod = new Date(today);
              startOfPeriod.setDate(today.getDate() - today.getDay() - 14);
              startOfPeriod.setHours(0, 0, 0, 0);

              endOfPeriod = new Date(today);
              endOfPeriod.setDate(today.getDate() - today.getDay() - 8);
              endOfPeriod.setHours(23, 59, 59, 999);
            } else if (selectedFilter === "2") {
              // Three Weeks Ago
              startOfPeriod = new Date(today);
              startOfPeriod.setDate(today.getDate() - today.getDay() - 21);
              startOfPeriod.setHours(0, 0, 0, 0);

              endOfPeriod = new Date(today);
              endOfPeriod.setDate(today.getDate() - today.getDay() - 15);
              endOfPeriod.setHours(23, 59, 59, 999);
            } else if (selectedFilter === "3") {
              // Four Weeks Ago
              startOfPeriod = new Date(today);
              startOfPeriod.setDate(today.getDate() - today.getDay() - 28);
              startOfPeriod.setHours(0, 0, 0, 0);

              endOfPeriod = new Date(today);
              endOfPeriod.setDate(today.getDate() - today.getDay() - 22);
              endOfPeriod.setHours(23, 59, 59, 999);
            } else if (selectedFilter === "30") {
              // Last Month
              startOfPeriod = new Date(today);
              startOfPeriod.setMonth(today.getMonth() - 1, 1);
              startOfPeriod.setHours(0, 0, 0, 0);

              endOfPeriod = new Date(startOfPeriod.getFullYear(), startOfPeriod.getMonth() + 1, 0);
              endOfPeriod.setHours(23, 59, 59, 999);
            } else if (selectedFilter === "60") {
              // Two Months Ago
              startOfPeriod = new Date(today);
              startOfPeriod.setMonth(today.getMonth() - 2, 1);
              startOfPeriod.setHours(0, 0, 0, 0);

              endOfPeriod = new Date(today);
              endOfPeriod.setMonth(today.getMonth() - 1, 0);
              endOfPeriod.setHours(23, 59, 59, 999);
            }

            let totalReceive = 0;
            let totalPayOut = 0;

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

              let cashEarnings = 0;
              let cardEarnings = 0;
              // let bookingNumbers = [];


              const earningsSnapshot = await getDocs(earningsQuery);

              // Iterate through earnings
              for (const doc of earningsSnapshot.docs) {
                const bookingID = doc.data().BookingID;
                // bookingNumbers.push(doc.data().BookingID);
                // console.log(bookingNumbers);

                // Query the "Bookings" collection directly
                const bookingQuery = query(
                  collection(db, "Bookings"),
                  where("Booking Number", "==", bookingID),
                  limit(1)
                );

                const bookingSnapshot = await getDocs(bookingQuery);

                if (!bookingSnapshot.empty) {
                  const paymentMethod = bookingSnapshot.docs[0].data()["Payment Method"];
                  const amount = parseFloat(doc.data().Amount);

                  // Add earnings based on payment method
                  if (paymentMethod === 'Cash on Delivery') {
                    cashEarnings += amount;
                  } else if (paymentMethod === 'Card') {
                    cardEarnings += amount;
                  }

                  if (cardEarnings > ((cashEarnings + cardEarnings) * 0.15).toFixed(0)) {

                    totalReceive = cardEarnings - ((cashEarnings + cardEarnings) * 0.15).toFixed(0);
                    totalPayOut = 0;
                    // console.log(totalReceive);

                    if (isMounted) {
                      setToReceive(totalReceive);
                      setPayOut(0);
                    }
                  } else if (cardEarnings < ((cashEarnings + cardEarnings) * 0.15).toFixed(0)) {

                    totalPayOut = ((cashEarnings + cardEarnings) * 0.15).toFixed(0) - cardEarnings;
                    totalReceive = 0;

                    if (isMounted) {
                      setPayOut(totalPayOut);
                      setToReceive(0);
                    }
                  } else {
                    totalPayOut = ((cashEarnings + cardEarnings) * 0.15).toFixed(0) - cardEarnings;
                    totalReceive = cardEarnings - ((cashEarnings + cardEarnings) * 0.15).toFixed(0);


                    if (isMounted) {
                      setToReceive(totalReceive);
                      setPayOut(totalPayOut);
                    }

                  }
                }
              }

              return {
                id: company.id,
                name: company.name,
                cashEarnings: cashEarnings.toFixed(0),
                cardEarnings: cardEarnings.toFixed(0),
                totalEarnings: (cashEarnings + cardEarnings).toFixed(0),
                fifteenPercent: ((cashEarnings + cardEarnings) * 0.15).toFixed(0),
                eightyFivePercent: ((cashEarnings + cardEarnings) * 0.85).toFixed(0),
                toBeBalanced: totalReceive,
                toPayOut: totalPayOut,
                startOfPeriod,
                endOfPeriod
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
    // { field: 'id', headerName: 'ID', width: 100 },

    {
      field: 'name',
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
      field: 'cashEarnings', headerName: 'Cash Payments', width: 200, renderCell: (params) => {
        return (
          <div className='cellStatus'>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            })
              .format(params.row.cashEarnings)
              .replace(".00", "")}
          </div>
        )
      }
    },

    {
      field: 'cardEarnings', headerName: 'Card Payments', width: 200, renderCell: (params) => {
        return (
          <div className='cellStatus'>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            })
              .format(params.row.cardEarnings)
              .replace(".00", "")}
          </div>
        )
      }
    },

    {
      field: 'toBeBalanced', headerName: 'To Send', width: 200, renderCell: (params) => {
        const value = params.row.toBeBalanced;
        let color = 'black';
        if (value === 0) {
          color = 'green';
        } else if (value > 0) {
          color = 'orange';
        }
        return (
          <div className='cellStatus' style={{ color: color }}>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            })
              .format(params.row.toBeBalanced)
              .replace(".00", "")}
          </div>
        )
      }

    },

    {
      field: 'toPayOut', headerName: 'To Receive', width: 200, renderCell: (params) => {
        const value = params.row.toPayOut;
        let color = 'black';
        if (value === 0) {
          color = 'green';
        } else if (value > 0) {
          color = 'red';
        }
        return (
          <div className='cellStatus' style={{ color: color }}>
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            })
              .format(params.row.toPayOut)
              .replace(".00", "")}
          </div>
        )
      }
    },

  ];

  // Function to search for companies
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      const filteredData = data.filter((companyName) => {
        const name = companyName.name?.toLowerCase() ?? "";
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

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <PaymentModal {...params.row} />
        );
      },
    },
  ];



  return (
    <div className="datatable">
      <Snakbar ref={snackbarRef} message={msg} type={sType} />
      <div className="datatableTitle">
        Earnings Table

        <div className="search">
          <input
            type="text"
            placeholder="Enter company's name..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            value={searchTerm}
          />
          <SearchIcon />
        </div>

        <div className="filter-select-container">
          <select
            className="chart-selects"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All </option>
            <option value="7">Last Week </option>
            <option value="1">Two Weeks Ago </option>
            {/* <option value="2">Three Weeks Ago </option>
            <option value="3">Four Weeks Ago </option> */}
          </select>
        </div>
      </div>

      {!loading ? (<DataGrid
        className="datagrid"
        rows={data}
        columns={companyEarningColumns.concat(actionColumn)}
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
