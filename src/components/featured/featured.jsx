import "./featured.scss";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState, useEffect } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../../firebase";

const Featured = () => {
  const [Selected, setSelected] = useState("total");
  const [data, setData] = useState([]);
  const [oWData, setOData] = useState([]);
  const [lWData, setLData] = useState([]);
  const [lMData, setLMData] = useState([]);
  const [fieldSum, setFieldSum] = useState(0);
  const [diff, setDiff] = useState(null);

  useEffect(() => {
    const FetchData = async () => {
      let list = [];

      if (Selected === "yesterday") {
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000); // Timestamp for 1 day ago // 24 hours in milliseconds
        const q = query(
          collection(db, "Bookings"),
          where("timeStamp", "<=", today),
          where("timeStamp", ">", yesterday)
        );
        const querySnapshot = await getDocs(q);
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });

        setData(list);
        setFieldSum(total);
      } else if (Selected === "last_week") {
        const today = new Date();
        const sevenDaysAgo = new Date(
          today.getTime() - 7 * 24 * 60 * 60 * 1000
        );
        const q = query(
          collection(db, "Bookings"),
          where("Status", "==", "completed"),
          where("timeStamp", ">=", sevenDaysAgo),
          where("timeStamp", "<=", today)
        );
        const querySnapshot = await getDocs(q);

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });

        setData(list);
        setFieldSum(total);
      } else if (Selected === getPreviousMonth()) {
        const today = new Date();
        // Calculate the first day of last month
        const firstDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );

        // Calculate the last day of last month
        const lastDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0,
          23,
          59,
          59,
          999
        );
        const q = query(
          collection(db, "Bookings"),
          where("Status", "==", "completed"),
          where("timeStamp", "<=", lastDayOfLastMonth),
          where("timeStamp", ">=", firstDayOfLastMonth)
        );
        const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //   list.push({ id: doc.id, ...doc.data() });
        //   // doc.data() is never undefined for query doc snapshots
        // });

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });

        setData(list);
        setFieldSum(total);
      } else if (Selected === getPreviousMonth(2)) {
        const today = new Date();
        // Calculate the first day of last two months
        const firstDayOfLastTwoMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 2,
          1
        );

        // Calculate the last day of last two months
        const lastDayOfLastTwoMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          0,
          23,
          59,
          59,
          999
        );
        const q = query(
          collection(db, "Bookings"),
          where("Status", "==", "completed"),
          where("timeStamp", "<=", lastDayOfLastTwoMonth),
          where("timeStamp", ">=", firstDayOfLastTwoMonth)
        );
        const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //   list.push({ id: doc.id, ...doc.data() });
        //   // doc.data() is never undefined for query doc snapshots
        // });

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });

        setData(list);
        setFieldSum(total);
      } else if (Selected === getPreviousMonth(3)) {
        const today = new Date();
        // Calculate the first day of last three months
        const firstDayOfLastThreeMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 3,
          1
        );

        // Calculate the last day of last three months
        const lastDayOfLastThreeMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 2,
          0,
          23,
          59,
          59,
          999
        );
        const q = query(
          collection(db, "Bookings"),
          where("Status", "==", "completed"),
          where("timeStamp", "<=", lastDayOfLastThreeMonth),
          where("timeStamp", ">=", firstDayOfLastThreeMonth)
        );
        const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //   list.push({ id: doc.id, ...doc.data() });
        //   // doc.data() is never undefined for query doc snapshots
        // });

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });

        setData(list);
        setFieldSum(total);
      }
      //Calculate for four month ago earnings
      else if (Selected === getPreviousMonth(4)) {
        // Calculate today
        const today = new Date();

        // Calculate the first day of last month
        const firstDayOfLastFourMonths = new Date(
          today.getFullYear(),
          today.getMonth() - 4,
          1
        );

        // Calculate the last day of last month
        const lastDayOfLastFourMonths = new Date(
          today.getFullYear(),
          today.getMonth() - 3,
          0,
          23,
          59,
          59,
          999
        );

        const q = query(
          collection(db, "Bookings"),
          where("Status", "==", "completed"),
          where("timeStamp", ">=", firstDayOfLastFourMonths),
          where("timeStamp", "<=", lastDayOfLastFourMonths)
        );
        const querySnapshot = await getDocs(q);

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setData(list);
        setFieldSum(total);
      }

      //Calculate for five month ago earnings
      else if (Selected === getPreviousMonth(5)) {
        // Calculate today
        const today = new Date();

        // Calculate the first day of last month
        const firstDayOfLastFiveMonths = new Date(
          today.getFullYear(),
          today.getMonth() - 5,
          1
        );

        // Calculate the last day of last month
        const lastDayOfLastFiveMonths = new Date(
          today.getFullYear(),
          today.getMonth() - 4,
          0,
          23,
          59,
          59,
          999
        );

        const q = query(
          collection(db, "Bookings"),
          where("Status", "==", "completed"),
          where("timeStamp", ">=", firstDayOfLastFiveMonths),
          where("timeStamp", "<=", lastDayOfLastFiveMonths)
        );
        const querySnapshot = await getDocs(q);

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setData(list);
        setFieldSum(total);
      }

      //Calculate for six month ago earnings
      else if (Selected === getPreviousMonth(6)) {
        // Calculate today
        const today = new Date();

        // Calculate the first day of last month
        const firstDayOfLastSixMonths = new Date(
          today.getFullYear(),
          today.getMonth() - 6,
          1
        );

        // Calculate the last day of last month
        const lastDayOfLastSixMonths = new Date(
          today.getFullYear(),
          today.getMonth() - 5,
          0,
          23,
          59,
          59,
          999
        );

        const q = query(
          collection(db, "Bookings"),
          where("Status", "==", "completed"),
          where("timeStamp", ">=", firstDayOfLastSixMonths),
          where("timeStamp", "<=", lastDayOfLastSixMonths)
        );
        const querySnapshot = await getDocs(q);

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setData(list);
        setFieldSum(total);
      } else if (Selected === "total") {
        const sumEarnings = async () => {
          const querySnapshot = await getDocs(
            query(
              collection(db, "Bookings"),
              where("Status", "==", "completed")
            )
          );

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });

          setFieldSum(total);
        };
        sumEarnings();
      }
    };
    FetchData();
  }, [Selected, data]);

  const getPreviousMonth = (monthsAgo = 1) => {
    const today = new Date();
    today.setMonth(today.getMonth() - monthsAgo);
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(today);
  };

  useEffect(() => {
    getData();
  });

  const getData = async () => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeekAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Calculate the first day of last month
    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    // Calculate the last day of last month
    const lastDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    const lastMonthQuery = query(
      collection(db, "Bookings"),
      where("Status", "==", "completed"),
      where("timeStamp", "<=", lastDayOfLastMonth),
      where("timeStamp", ">=", firstDayOfLastMonth)
    );

    const thisMonthQuery = query(
      collection(db, "Bookings"),
      where("Status", "==", "completed"),
      where("timeStamp", ">=", firstDayOfMonth),
      where("timeStamp", "<=", today)
    );

    const oneWeekQuery = query(
      collection(db, "Bookings"),
      where("Status", "==", "completed"),
      where("timeStamp", "<=", today),
      where("timeStamp", ">", oneWeekAgo)
    );
    const twoWeekQuery = query(
      collection(db, "Bookings"),
      where("Status", "==", "completed"),
      where("timeStamp", "<=", oneWeekAgo),
      where("timeStamp", ">", twoWeekAgo)
    );

    const lastMonthData = await getDocs(lastMonthQuery);
    const thisMonthData = await getDocs(thisMonthQuery);

    //Getting the percentage difference
    const lastMonthTotalEarnings = lastMonthData.docs.reduce(
      (total, doc) => total + parseFloat(doc.data().Amount),
      0
    );
    const thisMonthTotalEarnings = thisMonthData.docs.reduce(
      (total, doc) => total + parseFloat(doc.data().Amount),
      0
    );

    let currentMonthPercentageDiff = 0;
    if (lastMonthTotalEarnings > 0) {
      currentMonthPercentageDiff =
        ((thisMonthTotalEarnings - lastMonthTotalEarnings) /
          lastMonthTotalEarnings) *
        100;
    } else {
      currentMonthPercentageDiff = 100;
    }

    const roundedDiff = currentMonthPercentageDiff.toFixed(0); // round up to 2 decimal places

    setDiff(roundedDiff);

    //Calculating a month ago amount
    getDocs(lastMonthQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      setLMData(total);
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
      setLData(total);
    });
  };

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(fieldSum)
    .replace(".00", "");

  const formattedOWDataAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(oWData)
    .replace(".00", "");

  const formattedTWeekAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(lWData)
    .replace(".00", "");

  const formattedLMDataAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(lMData)
    .replace(".00", "");

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Revenue</h1>
        <select
          className="chart-select"
          onChange={(e) => {
            e.preventDefault();
            setSelected(e.target.value);
          }}
        >
          <option value="total">Total</option>
          <option value="yesterday">Yesterday</option>
          <option value="last_week">Last Week</option>
          <option value={getPreviousMonth()}>{getPreviousMonth()}</option>
          <option value={getPreviousMonth(2)}>{getPreviousMonth(2)}</option>
          <option value={getPreviousMonth(3)}>{getPreviousMonth(3)}</option>
          <option value={getPreviousMonth(4)}>{getPreviousMonth(4)}</option>
          <option value={getPreviousMonth(5)}>{getPreviousMonth(5)}</option>
          <option value={getPreviousMonth(6)}>{getPreviousMonth(6)}</option>
        </select>
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={diff} text={`${diff}%`} strokeWidth={5} />
        </div>
        <p className="title">Earnings for {Selected}</p>
        <p className="amount">{formattedAmount}</p>
        <p className="desc">This is the total earnigs from completed trips</p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Last Week</div>
            <div className="itemResult positive">
              {oWData > lWData ? (
                <KeyboardArrowUpIcon
                  style={{ color: "green" }}
                  fontSize="small"
                />
              ) : (
                <KeyboardArrowDownIcon
                  style={{ color: "red" }}
                  fontSize="small"
                />
              )}
              {oWData > lWData ? (
                <div className="resultAmount" style={{ color: "green" }}>
                  {formattedOWDataAmount}
                </div>
              ) : (
                <div className="resultAmount" style={{ color: "red" }}>
                  {formattedOWDataAmount}
                </div>
              )}
            </div>
          </div>

          <div className="item">
            <div className="itemTitle">Two Weeks Ago</div>
            <div className="itemResult positive">
              {lWData > oWData ? (
                <KeyboardArrowUpIcon
                  style={{ color: "green" }}
                  fontSize="small"
                />
              ) : (
                <KeyboardArrowDownIcon
                  style={{ color: "red" }}
                  fontSize="small"
                />
              )}
              {lWData > oWData ? (
                <div className="resultAmount" style={{ color: "green" }}>
                  {formattedTWeekAmount}
                </div>
              ) : (
                <div className="resultAmount" style={{ color: "red" }}>
                  {formattedTWeekAmount}
                </div>
              )}
            </div>
          </div>

          <div className="item">
            <div className="itemTitle">Last Month</div>
            <div className="itemResult positive">
              {lMData > fieldSum ? (
                <KeyboardArrowUpIcon
                  style={{ color: "green" }}
                  fontSize="small"
                />
              ) : (
                <KeyboardArrowDownIcon
                  style={{ color: "red" }}
                  fontSize="small"
                />
              )}
              {lMData > fieldSum ? (
                <div className="resultAmount" style={{ color: "green" }}>
                  {formattedLMDataAmount}
                </div>
              ) : (
                <div className="resultAmount" style={{ color: "red" }}>
                  {formattedLMDataAmount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
