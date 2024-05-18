import "./companyDatatable.scss";
import { DataGrid, GridSearchIcon } from "@mui/x-data-grid";
// import { companyColumns, companyRows } from "../../datatablesource";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { collection, deleteDoc, doc, onSnapshot, getDoc, query, where, getDocs, updateDoc, setDoc } from "firebase/firestore";
import { db } from "./../../firebase";
import Snakbar from "../snackbar/Snakbar";
import ImageViewModal from "../modal/image-view-modal";
import { format } from "date-fns";

const CompanyDatatable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  const snackbarRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [sType, setType] = useState("");
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
          list.push({
            id: doc.id,
            ...doc.data(),
            documents: Array.isArray(doc.data().documents) ? doc.data().documents : [],
            cac: Array.isArray(doc.data().cacDocuments) ? doc.data().cacDocuments : [],
            cLicense: Array.isArray(doc.data().courierLicense) ? doc.data().courierLicense : [],

          });
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

  // hold function
  const handleHold = async (id) => {
    try {
      const companyDoc = await getDoc(doc(db, "Companies", id));
      const companyName = companyDoc.data().company;

      const ridersQuery = query(collection(db, "Drivers"),
        where("Company", "==", companyName),
        where("Verified", "==", "1")
      );
      const companyRiders = await getDocs(ridersQuery);

      if (!companyRiders.empty) {
        const updatePromises = companyRiders.docs.map(async (rider) => {
          const riderRef = doc(db, "Drivers", rider.id);
          await updateDoc(riderRef, { Verified: "Hold" });
        });

        // Update the company document status
        const companyRef = doc(db, "Companies", id);
        await setDoc(companyRef, { Status: "Hold" }, { merge: true });

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        setMsg(`${companyName} is now on hold`);
        setType("success");
      } else {
        setMsg(`${companyName} has no riders`);
        setType("error");
      }

      snackbarRef.current.show();
    } catch (error) {
      setMsg(error.message);
      setType("error");
      snackbarRef.current.show();
    }
  };


  // release functionality
  const handleRelease = async (id) => {
    try {
      const companyDoc = await getDoc(doc(db, "Companies", id));
      const companyName = companyDoc.data().company;

      const ridersQuery = query(collection(db, "Drivers"),
        where("Company", "==", companyName),
        where("Verified", "==", "Hold"));
      const companyRiders = await getDocs(ridersQuery);

      const updatePromises = companyRiders.docs.map(async (rider) => {
        // console.log(rider.id);
        const riderRef = doc(db, "Drivers", rider.id);
        const companyRef = doc(db, "Companies", id);

        await updateDoc(riderRef, { Verified: "1" });
        await updateDoc(companyRef, { Status: "Released" });
      });

      await Promise.all(updatePromises);

      setMsg(`${companyName} is now released`);
      setType("success");
      snackbarRef.current.show();
    } catch (error) {
      setMsg(error.message);
      setType("error");
      snackbarRef.current.show();
    }
  };

  // Function to search for riders
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      const filteredData = data.filter((companyName) => {
        const name = companyName.company?.toLowerCase() ?? "";
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
            {(params.row.Status === "Released" || params.row.Status === undefined) ? (<div
              className="deleteButton"
              onClick={() => handleHold(params.row.id)}
            >
              Hold
            </div>) : (<div
              className="releaseButton"
              onClick={() => handleRelease(params.row.id)}
            >
              Release
            </div>)}
          </div>
        );
      },
    },
  ];

  const companyColumns = [
    // { field: 'id', headerName: 'ID', width: 100 },
    {
      field: "Company Name", headerName: "Company Name", width: 200, renderCell: (params) => {
        return (
          <div className="cellWithImg">
            {params.row['Profile Photo'] === null ? <img className="cellImg" src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg" alt=" avatar " />
              : <img className="cellImg" src={params.row['Profile Photo']} alt=" avatar " />
            }
            {params.row.company}
          </div>
        )
      }
    },
    {
      field: "email", headerName: "Email", width: 200,
    },
    {
      field: "phone", headerName: "Company Phone Number", width: 150,
    },
    {
      field: "regnumber", headerName: "Registration Number", width: 150,
    },
    {
      field: "address", headerName: "Company Address", width: 250,
    },
    {
      field: "location", headerName: "Location", width: 150,
    },
    // {
    //     field: "Status", headerName: "Status", width: 100,
    //     renderCell: (params) => {
    //         return (
    //             <div className={`cellWithStatus ${params.row.Status}`}>
    //                 {params.row.Status}
    //             </div>
    //         )
    //     }
    // },
    {
      field: "documents", headerName: "ID Card", width: 150, renderCell: (params) => {
        return (
          <div className="cellWithImg" >
            {params.row.documents && params.row.documents.length > 0 ? (
              params.row.documents.map((imageUrl, index) => (
                <div key={index}>
                  <img
                    src={imageUrl}
                    alt={`Company's Documents ${index + 1}`}
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
      field: "cacDocuments", headerName: "CAC", width: 150, renderCell: (params) => {
        return (
          <div className="cellWithImg" >
            {params.row.cac && params.row.cac.length > 0 ? (
              params.row.cac.map((imageUrl, index) => (
                <div key={index}>
                  <img
                    src={imageUrl}
                    alt={`Company's Documents ${index + 1}`}
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
      field: "courierLicense", headerName: "Courier License", width: 150, renderCell: (params) => {
        return (
          <div className="cellWithImg" >
            {params.row.cLicense && params.row.cLicense.length > 0 ? (
              params.row.cLicense.map((imageUrl, index) => (
                <div key={index}>
                  <img
                    src={imageUrl}
                    alt={`Company's Documents ${index + 1}`}
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
      field: "date", headerName: "Date Created",
      renderCell: (params) => {
        const formattedDate = format(new Date(params.value), 'dd/MM/yyyy'); // Format the date
        return <div>{formattedDate || ''}</div>;
      }
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

        <div className="search">
          <input
            type="text"
            placeholder="Enter company's name..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            value={searchTerm}
          />
          <GridSearchIcon onClick={handleSearch} />
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={companyColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
      // checkboxSelection
      />

      <ImageViewModal
        title={"Company's Document"}
        show={isModalOpen}
        onHide={handleCloseModal}
        imagePath={selectedImagePath}
      />
    </div>
  );
};

export default CompanyDatatable;
