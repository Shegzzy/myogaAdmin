import "./driverDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { driverColumns } from "../../datatablesource";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "./../../firebase";
import Snakbar from "../snackbar/Snakbar";
import SearchIcon from "@mui/icons-material/Search";
import { format } from "date-fns";
import ImageViewModal from "../modal/image-view-modal";
import VerifyRiderModal from "../modal/VerifyRiderModal";

const UnverifiedDriversList = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const snackbarRef = useRef(null);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedImagePath, setSelectedImagePath] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = (imageUrl) => {
        setSelectedImagePath(imageUrl);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    useEffect(() => {
        const fetchData = async () => {
            let startOfPeriod, endOfPeriod;

            try {
                setLoading(true);
                if (selectedFilter === "all") {
                    const querySnapshot = await getDocs(
                        query(collection(db, "Drivers"),
                            where("Verified", "==", "0"),
                            where("Identification", "==", "identified")
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
                        where("Verified", "==", "0"),
                        where("Identification", "==", "identified"),
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
            const querySnapshot = await getDocs(collection(db, "Drivers"));
            let list = [];

            querySnapshot.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
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

    useEffect(() => {
        handleSearch();
    }, [search]);

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 100,
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
                    </div>
                );
            },
        },
    ];

    const unverifiedRidersColumns = [
        {
            field: "FullName", headerName: "Driver Name", width: 200, renderCell: (params) => {
                return (
                    <div className="cellWithImg">
                        <img className="cellImg" src={params.row['Profile Photo']} alt=" avatar " />
                        {params.row.FullName}
                    </div>
                )
            }
        },
        {
            field: "Email", headerName: "Email", width: 200,
        },
        {
            field: "Phone", headerName: "Phone Number", width: 150,
        },
        {
            field: ['Date of Birth'], headerName: "Date of Birth", width: 100,
        },
        {
            field: "Gender", headerName: "Gender", width: 100,
        },
        {
            field: "State", headerName: "Location", width: 100,
        },
        {
            field: "Address", headerName: "Address", width: 150,
        },
        {
            field: "Online", headerName: "Status", width: 100,
            renderCell: (params) => {
                return (
                    <div className={`cellWithStatus ${params.row.Online}`}>
                        {params.row.Online === "1" ? "online" : "offline"}
                    </div>
                )
            }
        },
        {
            field: "Verified", headerName: "Verification", width: 100,
            renderCell: (params) => {
                return (
                    <div className={`cellWithVerify ${params.row.Verified}`}>
                        {params.row.Verified === "1" ? "verified" : <VerifyRiderModal value={params.row.Verified} Id={params.row.id} />}
                        {/* {params.row.Verified === "0" ? <AssignModal value={params.row.Verified} Id={params.row.id} /> : <div className="verifiedButton">Verified</div>} */}
                    </div>
                )
            }
        },
        {
            field: "Company", headerName: "Company", width: 150,
        },
        {
            field: "Documents", headerName: "Documents", width: 150,
            renderCell: (params) => {
                return (
                    <div className="cellWithImg">
                        {/* <img className="cellImg" src={params.row.documents} alt=" docs " /> */}
                        {params.row.documents && params.row.documents.length > 0 ? (
                            params.row.documents.map((imageUrl, index) => (
                                <div key={index}>
                                    <img
                                        src={imageUrl}
                                        alt={`Rider's Documents ${index + 1}`}
                                        className="cellImg"
                                        onClick={() => handleImageClick(imageUrl)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            ))
                        ) : (
                            <p> No documents available.</p>
                        )}
                    </div>
                )
            }
        },
        {
            field: "Vehicle Type", headerName: "Vehicle Type", width: 100,
        },
        {
            field: "Vehicle Make", headerName: "Vehicle Make", width: 100,
        },
        {
            field: "Vehicle Color", headerName: "Vehicle Color", width: 100,
        },
        {
            field: "Vehicle Year", headerName: "Vehicle Year", width: 100,
        },
        {
            field: "Vehicle Number", headerName: "Vehicle Number", width: 100,
        },
        {
            field: "Date Created", headerName: "Date Created", width: 150,
            renderCell: (params) => {
                const formattedDate = format(new Date(params.value), 'dd/MM/yyyy'); // Format the date
                return <div>{formattedDate}</div>;
            }
        },
    ];

    return (
        <div className="datatable">
            <Snakbar ref={snackbarRef} message={msg} type={sType} />
            <div className="datatableTitle">
                Unverified Riders

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
                    columns={unverifiedRidersColumns.concat(actionColumn)}
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
            <ImageViewModal
                title={"Rider's Document"}
                show={isModalOpen}
                onHide={handleCloseModal}
                imagePath={selectedImagePath}
            />
        </div >
    );
};

export default UnverifiedDriversList;
