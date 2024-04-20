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
  const [lastWeekData, setLastWeekData] = useState([]);
  const [twoWeeksData, setTwoWeeksData] = useState([]);
  const [lMData, setLMData] = useState([]);
  const [fieldSum, setFieldSum] = useState(0);
  const [diff, setDiff] = useState(null);

  useEffect(() => {
    const FetchData = async () => {
      let list = [];
      let total = 0;
      let startOfPeriod, endOfPeriod;

      if (Selected === "total") {
        const sumEarnings = async () => {
          const querySnapshot = await getDocs(
            query(
              collection(db, "Earnings"),
              // where("Status", "==", "completed")
            )
          );

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });

          setFieldSum((total * 0.15).toFixed(0));
        };
        sumEarnings();
      } else if (Selected === "yesterday") {
        const today = new Date();
        // Calculate the date range for 1 day ago
        const oneDayAgo = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
        const startOfOneDayAgo = new Date(
          oneDayAgo.getFullYear(),
          oneDayAgo.getMonth(),
          oneDayAgo.getDate(),
          0,
          0,
          0,
          0
        );
        const endOfOneDayAgo = new Date(
          oneDayAgo.getFullYear(),
          oneDayAgo.getMonth(),
          oneDayAgo.getDate(),
          23,
          59,
          59,
          999
        );

        console.log("start of yesterday: ", startOfOneDayAgo);
        console.log("end of yesterday: ", endOfOneDayAgo);

        const q = query(
          collection(db, "Earnings"),
          where("DateCreated", ">=", startOfOneDayAgo.toISOString()),
          where("DateCreated", "<=", endOfOneDayAgo.toISOString())
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        setData(list);
        setFieldSum((total * 0.15).toFixed(0));
      } else {
        const today = new Date();

        // Calculate the start and end dates based on the selected filter
        if (Selected === "7") {
          // Last Week
          startOfPeriod = new Date(today);
          startOfPeriod.setDate(today.getDate() - today.getDay() - 7);
          startOfPeriod.setHours(0, 0, 0, 0);

          endOfPeriod = new Date(today);
          endOfPeriod.setDate(today.getDate() - today.getDay() - 1);
          endOfPeriod.setHours(23, 59, 59, 999);
        } else if (Selected === "30") {
          // Last Month
          startOfPeriod = new Date(today);
          startOfPeriod.setMonth(today.getMonth() - 1, 1);
          startOfPeriod.setHours(0, 0, 0, 0);

          endOfPeriod = new Date(startOfPeriod.getFullYear(), startOfPeriod.getMonth() + 1, 0);
          endOfPeriod.setHours(23, 59, 59, 999);
        } else if (Selected === "60") {
          // Two Months Ago
          startOfPeriod = new Date(today);
          startOfPeriod.setMonth(today.getMonth() - 2, 1);
          startOfPeriod.setHours(0, 0, 0, 0);

          endOfPeriod = new Date(today);
          endOfPeriod.setMonth(today.getMonth() - 1, 0);
          endOfPeriod.setHours(23, 59, 59, 999);
        } else if (Selected === "90") {
          // Two Months Ago
          startOfPeriod = new Date(today);
          startOfPeriod.setMonth(today.getMonth() - 3, 1);
          startOfPeriod.setHours(0, 0, 0, 0);

          endOfPeriod = new Date(today);
          endOfPeriod.setMonth(today.getMonth() - 2, 0);
          endOfPeriod.setHours(23, 59, 59, 999);
        } else if (Selected === "120") {
          // Two Months Ago
          startOfPeriod = new Date(today);
          startOfPeriod.setMonth(today.getMonth() - 4, 1);
          startOfPeriod.setHours(0, 0, 0, 0);

          endOfPeriod = new Date(today);
          endOfPeriod.setMonth(today.getMonth() - 3, 0);
          endOfPeriod.setHours(23, 59, 59, 999);
        } else if (Selected === "150") {
          // Two Months Ago
          startOfPeriod = new Date(today);
          startOfPeriod.setMonth(today.getMonth() - 5, 1);
          startOfPeriod.setHours(0, 0, 0, 0);

          endOfPeriod = new Date(today);
          endOfPeriod.setMonth(today.getMonth() - 4, 0);
          endOfPeriod.setHours(23, 59, 59, 999);
        } else if (Selected === "180") {
          // Two Months Ago
          startOfPeriod = new Date(today);
          startOfPeriod.setMonth(today.getMonth() - 6, 1);
          startOfPeriod.setHours(0, 0, 0, 0);

          endOfPeriod = new Date(today);
          endOfPeriod.setMonth(today.getMonth() - 5, 0);
          endOfPeriod.setHours(23, 59, 59, 999);
        }

        // Use startOfWeek and endOfWeek in your Firestore query
        const earningsQuery = query(
          collection(db, "Earnings"),
          where("DateCreated", ">=", startOfPeriod.toISOString()),
          where("DateCreated", "<=", endOfPeriod.toISOString())
        );

        const earningsSnapshot = await getDocs(earningsQuery);

        earningsSnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });

        setData(list);
        setFieldSum((total * 0.15).toFixed(0));
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
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let startOfPeriod, endOfPeriod;


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
      collection(db, "Earnings"),
      where("timeStamp", "<=", lastDayOfLastMonth),
      where("timeStamp", ">=", firstDayOfLastMonth)
    );

    const thisMonthQuery = query(
      collection(db, "Earnings"),
      where("timeStamp", ">=", firstDayOfMonth),
      where("timeStamp", "<=", today)
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
      setLMData((total * 0.15).toFixed(0));
    });

    //A week ago
    const oneWeekQuery = async () => {
      startOfPeriod = new Date(today);
      startOfPeriod.setDate(today.getDate() - today.getDay() - 7);
      startOfPeriod.setHours(0, 0, 0, 0);

      endOfPeriod = new Date(today);
      endOfPeriod.setDate(today.getDate() - today.getDay() - 1);
      endOfPeriod.setHours(23, 59, 59, 999);

      const lastWeekEarnings = query(
        collection(db, "Earnings"),
        where("DateCreated", ">=", startOfPeriod.toISOString()),
        where("DateCreated", "<=", endOfPeriod.toISOString())
      );

      //Calculating a week ago amount
      const lastWeekEarningsSnapshot = await getDocs(lastWeekEarnings);
      let total = 0;

      lastWeekEarningsSnapshot.forEach((doc) => {
        const data = doc.data();
        // console.log("Amount", data.Amount);
        total += parseFloat(data.Amount);
      });

      setLastWeekData((total * 0.15).toFixed(0));
    };

    //Two weeks ago
    const twoWeeksQuery = async () => {
      startOfPeriod = new Date(today);
      startOfPeriod.setDate(today.getDate() - today.getDay() - 14);
      startOfPeriod.setHours(0, 0, 0, 0);

      endOfPeriod = new Date(today);
      endOfPeriod.setDate(today.getDate() - today.getDay() - 8);
      endOfPeriod.setHours(23, 59, 59, 999);

      const twoWeekEarnings = query(
        collection(db, "Earnings"),
        where("DateCreated", ">=", startOfPeriod.toISOString()),
        where("DateCreated", "<=", endOfPeriod.toISOString())
      );

      //Calculating a week ago amount
      const twoWeekEarningsSnapshot = await getDocs(twoWeekEarnings);
      let total = 0;

      twoWeekEarningsSnapshot.forEach((doc) => {
        const data = doc.data();
        // console.log("Amounts Two", data.Amount);
        total += parseFloat(data.Amount);
      });

      setTwoWeeksData((total * 0.15).toFixed(0));
    };

    await oneWeekQuery();
    await twoWeeksQuery();
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
    .format(lastWeekData)
    .replace(".00", "");

  const formattedTWeekAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(twoWeeksData)
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
          <option value="7">Last Week</option>
          <option value="30">{getPreviousMonth()}</option>
          <option value="60">{getPreviousMonth(2)}</option>
          <option value="90">{getPreviousMonth(3)}</option>
          <option value="120">{getPreviousMonth(4)}</option>
          <option value="150">{getPreviousMonth(5)}</option>
          <option value="180">{getPreviousMonth(6)}</option>
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
              {lastWeekData < twoWeeksData ? (
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
              {lastWeekData < twoWeeksData ? (
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
              {twoWeeksData < lastWeekData ? (
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
              {twoWeeksData < lastWeekData ? (
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
              {lMData < fieldSum ? (
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
              {lMData < fieldSum ? (
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
