import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import { useEffect, useState } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Widget = ({ type }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(null);
  const [diff, setDiff] = useState(null);
  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        nav: "./users",
        link: "see all users",
        query: "Users",
        icon: (
          <PersonOutlineIcon
            className="icon"
            style={{
              color: "#e290fa",
              backgroundColor: "#dcf3fd",
            }}
          />
        ),
      };
      break;

    case "driver":
      data = {
        title: "RIDERS",
        isMoney: false,
        nav: "./drivers",
        link: "see all riders",
        query: "Drivers",
        icon: (
          <DirectionsCarIcon
            className="icon"
            style={{
              color: "#e290fa",
              backgroundColor: "#dcf3fd",
            }}
          />
        ),
      };
      break;

    case "booking":
      data = {
        title: "BOOKINGS",
        isMoney: false,
        nav: "./bookings",
        link: "see all bookings",
        query: "Bookings",
        icon: (
          <LibraryBooksIcon
            className="icon"
            style={{
              color: "#e290fa",
              backgroundColor: "#dcf3fd",
            }}
          />
        ),
      };
      break;

    case "company":
      data = {
        title: "COMPANIES",
        isMoney: false,
        nav: "./company",
        link: "see all companies",
        query: "Companies",
        icon: (
          <EmojiTransportationIcon
            className="icon"
            style={{
              color: "#e290fa",
              backgroundColor: "#dcf3fd",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

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

      const thisMonthQuery = query(
        collection(db, data.query),
        where("timeStamp", "<=", today),
        where("timeStamp", ">", firstDayOfMonth)
      );
      const prevMonthQuery = query(
        collection(db, data.query),
        where("timeStamp", "<=", lastDayOfLastMonth),
        where("timeStamp", ">", firstDayOfLastMonth)
      );

      const thisMonthData = await getDocs(thisMonthQuery);
      const prevMonthData = await getDocs(prevMonthQuery);

      setAmount(thisMonthData.docs.length);
      //   setDiff(
      //     ((lastMonthData.docs.length - prevMonthData.docs.length) /
      //       prevMonthData.docs.length) *
      //       100
      //   ).toFixed(0);

      let currentMonthPercentageDiff = 0;

      currentMonthPercentageDiff =
        ((thisMonthData.docs.length - prevMonthData.docs.length) /
          prevMonthData.docs.length) *
        100;

      const roundedDiff = currentMonthPercentageDiff.toFixed(0); // round up to 0 decimal places

      setDiff(roundedDiff);
    };
    fetchData();
  }, [data]);

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "NGN"} {amount}
        </span>
        <span className="link" onClick={() => navigate(data.nav)}>
          {data.link}
        </span>
      </div>
      <div className="right">
        <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
          {diff < 0 ? (
            <KeyboardArrowDownIcon style={{ color: "red" }} fontSize="small" />
          ) : (
            <KeyboardArrowUpIcon style={{ color: "green" }} fontSize="small" />
          )}
          {diff === "Infinity" ? "0" : diff}%
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
