import "./chart.scss";
import {
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
  const [monthlyData, setMonthlyData] = useState([]);


  useEffect(() => {
    getData();
  });

  const getData = async () => {
    const today = new Date();
    const monthData = [];

    for (let i = 0; i < 6; i++) {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59, 999);

      const earningsQuery = query(
        collection(db, "Earnings"),
        where("DateCreated", ">=", firstDayOfMonth.toISOString()),
        where("DateCreated", "<=", lastDayOfMonth.toISOString())
      );

      try {
        const querySnapshot = await getDocs(earningsQuery);
        let total = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });

        monthData.push({
          name: getPreviousMonth(i),
          Total: total,
          FifteenPercent: total * 0.15
        });
      } catch (error) {
        console.error("Error fetching earnings data:", error);
        // Handle error
      }
    }

    setMonthlyData(monthData.reverse());
  };

  const getPreviousMonth = (monthsAgo = 0) => {
    const today = new Date();
    today.setMonth(today.getMonth() - monthsAgo);
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(today);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const fifteenPercentValue = (payload[0].value * 0.15).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
      const formattedValue = payload[0].value.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="intro">{`Total: ${formattedValue}`}</p>
          <p className="intro">{`Profit: ${fifteenPercentValue}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="chart">
      <div className="c-top">
        <div className="title">{title}</div>
      </div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <BarChart width={800} height={800} data={monthlyData}>
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{
            backgroundColor: "#f5f5f5",
            border: "1px solid #ccc",
            padding: "10px",
            fontSize: "14px",
          }} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Bar dataKey="Total" fill="#8884d8" barSize={25} label={{ position: "top" }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
