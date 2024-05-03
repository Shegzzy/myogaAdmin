import "./singleDriver.scss";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import DriverTable from "../../components/table/DriverTable";
import ImageViewModal from '../../components/modal/image-view-modal';


const SingleDriver = (props) => {
  //   const location = useLocation();
  const { id } = useParams();
  //   const userID = location.state.id;
  const [data, setData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [diff, setDiff] = useState(null);
  const [bookL, setBookL] = useState(null);
  const [earnL, setEarnL] = useState(null);
  const [oData, setOData] = useState([]);
  const [lWData, setLWData] = useState([]);
  const [lMData, setLData] = useState([]);
  const [mData, setMData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);


  // fetching riders details
  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const userRef = doc(db, "Drivers", id);
      const userDoc = await getDoc(userRef);
      if (isMounted && userDoc.exists()) {
        setData({
          ...userDoc.data(),
          documents: Array.isArray(userDoc.data().Documents) ? userDoc.data().Documents : [],
        });
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // fetching rider's earnings
  useEffect(() => {
    let isMounted = true;
    try {
      const getEarnings = async () => {

        let totalAmount = 0;

        const earningsQuery = query(
          collection(db, "Earnings"),
          where("Driver", "==", id),
        );

        const earningsData = await getDocs(earningsQuery);

        earningsData.forEach((earnings) => {
          const booking = earnings.data();
          totalAmount += parseFloat(booking.Amount);
        });

        if (isMounted) {
          setTotalEarnings(totalAmount);
        }
      };

      getEarnings();
    } catch (error) {
      console.log(error);
    } finally {
      isMounted = false;
    }

  }, [id]);

  // fetching rider's handled bookings
  useEffect(() => {
    const getBookings = async () => {
      let isMounted = true;
      let bookingsData = [];

      const bookingsQuery = query(
        collection(db, "Bookings"),
        where("Driver ID", "==", id)
      );

      const completedBookingsQuery = query(
        collection(db, "Bookings"),
        where("Driver ID", "==", id),
        where("Status", "==", "completed")
      );

      const querySnapshot = await getDocs(bookingsQuery);
      const queryCompletedSnapshot = await getDocs(completedBookingsQuery);

      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        const bookingId = doc.id;
        bookingsData.push({ ...booking, id: bookingId });
      });
      if (isMounted) {
        bookingsData.sort(
          (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
        );
        setBookingData(bookingsData);
        setBookL(bookingsData.length);
        setEarnL(queryCompletedSnapshot.docs.length);
      }

      return () => {
        isMounted = false;
      };
    };
    getBookings();
  }, [id]);

  // Function for weekly and monthly query
  useEffect(() => {
    let isMounted = true;
    let startOfPeriod, endOfPeriod;


    const fetchDataByWeek = async () => {
      try {
        let bookingsData = [];
        let totalAmount = 0;
        setLoading(true);

        if (selectedFilter === "all") {
          const earningsQuery = query(
            collection(db, "Earnings"),
            where("Driver", "==", id)
          );

          const bookingsQuery = query(
            collection(db, "Bookings"),
            where("Driver ID", "==", id)
          );

          const completedBookingsQuery = query(
            collection(db, "Bookings"),
            where("Driver ID", "==", id),
            where("Status", "==", "completed")
          );

          const earningsData = await getDocs(earningsQuery);
          const querySnapshot = await getDocs(bookingsQuery);
          const queryCompletedSnapshot = await getDocs(completedBookingsQuery);


          querySnapshot.forEach((doc) => {
            const booking = doc.data();
            const bookingId = doc.id;
            bookingsData.push({ ...booking, id: bookingId });
          });


          earningsData.forEach((earnings) => {
            const booking = earnings.data();
            totalAmount += parseFloat(booking.Amount);
          });

          if (isMounted) {
            bookingsData.sort(
              (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
            );
            setBookingData(bookingsData);
            setBookL(bookingsData.length);
            setTotalEarnings(totalAmount);
            setEarnL(queryCompletedSnapshot.docs.length);
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



          const earningsQuery = query(
            collection(db, "Earnings"),
            where("Driver", "==", id),
            where("DateCreated", ">=", startOfPeriod.toISOString()),
            where("DateCreated", "<=", endOfPeriod.toISOString())
          );

          const bookingsQuery = query(
            collection(db, "Bookings"),
            where("Driver ID", "==", id),
            where("Date Created", ">=", startOfPeriod.toISOString()),
            where("Date Created", "<=", endOfPeriod.toISOString())
          );

          const completedBookingsQuery = query(
            collection(db, "Bookings"),
            where("Driver ID", "==", id),
            where("Status", "==", "completed"),
            where("Date Created", ">=", startOfPeriod.toISOString()),
            where("Date Created", "<=", endOfPeriod.toISOString())
          );

          const earningsData = await getDocs(earningsQuery);
          const querySnapshot = await getDocs(bookingsQuery);
          const queryCompletedSnapshot = await getDocs(completedBookingsQuery);


          querySnapshot.forEach((doc) => {
            const booking = doc.data();
            const bookingId = doc.id;
            bookingsData.push({ ...booking, id: bookingId });
          });


          earningsData.forEach((earnings) => {
            const booking = earnings.data();
            totalAmount += parseFloat(booking.Amount);
          });

          if (isMounted) {
            bookingsData.sort(
              (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
            );
            setBookingData(bookingsData);
            setBookL(bookingsData.length);
            setTotalEarnings(totalAmount);
            setEarnL(queryCompletedSnapshot.docs.length);
          }

        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDataByWeek();

  }, [selectedFilter]);

  useEffect(() => {
    getData();
  });
  const getData = async () => {
    // let dataArray = [];
    // let dataOArray = [];
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeekAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2));

    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    //This Month's Earning Query
    const thisMonthQuery = query(
      collection(db, "Earnings"),
      where("Driver", "==", id),
      where("DateCreated", ">=", firstDayOfMonth.toISOString()),
      where("DateCreated", "<=", today.toISOString())
    );

    //Last Month's Earning Query
    const lastMonthQuery = query(
      collection(db, "Earnings"),
      where("Driver", "==", id),
      where("DateCreated", ">=", lastMonth.toISOString()),
      where("DateCreated", "<=", endOfMonth.toISOString())
    );
    // const prevMonthQuery = query(
    //   collection(db, "Earnings"),
    //   where("Company", "==", docs.data().company),
    //   where("timeStamp", "<=", lastMonth),
    //   where("timeStamp", ">", prevMonth)
    // );
    //A week ago
    const oneWeekQuery = query(
      collection(db, "Earnings"),
      where("Driver", "==", id),
      where("timeStamp", "<=", today),
      where("timeStamp", ">", oneWeekAgo)
    );

    //Two weeks ago
    const twoWeekQuery = query(
      collection(db, "Earnings"),
      where("Driver", "==", id),
      where("timeStamp", "<=", oneWeekAgo),
      where("timeStamp", ">", twoWeekAgo)
    );

    //Gettin the percentage difference
    let currentMonthPercentageDiff = 0;

    if (lMData > 0) {
      currentMonthPercentageDiff = ((mData - lMData) / lMData) * 100;
    } else {
      currentMonthPercentageDiff = 100;
    }
    const roundedDiff = currentMonthPercentageDiff.toFixed(0); // round up to 0 decimal places
    setDiff(roundedDiff);

    getDocs(lastMonthQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseInt(data.Amount);
      });
      setLData(total);
    });

    getDocs(thisMonthQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseInt(data.Amount);
      });
      setMData(total);
    });

    //Calculating a week ago amount
    getDocs(oneWeekQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      setOData(total);
    });

    //Calculating two weeks ago amount
    getDocs(twoWeekQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      setLWData(total);
    });
  };

  const [selectedImagePath, setSelectedImagePath] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImagePath(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="singleDriver">
      <Sidebar {...props} />
      <div className="singleDriverContainer">
        <Navbar {...props} />
        <div className="top">
          <div className="left">
            <div className="editButton">
              <Link to={`/edit/${id}`} style={{ textDecoration: "none" }}>
                Edit
              </Link>
            </div>
            <h1 className="title">Information</h1>
            {data ? (
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
                    <span className="itemValue">{data.Address}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Company: </span>
                    <span className="itemValue">{data.Company}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Verification: </span>
                    <span className="itemValue">
                      {data.Verified === "1" ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Gender: </span>
                    <span className="itemValue">{data.Gender}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">DOB: </span>
                    <span className="itemValue">{data["Date of Birth"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">State: </span>
                    <span className="itemValue">{data.State}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Status: </span>
                    <span className="itemValue">
                      {data.Online === "1" ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
                <div className="details">
                  <h1 className="name">Vehicle Details</h1>
                  <div className="detailItem">
                    <span className="itemKey">Type: </span>
                    <span className="itemValue">{data["Vehicle Type"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Make: </span>
                    <span className="itemValue">{data["Vehicle Make"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Model: </span>
                    <span className="itemValue">{data["Vehicle Model"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">VNumber: </span>
                    <span className="itemValue">{data["Vehicle Number"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Year: </span>
                    <span className="itemValue">{data["Vehicle Year"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Color: </span>
                    <span className="itemValue">{data["Vehicle Color"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Current Location: </span>
                    <span className="itemValue">{data["Driver Address"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Latitude: </span>
                    <span className="itemValue">{data["Driver Latitude"]}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Longitude: </span>
                    <span className="itemValue">
                      {data["Driver Longitude"]}
                    </span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Documents: </span>
                    {data.documents && data.documents.length > 0 ? (
                      data.documents.map((imageUrl, index) => (
                        <div key={index}>
                          <img
                            src={imageUrl}
                            alt={`Rider's Documents ${index + 1}`}
                            className="documents-itemImg"
                            onClick={() => handleImageClick(imageUrl)}
                            style={{ cursor: 'pointer' }}
                          />

                          <ImageViewModal
                            title={'Rider\'s Document'}
                            show={isModalOpen}
                            onHide={handleCloseModal}
                            imagePath={selectedImagePath}
                          />
                        </div>
                      ))
                    ) : (
                      <p> No documents available.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>Loading... </div>
            )}
          </div>
          <div className="right">
            <div className="featured">
              <div className="top">
                <h1 className="title">Total Earning</h1>
                <select
                  className="chart-selects"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">Total Earnings</option>
                  <option value="7">Last Week</option>
                  <option value="1">Two Weeks Ago</option>
                  <option value="2">Three Weeks Ago</option>
                  <option value="3">Four Weeks Ago</option>
                  <option value="30">Last Month</option>
                  <option value="60">Two Months Ago</option>
                </select>
              </div>
              <div className="bottom">
                <div className="itemTitle">Total Earning</div>
                <p className="amount">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })
                    .format(totalEarnings)
                    .replace(".00", "")}
                </p>

                <div className="summary">
                  <div className="item">
                    <div className="itemTitle">This Month Earning</div>
                    <div className="itemResult">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })
                        .format(mData)
                        .replace(".00", "")}
                    </div>
                    {/* <div className="itemTitle">Last Month Earning</div>
                    <div className="itemResult">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })
                        .format(lMData)
                        .replace(".00", "")}
                    </div>
                    <div className="itemTitle">Last 7 Days Earning</div>
                    <div className="itemResult">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })
                        .format(oData)
                        .replace(".00", "")}
                    </div>
                    <div className="itemTitle">Last 2 Weeks Earning</div>
                    <div className="itemResult">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })
                        .format(lWData)
                        .replace(".00", "")}
                    </div> */}
                    <div className="itemTitle">Total Trips</div>
                    <div className="itemResult">{bookL}</div>
                    <div className="itemTitle">Completed Trips</div>
                    <div className="itemResult">{earnL}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Bookings</h1>
          <div className="b-bottom">
            <DriverTable id={bookingData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleDriver;
