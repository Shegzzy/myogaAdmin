import "./singleCompany.scss";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { Link, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TablePagination from '@mui/material/TablePagination';
import ImageViewModal from '../../components/modal/image-view-modal';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';


const SingleCompany = (props) => {
  // const location = useLocation();
  // const userID = location.state.id;
  const { companyId } = useParams();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [rData, setRData] = useState([]);
  const [riderL, setRiderL] = useState(null);
  const [earnL, setEarnL] = useState(null);
  const [oData, setOData] = useState([]);
  const [lWData, setLWData] = useState([]);
  const [lMData, setLData] = useState([]);
  const [mData, setMData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalProfits, setTotalProfits] = useState(0);
  const [Selected, setSelected] = useState("Total");
  const [data, setData] = useState([]);
  const [fieldSum, setFieldSum] = useState(0);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [inFlow, setInFlow] = useState(null);
  const [outFlow, setOutFlow] = useState(null);
  const [cardPayments, setCardPayments] = useState(0);
  const [cashPayments, setCashPayments] = useState(0);
  const [payOut, setPayOut] = useState(0);
  const [toReceive, setToReceive] = useState(0);
  const [activeTab, setActiveTab] = useState("riders");
  const [isMounted, setIsMounted] = useState("true");
  const [companyRatings, setCompanyRating] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(companyId)

  useEffect(() => {
    fetchUser();
    getEarnings();
    getData();
    getRiders();
    fetchEarningsData();
    fetchCompanyRatings();
  }, [companyId, name]);

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
            getEarnings();
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

            // Use startOfWeek and endOfWeek in your Firestore query
            const earningsQuery = query(
              collection(db, "Earnings"),
              where("Company", "==", name),
              where("DateCreated", ">=", startOfPeriod.toISOString()),
              where("DateCreated", "<=", endOfPeriod.toISOString())
            );

            const earningsSnapshot = await getDocs(earningsQuery);
            // const earningsData = earningsSnapshot.docs.map((doc) => doc.data());

            // Collecting Bookings IDs
            const bookingNumbers = earningsSnapshot.docs.map(
              (bookingrDoc) => bookingrDoc.data().BookingID,
            );

            earningsSnapshot.forEach((doc) => {
              const data = doc.data();
              earningsTotal += parseFloat(data.Amount);
            });

            // Calculating 85% of the total earnings
            const eightyFivePercent = earningsTotal * 0.85;
            const roundEightyFivePercentage = eightyFivePercent.toFixed(0);

            // Calculating 15% of the total earnings
            const fifteenPercent = earningsTotal * 0.15;
            const roundFifteenPercent = fifteenPercent.toFixed(0);

            const chunkSize = 30;
            const bookingChunks = [];
            for (let i = 0; i < bookingNumbers.length; i += chunkSize) {
              const chunk = bookingNumbers.slice(i, i + chunkSize);
              bookingChunks.push(chunk);
            }

            const allBookings = [];

            for (const chunk of bookingChunks) {
              const bookingsQuery = query(
                collection(db, "Bookings"),
                where("Booking Number", "in", chunk)
              );

              try {
                const bookingsSnapshot = await getDocs(bookingsQuery);

                if (!bookingsSnapshot.empty) {
                  const bookings = bookingsSnapshot.docs.map((bookingDoc) => bookingDoc.data());
                  // Separate amounts based on payment method and calculate the sum
                  const cardPayments = bookings.filter((booking) => booking["Payment Method"] === "Card");
                  const cashPayments = bookings.filter((booking) => booking["Payment Method"] === "Cash on Delivery");

                  sumCardPayments += cardPayments.reduce((total, booking) => total + parseFloat(booking.Amount), 0);
                  sumCashPayments += cashPayments.reduce((total, booking) => total + parseFloat(booking.Amount), 0);

                  allBookings.push(...bookings);
                } else {
                  console.log("No bookings found with the given Booking Numbers in this chunk.");
                }
              } catch (error) {
                console.error("Error fetching bookings:", error);
              }
            }

            console.log("Total Card Payments:", sumCardPayments);
            console.log("Total Cash Payments:", sumCashPayments);

            if (sumCardPayments > roundFifteenPercent) {

              totalReceive = sumCardPayments - roundFifteenPercent;

              if (isMounted) {
                setToReceive(totalReceive);
                setPayOut(0);
              }
            } else if (sumCardPayments < roundFifteenPercent) {

              totalPayOut = roundFifteenPercent - sumCardPayments;

              if (isMounted) {
                setPayOut(totalPayOut);
                setToReceive(0);
              }
            } else {
              totalPayOut = roundFifteenPercent - sumCardPayments;
              totalReceive = sumCardPayments - roundFifteenPercent;

              console.log('Total receive: ', totalReceive);
              console.log('Total payout: ', totalPayOut);

              if (isMounted) {
                setToReceive(totalReceive);
                setPayOut(totalPayOut);
              }

            }

            setTotal(earningsTotal);
            setInFlow(roundEightyFivePercentage);
            setOutFlow(roundFifteenPercent);
            setCardPayments(sumCardPayments);
            setCashPayments(sumCashPayments);
            setEarnL(earningsSnapshot.docs.length);

            allBookings.sort(
              (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
            );

            if (isMounted) {
              setData(allBookings); // Set the filtered data to the state
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
  }, [name, selectedFilter]);


  // Fetching the company information
  const fetchUser = async () => {
    try {
      const docRef = doc(db, "Companies", companyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // profile.push({ id: docSnap.id, ...docSnap.data() });
        const profile = docSnap.data() || {};
        setUser({
          ...profile,
          documents: Array.isArray(profile.documents) ? profile.documents : [],
          utilityBill: Array.isArray(profile.utilityBill) ? profile.utilityBill : [],
          cacDocuments: Array.isArray(profile.cacDocuments) ? profile.cacDocuments : [],
          courierLicense: Array.isArray(profile.courierLicense) ? profile.courierLicense : [],
          amacDocuments: Array.isArray(profile.amacDocuments) ? profile.amacDocuments : [],
        });
        setName(docSnap.data().company);
      } else {
        alert("No such document!");
      }
    } catch (error) {
      alert(error);
    }
  };

  // Company's earnings
  const getEarnings = async () => {
    try {
      const earningsQuery = query(
        collection(db, "Earnings"),
        where("Company", "==", name)
      );

      const querySnapshot = await getDocs(earningsQuery);

      let totalAmount = 0;
      querySnapshot.forEach((doc) => {
        const earnings = doc.data();
        totalAmount += parseFloat(earnings.Amount);
      });

      // Calculating 85% of the total earnings
      const eightyFivePercent = totalAmount * 0.85;
      const roundEightyFivePercentage = eightyFivePercent.toFixed(0);

      // Calculating 15% of the total earnings
      const fifteenPercent = totalAmount * 0.15;
      const roundFifteenPercent = fifteenPercent.toFixed(0);


      setTotal(totalAmount);
      setInFlow(roundEightyFivePercentage);
      setOutFlow(roundFifteenPercent);
      setEarnL(querySnapshot.docs.length);
    } catch (error) {
      console.error("Error fetching earnings:", error);
    }
  };


  // Querys
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
      where("Company", "==", name),
      where("DateCreated", ">=", firstDayOfMonth.toISOString()),
      where("DateCreated", "<=", today.toISOString())
    );

    //Last Month's Earning Query
    const lastMonthQuery = query(
      collection(db, "Earnings"),
      where("Company", "==", name),
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
      where("Company", "==", name),
      where("timeStamp", "<=", today),
      where("timeStamp", ">", oneWeekAgo)
    );

    //Two weeks ago
    const twoWeekQuery = query(
      collection(db, "Earnings"),
      where("Company", "==", name),
      where("timeStamp", "<=", oneWeekAgo),
      where("timeStamp", ">", twoWeekAgo)
    );

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

  // company's riders
  const getRiders = async () => {
    try {
      const ridersQuery = query(
        collection(db, "Drivers"),
        where("Company", "==", name)
      );

      const querySnapshot = await getDocs(ridersQuery);

      const ridersData = [];
      querySnapshot.forEach((doc) => {
        const rider = doc.data();
        const riderId = doc.id;
        ridersData.push({ ...rider, id: riderId });
      });

      ridersData.sort(
        (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
      );

      setRData(ridersData);
      setRiderL(querySnapshot.docs.length);
    } catch (error) {
      console.error("Error fetching riders:", error);
    }
  };

  // Company's earnings data for table
  const fetchEarningsData = async () => {
    const allBookings = [];
    let sumCardPayments = 0;
    let sumCashPayments = 0;
    let totalReceive = 0;
    let totalPayOut = 0;
    let isMounted = true;


    if (isMounted) {
      try {
        setLoading(true);

        if (isMounted) {
          const earningsQuery = query(
            collection(db, "Earnings"),
            where("Company", "==", name)
          );
          const earningsSnapshot = await getDocs(earningsQuery);

          // Collecting Bookings IDs
          const bookingNumbers = earningsSnapshot.docs.map(
            (bookingrDoc) => bookingrDoc.data().BookingID,
          );
          let earningsTotal = 0;

          earningsSnapshot.forEach((doc) => {
            const data = doc.data();
            earningsTotal += parseFloat(data.Amount);
          });


          // Calculating 85% of the total earnings
          const eightyFivePercent = earningsTotal * 0.85;
          const roundPercentage = eightyFivePercent.toFixed(0);

          // Calculating 15% of the total earnings
          const fifteenPercent = earningsTotal * 0.15;
          const roundFifteenPercent = fifteenPercent.toFixed(0);

          const chunkSize = 30;
          const bookingChunks = [];
          for (let i = 0; i < bookingNumbers.length; i += chunkSize) {
            const chunk = bookingNumbers.slice(i, i + chunkSize);
            bookingChunks.push(chunk);
          }


          for (const chunk of bookingChunks) {
            const bookingsQuery = query(
              collection(db, "Bookings"),
              where("Booking Number", "in", chunk)
            );

            try {
              const bookingsSnapshot = await getDocs(bookingsQuery);

              if (!bookingsSnapshot.empty) {
                const bookings = bookingsSnapshot.docs.map((bookingDoc) => bookingDoc.data());

                // Separating amounts based on payment method and calculating the sum
                const cardPayments = bookings.filter((booking) => booking["Payment Method"] === "Card");
                const cashPayments = bookings.filter((booking) => booking["Payment Method"] === "Cash on Delivery");

                sumCardPayments += cardPayments.reduce((total, booking) => total + parseFloat(booking.Amount), 0);
                sumCashPayments += cashPayments.reduce((total, booking) => total + parseFloat(booking.Amount), 0);

                allBookings.push(...bookings);
              } else {
                console.log("No bookings found with the given Booking Numbers in this chunk.");
              }
            } catch (error) {
              console.error("Error fetching bookings:", error);
              // toast.error("Error fetching bookings.");
            }
          }

          if (sumCardPayments > roundFifteenPercent) {

            totalReceive = sumCardPayments - roundFifteenPercent;

            if (isMounted) {
              setToReceive(totalReceive);
              setPayOut(0);
            }
          } else if (sumCardPayments < roundFifteenPercent) {

            totalPayOut = roundFifteenPercent - sumCardPayments;

            if (isMounted) {
              setPayOut(totalPayOut);
              setToReceive(0);
            }
          } else {
            totalPayOut = roundFifteenPercent - sumCardPayments;
            totalReceive = sumCardPayments - roundFifteenPercent;


            if (isMounted) {
              setToReceive(totalReceive);
              setPayOut(totalPayOut);
            }

          }

          setTotal(earningsTotal);
          setInFlow(roundPercentage);
          setOutFlow(roundFifteenPercent);
          setCardPayments(sumCardPayments);
          setCashPayments(sumCashPayments);
          allBookings.sort(
            (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // toast.error("Error fetching data.");
      } finally {
        setLoading(false);
        if (isMounted) {
          setData(allBookings);
        }
      }
    }
  };

  // Company's ratings
  const fetchCompanyRatings = async () => {
    let isMounted = true;

    if (isMounted) {
      try {
        const driversQuery = query(
          collection(db, "Drivers"),
          where("Company", "==", name)
        );

        const driversSnapshot = await getDocs(driversQuery);
        const totalRiders = driversSnapshot.size;

        let totalRatings = 0;

        // Creating an array of promises to fetch Ratings for each Driver
        const ratingPromises = driversSnapshot.docs.map(async (driverDoc) => {
          const ratingsQuerySnapshot = await getDocs(
            collection(db, "Drivers", driverDoc.id, "Ratings")
          );

          let riderTotalRatings = 0;
          let riderTotalReviews = 0;

          // Iterating through the ratings and calculating the total for each rider
          ratingsQuerySnapshot.forEach((ratingDoc) => {
            const ratingData = ratingDoc.data();
            riderTotalRatings += ratingData.rating;
            riderTotalReviews++;
          });

          const riderAverageRating =
            riderTotalReviews > 0 ? riderTotalRatings / riderTotalReviews : 0;

          // console.log(`Rider ${driverDoc.id} Average Rating:`, riderAverageRating);

          // Adding rider's average rating to the total
          totalRatings += riderAverageRating;
        });

        await Promise.all(ratingPromises);

        // Calculating the overall average rating for the company
        const averageRating = totalRiders > 0 ? totalRatings / totalRiders : 0;

        setCompanyRating(averageRating);
        // console.log("Total Riders:", totalRiders);
        // console.log("Total Rating:", totalRatings);
        // console.log("Overall Average Rating:", averageRating);

      } catch (error) {
        console.log("Error fetching data:");
      } finally {
        setIsMounted(false);
      }
    }
  };

  // Function to render star icons based on the average rating
  const renderStars = (averageRating) => {
    const stars = [];
    for (let i = 0; i < 5.0; i++) {
      stars.push(
        i < Math.floor(averageRating) ? (
          <AiFillStar key={i} style={{ color: averageRating < 3.0 ? 'red' : 'green' }} />
        ) : (
          <AiOutlineStar key={i} style={{ color: averageRating < 3.0 ? 'red' : 'green' }} />
        )
      );
    }
    return stars;
  };

  const [selectedImagePath, setSelectedImagePath] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImagePath(imageUrl);
    setIsModalOpen(true); // Open the modal when an image is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const switchToRiders = () => {
    setTimeout(() => {
      setActiveTab("riders")
    })
  }

  const switchToEarnings = () => {
    setTimeout(() => {
      setActiveTab("earnings")
    })
  }

  return (
    <div className="singleCompany">
      <Sidebar />
      <div className="singleCompanyContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">
              <Link
                to={`/editcompany/${companyId}`}
                style={{ textDecoration: "none" }}
              >
                Edit
              </Link>
            </div>

            <h1 className="title">Information</h1>
            {user ? (
              <div className="item">
                <img src={user["Profile Photo"]} alt="" className="itemImg" />
                <div className="details">
                  <h1 className="itemTitle">{user.company}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Email:</span>
                    <span className="itemValue">{user.email}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Phone:</span>
                    <span className="itemValue">{user.phone}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Address:</span>
                    <span className="itemValue">{user.address}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">State:</span>
                    <span className="itemValue">{user.location}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">CAC Reg Number:</span>
                    <span className="itemValue">{user.regnumber}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Account Name:</span>
                    <span className="itemValue">{user.accountName}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Bank:</span>
                    <span className="itemValue">{user.bank}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Account Number:</span>
                    <span className="itemValue">{user.account}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Date Joined:</span>
                    <span className="itemValue">{user.date}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Ratings: </span>

                    <span className="itemValue">
                      {companyRatings.toFixed(1)}
                      {renderStars(companyRatings)}
                    </span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">ID Card:</span>
                    <span className="itemValue">
                      <div className="documents-container">
                        {user.documents && user.documents.length > 0 ? (
                          user.documents.map((imageUrl, index) => (
                            <div key={index}>
                              <img
                                src={imageUrl}
                                alt={`Company's Documents ${index + 1}`}
                                className="documents-itemImg"
                                onClick={() => handleImageClick(imageUrl)}
                                style={{ cursor: 'pointer' }}
                              />

                              <ImageViewModal
                                title={'Company\'s Document'}
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
                    </span>

                  </div>

                  <div className="detailItem">
                    <span className="itemKey">CAC Documents:</span>
                    <span className="itemValue">
                      <div className="documents-container">
                        {user.cacDocuments && user.cacDocuments.length > 0 ? (
                          user.cacDocuments.map((imageUrl, index) => (
                            <div key={index}>
                              <img
                                src={imageUrl}
                                alt={`Company's Documents ${index + 1}`}
                                className="documents-itemImg"
                                onClick={() => handleImageClick(imageUrl)}
                                style={{ cursor: 'pointer' }}
                              />

                              <ImageViewModal
                                title={'Company\'s Document'}
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
                    </span>

                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Utility Documents:</span>
                    <span className="itemValue">
                      <div className="documents-container">
                        {user.utilityBill && user.utilityBill.length > 0 ? (
                          user.utilityBill.map((imageUrl, index) => (
                            <div key={index}>
                              <img
                                src={imageUrl}
                                alt={`Company's Documents ${index + 1}`}
                                className="documents-itemImg"
                                onClick={() => handleImageClick(imageUrl)}
                                style={{ cursor: 'pointer' }}
                              />

                              <ImageViewModal
                                title={'Company\'s Document'}
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
                    </span>

                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Courier Lincense:</span>
                    <span className="itemValue">
                      <div className="documents-container">
                        {user.courierLicense && user.courierLicense.length > 0 ? (
                          user.courierLicense.map((imageUrl, index) => (
                            <div key={index}>
                              <img
                                src={imageUrl}
                                alt={`Company's Documents ${index + 1}`}
                                className="documents-itemImg"
                                onClick={() => handleImageClick(imageUrl)}
                                style={{ cursor: 'pointer' }}
                              />

                              <ImageViewModal
                                title={'Company\'s Document'}
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
                    </span>

                  </div>

                  <div className="detailItem">
                    <span className="itemKey">AMAC Documents:</span>
                    <span className="itemValue">
                      <div className="documents-container">
                        {user.amacDocuments && user.amacDocuments.length > 0 ? (
                          user.amacDocuments.map((imageUrl, index) => (
                            <div key={index}>
                              <img
                                src={imageUrl}
                                alt={`Company's Documents ${index + 1}`}
                                className="documents-itemImg"
                                onClick={() => handleImageClick(imageUrl)}
                                style={{ cursor: 'pointer' }}
                              />

                              <ImageViewModal
                                title={'Company\'s Document'}
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
                    </span>

                  </div>
                </div>
              </div>
            ) : (
              <div className="detailItem">
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
              </div>
            )}
          </div>
          <div className="right">
            <div className="featured">
              <div className="top">
                <h1 className="title">Total Earnings & Profits</h1>
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
                <div className="itemTitle">Total</div>
                <p className="amount">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })
                    .format(total)
                    .replace(".00", "")}
                </p>

                <div className="itemTitle">Profit <span className="percentage">(85%)</span></div>
                <p className="profit-amount">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })
                    .format(inFlow)
                    .replace(".00", "")}
                </p>

                <div className="itemTitle">Pay-Out <span className="percentage">(15%)</span></div>
                <p className="profit-amount">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })
                    .format(outFlow)
                    .replace(".00", "")}
                </p>

                <div className="summary">
                  <div className="left-summary">
                    <div className="item">
                      <div className="itemTitle">This Month</div>
                      <div className="itemResult positive">

                        <div className="resultAmount" style={{ color: "green" }}>
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          })
                            .format(mData)
                            .replace(".00", "")}
                        </div>
                      </div>

                      <div className="itemTitle">Total Trips</div>
                      <div className="itemResult positive">

                        <div className="resultAmount" style={{ color: "green" }}>
                          {earnL}
                        </div>
                      </div>
                      <div className="itemTitle">Total Riders</div>
                      <div className="itemResult positive">

                        <div className="resultAmount" style={{ color: "green" }}>
                          {riderL}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="right-summary">
                    <div className="item">
                      <div className="itemTitle">Cash Payments</div>
                      <div className="itemResult positive">

                        <div className="resultAmount" style={{ color: "green" }}>
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          })
                            .format(cashPayments)
                            .replace(".00", "")}
                        </div>
                      </div>

                      <div className="itemTitle">Card Payments</div>
                      <div className="itemResult positive">
                        <div className="resultAmount" style={{ color: "green" }}>
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          })
                            .format(cardPayments)
                            .replace(".00", "")}
                        </div>
                      </div>

                      <div className="itemTitle">To Be Balanced</div>
                      <div className="itemResult positive">
                        <div className="resultAmount" style={{ color: "green" }}>
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          })
                            .format(toReceive)
                            .replace(".00", "")}
                        </div>
                      </div>

                      <div className="itemTitle">To Pay</div>
                      <div className="itemResult positive">
                        <div className="resultAmount" style={{ color: "green" }}>
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          })
                            .format(payOut)
                            .replace(".00", "")}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Riders table */}
        <div className="bottom">
          <div className="table-navs">
            {/* Riders tab */}
            <h1 className={`title ${activeTab === "riders" ? "active" : ""}`} onClick={switchToRiders}>
              Riders
            </h1>
            {/* Earnings tab */}
            <h1 className={`title ${activeTab === "earnings" ? "active" : ""}`} onClick={switchToEarnings}>
              Earnings
            </h1>
          </div>
          {activeTab === "riders" && (<TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableCell">Rider Name</TableCell>
                  <TableCell className="tableCell">Email</TableCell>
                  <TableCell className="tableCell">Address</TableCell>
                  <TableCell className="tableCell">Location </TableCell>
                  <TableCell className="tableCell">Vehicle Number</TableCell>
                  <TableCell className="tableCell">Status</TableCell>
                  <TableCell className="tableCell">Date Joined</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rData.length !== 0 ? (
                  rData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="tableCell">
                        {row.FullName}
                      </TableCell>
                      <TableCell className="tableCell">{row.Email}</TableCell>
                      <TableCell className="tableCell">{row.Address}</TableCell>
                      <TableCell className="tableCell">{row.State}</TableCell>
                      <TableCell className="tableCell" width={200}>
                        {row["Vehicle Number"]}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row.Verified === "1" ? "Verified" : "Unverified"}
                      </TableCell>
                      <TableCell className="tableCell">
                        {new Date(row["Date Created"]).toLocaleDateString(
                          "en-US"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>)}

          {activeTab === "earnings" && (
            <TableContainer component={Paper} className="table">
              <Table sx={{ minWidth: 780 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="tableCell" width={80}>
                      Booking Number
                    </TableCell>
                    <TableCell className="tableCell" width={80}>
                      Package
                    </TableCell>
                    <TableCell className="tableCell" width={130}>
                      Customer Name
                    </TableCell>
                    <TableCell className="tableCell" width={80}>
                      Date
                    </TableCell>
                    <TableCell className="tableCell" width={50}>
                      Amount
                    </TableCell>
                    <TableCell className="tableCell" width={20}>
                      Payment Method
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length !== 0 ? (data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row["Booking Number"]}>
                      <TableCell className="tableCell">
                        {row["Booking Number"]}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row["Package Type"]}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row["Customer Name"]}
                      </TableCell>
                      <TableCell className="tableCell">
                        {new Date(row["Date Created"]).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="tableCell">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        })
                          .format(row["Amount"])
                          .replace(".00", "")}</TableCell>
                      <TableCell className="tableCell">
                        {row["Payment Method"]}
                      </TableCell>

                    </TableRow>
                  ))) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        No data available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {activeTab === "earnings" && (<TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />)}

          {activeTab === "riders" && (<TablePagination
            rowsPerPageOptions={[10, 20, 30]}
            component="div"
            count={rData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />)}

        </div>
      </div>
    </div>
  );
};

export default SingleCompany;
