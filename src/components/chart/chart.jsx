import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  YAxis,
  Bar,
} from "recharts";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

const Chart = ({ aspect, title }) => {
  const [lastMonthData, setLastMonthData] = useState([]);
  const [lastTwoMonthData, setLastTwoMonthData] = useState([]);
  const [lastThreeMonthData, setLastThreeMonthData] = useState([]);
  const [lastFourMonthData, setLastFourMonthData] = useState([]);
  const [lastFiveMonthData, setLastFiveMonthData] = useState([]);
  const [lastSixMonthData, setLastSixMonthData] = useState([]);

  useEffect(() => {
    getData();
  });

  const getData = async () => {
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

    // Calculate the first day of last month
    const firstDayOfLastTwoMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 2,
      1
    );

    // Calculate the last day of last month
    const lastDayOfLastTwoMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      0,
      23,
      59,
      59,
      999
    );

    // Calculate the first day of last month
    const firstDayOfLastThreeMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 3,
      1
    );

    // Calculate the last day of last month
    const lastDayOfLastThreeMonths = new Date(
      today.getFullYear(),
      today.getMonth() - 2,
      0,
      23,
      59,
      59,
      999
    );

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

    //Last Month's Earning Query
    const lastMonthQuery = query(
      collection(db, "Earnings"),
      where("timeStamp", ">=", firstDayOfLastMonth),
      where("timeStamp", "<=", lastDayOfLastMonth)
    );

    //Last Two Month's Earning Query
    const lastTwoMonthsQuery = query(
      collection(db, "Earnings"),
      where("timeStamp", ">=", firstDayOfLastTwoMonths),
      where("timeStamp", "<=", lastDayOfLastTwoMonths)
    );

    //Last Three Month's Earning Query
    const lastThreeMonthsQuery = query(
      collection(db, "Earnings"),
      where("timeStamp", ">=", firstDayOfLastThreeMonths),
      where("timeStamp", "<=", lastDayOfLastThreeMonths)
    );

    //Last Four Month's Earning Query
    const lastFourMonthsQuery = query(
      collection(db, "Earnings"),
      where("timeStamp", ">=", firstDayOfLastFourMonths),
      where("timeStamp", "<=", lastDayOfLastFourMonths)
    );

    //Last Five Month's Earning Query
    const lastFiveMonthsQuery = query(
      collection(db, "Earnings"),
      where("timeStamp", ">=", firstDayOfLastFiveMonths),
      where("timeStamp", "<=", lastDayOfLastFiveMonths)
    );

    //Last Six Month's Earning Query
    const lastSixMonthsQuery = query(
      collection(db, "Earnings"),
      where("timeStamp", ">=", firstDayOfLastSixMonths),
      where("timeStamp", "<=", lastDayOfLastSixMonths)
    );

    //Calculating a month ago amount
    getDocs(lastMonthQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      setLastMonthData(total);
    });

    //Calculating two months ago amount
    getDocs(lastTwoMonthsQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      setLastTwoMonthData(total);
    });

    //Calculating three months ago amount
    getDocs(lastThreeMonthsQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      setLastThreeMonthData(total);
    });

    //Calculating four months ago amount
    getDocs(lastFourMonthsQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      setLastFourMonthData(total);
    });

    //Calculating five months ago amount
    getDocs(lastFiveMonthsQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      setLastFiveMonthData(total);
    });

    //Calculating six months ago amount
    getDocs(lastSixMonthsQuery).then((querySnapshot) => {
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      setLastSixMonthData(total);
    });
  };

  const getPreviousMonth = (monthsAgo = 1) => {
    const today = new Date();
    today.setMonth(today.getMonth() - monthsAgo);
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(today);
  };

  const data = [
    { name: getPreviousMonth(6), Total: lastSixMonthData },
    { name: getPreviousMonth(5), Total: lastFiveMonthData },
    { name: getPreviousMonth(4), Total: lastFourMonthData },
    { name: getPreviousMonth(3), Total: lastThreeMonthData },
    { name: getPreviousMonth(2), Total: lastTwoMonthData },
    { name: getPreviousMonth(), Total: lastMonthData },
  ];
  return (
    <div className="chart">
      <div className="c-top">
        <div className="title">{title}</div>
      </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <BarChart width={800} height={800} data={data}>
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis />
          <Tooltip wrapperStyle={{ width: 100, backgroundColor: "#ccc" }} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Bar dataKey="Total" fill="#8884d8" barSize={25} label={{ position: "top" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
