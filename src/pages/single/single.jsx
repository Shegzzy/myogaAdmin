import "./single.scss";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import UserTable from "../../components/table/UserTable";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import SingleFeatured from "../../components/featured/singleFeatured";

const Single = (props) => {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let isMounted = true;
      try {
        // const profile = [];
        const docRef = doc(db, "Users", id);
        const docSnap = await getDoc(docRef);
        if (isMounted && docSnap.exists()) {
          setData(docSnap.data());
        } else {
          alert("No Such Document");
        }
      } catch (error) {
        alert("Error", error.message);
      }
    };
    fetchData();
  }, [id]);
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">
              <Link to={`/edituser/${id}`} style={{ textDecoration: "none" }}>
                Edit
              </Link>
            </div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src={data["Profile Photo"]}
                alt="avatar"
                className="itemImg"
              />
              <div className="details">
                <h1 className="name">{data.FullName}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email: </span>
                  <span className="itemValue">{data.Email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone: </span>
                  <span className="itemValue">{data.Phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address: </span>
                  <span className="itemValue">{data.address}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Gender: </span>
                  <span className="itemValue">{data.gender}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">DOB: </span>
                  <span className="itemValue">{data.dob}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <SingleFeatured id={id} />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Bookings</h1>
          <div className="b-bottom">
            <UserTable id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
