import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import Snakbar from "../snackbar/Snakbar";



const TransactionDataTable = () => {
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [transactions, setTransactions] = useState([]);
    const snackbarRef = useRef(null);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        let startOfPeriod, endOfPeriod;

        const fetchTransactionData = async () => {
            setLoading(true);
            try {
                if (selectedFilter === "all") {
                    const querySnapshot = await getDocs(collection(db, "Transactions"));
                    const transactionList = [];
                    querySnapshot.forEach((doc) => {
                        transactionList.push({ id: doc.id, ...doc.data() });
                    });
                    setTransactions(transactionList);
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


                    const querySnapshot = query(
                        collection(db, "Transactions"),
                        where("Date Paid", ">=", startOfPeriod),
                        where("Date Paid", "<=", endOfPeriod),
                    );

                    const transactionQuery = await getDocs(querySnapshot);

                    const transactionList = [];
                    transactionQuery.forEach((doc) => {
                        transactionList.push({ id: doc.id, ...doc.data() });
                    });
                    setTransactions(transactionList);

                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionData();
    }, [selectedFilter]);

    // Function to search for riders
    const handleSearch = async () => {
        try {
            setLoading(true);
            if (searchTerm.trim() !== '') {
                const filteredData = transactions.filter((companyName) => {
                    const name = companyName["Company Name"]?.toLowerCase() ?? "";
                    return name.includes(searchTerm?.toLowerCase() ?? "");
                });

                if (filteredData.length === 0) {
                    setMsg('No search results found.');
                    setType("error");
                    snackbarRef.current.show();
                }

                setTransactions(filteredData);
            } else {
                const querySnapshot = await getDocs(collection(db, "Transactions"));
                const transactionList = [];
                querySnapshot.forEach((doc) => {
                    transactionList.push({ id: doc.id, ...doc.data() });
                });
                setTransactions(transactionList);
            }
        } catch (e) {
            console.log("Search Error", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm]);

    const companyEarningColumns = [
        // { field: 'id', headerName: 'ID', width: 100 },

        {
            field: 'Company Name',
            headerName: 'Company',
            width: 150,
            renderCell: (params) => (
                <Link
                    to={{
                        pathname: `/company/${params.row["Company ID"]}`,
                        replace: true,
                        state: { id: params.row["Company ID"] },
                    }}
                >{params.row["Company Name"]}</Link>
            ),
        },

        {
            field: 'Amount', headerName: 'Amount', width: 150, renderCell: (params) => {
                return (
                    <div className='cellStatus'>
                        {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                        })
                            .format(params.row.Amount)
                            .replace(".00", "")}
                    </div>
                )
            }
        },

        {
            field: 'From',
            headerName: 'From',
            width: 150,
        },

        {
            field: 'To',
            headerName: 'To',
            width: 150,
        },

        {
            field: 'Date Paid',
            headerName: 'Date Paid',
            width: 150,
            renderCell: (params) => {
                return (
                    <div>
                        {new Date(params.row["Date Paid"].seconds * 1000).toLocaleString()}
                    </div>
                )
            }
        },

    ];

    return (
        <div className="datatable">
            <Snakbar ref={snackbarRef} message={msg} type={sType} />
            <div className="datatableTitle">
                Transaction Table

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
                        <option value="all">All</option>
                        <option value="7">Last Week</option>
                        <option value="1">Two Weeks Ago</option>
                        <option value="3">Three Weeks Ago</option>
                    </select>
                </div>

            </div>

            {!loading ? (<DataGrid
                className="datagrid"
                rows={transactions}
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

export default TransactionDataTable;
