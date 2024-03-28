import "../featured/featured.scss";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";


const EarningProfits = () => {
  const [Selected, setSelected] = useState("Total");
  const [data, setData] = useState([]);
  const [fieldSum, setFieldSum] = useState(0);
  const [profitSum, setProfitSum] = useState(0);
  const [lastMonthTotal, setLastMonthTotal] = useState(0);
  const [lastMonthProfit, setLastMonthProfit] = useState(0);
  const [lastTwoMonthTotal, setLastTwoMonthTotal] = useState(0);
  const [lastTwoMonthProfit, setLastTwoMonthProfit] = useState(0);
  const [lastThreeMonthTotal, setLastThreeMonthTotal] = useState(0);
  const [lastThreeMonthProfit, setLastThreeMonthProfit] = useState(0);
  const [lastFourMonthTotal, setLastFourMonthTotal] = useState(0);
  const [lastFourMonthProfit, setLastFourMonthProfit] = useState(0);
  const [lastFiveMonthTotal, setLastFiveMonthTotal] = useState(0);
  const [lastFiveMonthProfit, setLastFiveMonthProfit] = useState(0);
  const [lastSixMonthTotal, setLastSixMonthTotal] = useState(0);
  const [lastSixMonthProfit, setLastSixMonthProfit] = useState(0);


  //Calculate for last month earnings
  useEffect(() => {
    const fetchLastMonthTotal = async () => {

      let list = [];
      // Calculate today
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
        collection(db, "Earnings"),
        where("DateCreated", ">=", firstDayOfLastMonth.toISOString()),
        where("DateCreated", "<=", lastDayOfLastMonth.toISOString()),
      );
      const querySnapshot = await getDocs(q);

      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      // Calculating 15% of the total earnings
      const fifteenPercent = total * 0.15;
      const roundPercentage = fifteenPercent.toFixed(0);



      setData(list);
      setLastMonthTotal(total);
      setLastMonthProfit(roundPercentage);
    }


    fetchLastMonthTotal();
  }, [lastMonthTotal, lastMonthProfit]);


  //Calculate for last two month earnings
  useEffect(() => {
    const fetchTwoMonthTotal = async () => {

      // Calculate today
      const today = new Date();

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

      const q = query(
        collection(db, "Earnings"),
        where("DateCreated", ">=", firstDayOfLastTwoMonths.toISOString()),
        where("DateCreated", "<=", lastDayOfLastTwoMonths.toISOString()),
      );
      const querySnapshot = await getDocs(q);

      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      // Calculating 15% of the total earnings
      const fifteenPercent = total * 0.15;
      const roundPercentage = fifteenPercent.toFixed(0);



      setLastTwoMonthTotal(total);
      setLastTwoMonthProfit(roundPercentage);
    }


    fetchTwoMonthTotal();
  }, [lastTwoMonthTotal, lastTwoMonthProfit]);

  //Calculate for last three month earnings
  useEffect(() => {
    const fetchThreeMonthTotal = async () => {

      // Calculate today
      const today = new Date();

      // Calculate the first day of last 3 month
      const firstDayOfLastThreeMonths = new Date(
        today.getFullYear(),
        today.getMonth() - 3,
        1
      );

      // Calculate the last day of last 3 month
      const lastDayOfLastThreeMonths = new Date(
        today.getFullYear(),
        today.getMonth() - 2,
        0,
        23,
        59,
        59,
        999
      );

      const q = query(
        collection(db, "Earnings"),
        where("timeStamp", ">=", firstDayOfLastThreeMonths),
        where("timeStamp", "<=", lastDayOfLastThreeMonths)
      );
      const querySnapshot = await getDocs(q);

      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      // Calculating 15% of the total earnings
      const fifteenPercent = total * 0.15;
      const roundPercentage = fifteenPercent.toFixed(0);



      setLastThreeMonthTotal(total);
      setLastThreeMonthProfit(roundPercentage);
    }


    fetchThreeMonthTotal();
  }, [lastThreeMonthTotal, lastThreeMonthProfit]);

  //Calculate for last four month earnings
  useEffect(() => {
    const fetchFourMonthTotal = async () => {

      // Calculate today
      const today = new Date();

      // Calculate the first day of last four month
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
        collection(db, "Earnings"),
        where("timeStamp", ">=", firstDayOfLastFourMonths),
        where("timeStamp", "<=", lastDayOfLastFourMonths)
      );
      const querySnapshot = await getDocs(q);

      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      // Calculating 15% of the total earnings
      const fifteenPercent = total * 0.15;
      const roundPercentage = fifteenPercent.toFixed(0);



      setLastFourMonthTotal(total);
      setLastFourMonthProfit(roundPercentage);
    }


    fetchFourMonthTotal();
  }, [lastFourMonthTotal, lastFourMonthProfit]);

  //Calculate for last five month earnings
  useEffect(() => {
    const fetchFourMonthTotal = async () => {

      // Calculate today
      const today = new Date();

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
        collection(db, "Earnings"),
        where("DateCreated", ">=", firstDayOfLastFiveMonths.toISOString()),
        where("DateCreated", "<=", lastDayOfLastFiveMonths.toISOString())
      );
      const querySnapshot = await getDocs(q);

      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      // Calculating 15% of the total earnings
      const fifteenPercent = total * 0.15;
      const roundPercentage = fifteenPercent.toFixed(0);



      setLastFiveMonthTotal(total);
      setLastFiveMonthProfit(roundPercentage);
    }


    fetchFourMonthTotal();
  }, [lastFiveMonthTotal, lastFiveMonthProfit]);

  //Calculate for last six month earnings
  useEffect(() => {
    const fetchFourMonthTotal = async () => {

      // Calculate today
      const today = new Date();
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
        collection(db, "Earnings"),
        where("DateCreated", ">=", firstDayOfLastSixMonths.toISOString()),
        where("DateCreated", "<=", lastDayOfLastSixMonths.toISOString())
      );
      const querySnapshot = await getDocs(q);

      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        total += parseFloat(data.Amount);
      });
      // Calculating 15% of the total earnings
      const fifteenPercent = total * 0.15;
      const roundPercentage = fifteenPercent.toFixed(0);



      setLastSixMonthTotal(total);
      setLastSixMonthProfit(roundPercentage);
    }


    fetchFourMonthTotal();
  }, [lastFiveMonthTotal, lastFiveMonthProfit]);

  // Monthly filtering
  useEffect(() => {

    const FetchData = async () => {
      let list = [];

      //Calculate for current month earnings and profits
      if (Selected === getPreviousMonth(0)) {
        const today = new Date();
        const startOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );

        const q = query(
          collection(db, "Earnings"),
          where("timeStamp", ">=", startOfMonth),
          where("timeStamp", "<=", endOfMonth)
        );
        const querySnapshot = await getDocs(q);

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });

        // Calculating 15% of the total earnings
        const eightyFivePercent = total * 0.15;
        const roundPercentage = eightyFivePercent.toFixed(0);


        setData(list);
        setFieldSum(total);
        setProfitSum(roundPercentage);
      }

      //Calculate for last month earnings
      else if (Selected === getPreviousMonth()) {
        // Calculate today
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
          collection(db, "Earnings"),
          where("timeStamp", ">=", firstDayOfLastMonth),
          where("timeStamp", "<=", lastDayOfLastMonth)
        );
        const querySnapshot = await getDocs(q);

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        // Calculating 15% of the total earnings
        const eightyFivePercent = total * 0.15;
        const roundPercentage = eightyFivePercent.toFixed(0);


        setData(list);
        setFieldSum(total);
        setProfitSum(roundPercentage);
      }

      //Calculate for two month ago earnings
      else if (Selected === getPreviousMonth(2)) {
        // Calculate today
        const today = new Date();

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

        const q = query(
          collection(db, "Earnings"),
          where("timeStamp", ">=", firstDayOfLastTwoMonths),
          where("timeStamp", "<=", lastDayOfLastTwoMonths)
        );
        const querySnapshot = await getDocs(q);

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        // Calculating 15% of the total earnings
        const eightyFivePercent = total * 0.15;
        const roundPercentage = eightyFivePercent.toFixed(0);


        setData(list);
        setFieldSum(total);
        setProfitSum(roundPercentage);
      }

      //Calculate for three month ago earnings
      else if (Selected === getPreviousMonth(3)) {
        // Calculate today
        const today = new Date();

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

        const q = query(
          collection(db, "Earnings"),
          where("timeStamp", ">=", firstDayOfLastThreeMonths),
          where("timeStamp", "<=", lastDayOfLastThreeMonths)
        );
        const querySnapshot = await getDocs(q);

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });
        // Calculating 15% of the total earnings
        const eightyFivePercent = total * 0.15;
        const roundPercentage = eightyFivePercent.toFixed(0);


        setData(list);
        setFieldSum(total);
        setProfitSum(roundPercentage);
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
          collection(db, "Earnings"),
          where("timeStamp", ">=", firstDayOfLastFourMonths),
          where("timeStamp", "<=", lastDayOfLastFourMonths)
        );
        const querySnapshot = await getDocs(q);

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });

        // Calculating 15% of the total earnings
        const eightyFivePercent = total * 0.15;
        const roundPercentage = eightyFivePercent.toFixed(0);

        setData(list);
        setFieldSum(total);
        setProfitSum(roundPercentage);
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
          collection(db, "Earnings"),
          where("timeStamp", ">=", firstDayOfLastFiveMonths),
          where("timeStamp", "<=", lastDayOfLastFiveMonths)
        );
        const querySnapshot = await getDocs(q);

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });

        // Calculating 15% of the total earnings
        const eightyFivePercent = total * 0.15;
        const roundPercentage = eightyFivePercent.toFixed(0);


        setData(list);
        setFieldSum(total);
        setProfitSum(roundPercentage);
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
          collection(db, "Earnings"),
          where("timeStamp", ">=", firstDayOfLastSixMonths),
          where("timeStamp", "<=", lastDayOfLastSixMonths)
        );
        const querySnapshot = await getDocs(q);

        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.Amount);
        });

        // Calculating 15% of the total earnings
        const eightyFivePercent = total * 0.15;
        const roundPercentage = eightyFivePercent.toFixed(0);


        setData(list);
        setFieldSum(total);
        setProfitSum(roundPercentage);
      }

      // Calculate for all the earnings
      else if (Selected === "Total") {
        const sumEarnings = async () => {
          const querySnapshot = await getDocs(
            query(
              collection(db, "Earnings"),
            )
          );

          let total = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            total += parseFloat(data.Amount);
          });

          // Calculating 15% of the total earnings
          const eightyFivePercent = total * 0.15;
          const roundPercentage = eightyFivePercent.toFixed(0);

          setFieldSum(total);
          setProfitSum(roundPercentage);
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


  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount).replace(".00", "");
  }

  const formattedAmount = formatCurrency(fieldSum);
  const formattedLastMonthTotal = formatCurrency(lastMonthTotal);
  const formattedLastTwoMonthTotal = formatCurrency(lastTwoMonthTotal);
  const formattedLastThreeMonthTotal = formatCurrency(lastThreeMonthTotal);
  const formattedLastFourMonthTotal = formatCurrency(lastFourMonthTotal);
  const formattedLastFiveMonthTotal = formatCurrency(lastFiveMonthTotal);
  const formattedLastSixMonthTotal = formatCurrency(lastSixMonthTotal);

  const formattedProfit = formatCurrency(profitSum);
  const formattedLastMonthProfit = formatCurrency(lastMonthProfit);
  const formattedLastTwoMonthProfit = formatCurrency(lastTwoMonthProfit);
  const formattedLastThreeMonthProfit = formatCurrency(lastThreeMonthProfit);
  const formattedLastFourMonthProfit = formatCurrency(lastFourMonthProfit);
  const formattedLastFiveMonthProfit = formatCurrency(lastFiveMonthProfit);
  const formattedLastSixMonthProfit = formatCurrency(lastSixMonthProfit);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Monthly Earnings and Profits</h1>
        <select
          className="chart-select"
          onChange={(e) => {
            e.preventDefault();
            setSelected(e.target.value);
          }}
        >
          <option value="Total">Total</option>
          <option value={getPreviousMonth(0)}>Current Month</option>
          <option value={getPreviousMonth()}>{getPreviousMonth()}</option>
          <option value={getPreviousMonth(2)}>{getPreviousMonth(2)}</option>
          <option value={getPreviousMonth(3)}>{getPreviousMonth(3)}</option>
          <option value={getPreviousMonth(4)}>{getPreviousMonth(4)}</option>
          <option value={getPreviousMonth(5)}>{getPreviousMonth(5)}</option>
          <option value={getPreviousMonth(6)}>{getPreviousMonth(6)}</option>
        </select>
      </div>
      {Selected === "Total" ? (
        <div className="bottom">
          <p className="title">Last Six Months Earnings and Profits</p>
          <div className="bottoms">
            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedAmount}</p>
              <p className="title">Monthly Earnings</p>
            </div>

            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedProfit}</p>

              <p className="title">Monthly Profits</p>
            </div>
          </div>

          <div className="bottoms">
            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedLastMonthTotal}</p>
              <p className="title">{getPreviousMonth()} Earnings</p>
            </div>

            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedLastMonthProfit}</p>

              <p className="title">{getPreviousMonth()} Profits</p>
            </div>
          </div>

          <div className="bottoms">
            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedLastTwoMonthTotal}</p>
              <p className="title">{getPreviousMonth(2)} Earnings</p>
            </div>

            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedLastTwoMonthProfit}</p>

              <p className="title">{getPreviousMonth(2)} Profits</p>
            </div>
          </div>

          <div className="bottoms">
            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedLastThreeMonthTotal}</p>
              <p className="title">{getPreviousMonth(3)} Earnings</p>
            </div>

            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedLastThreeMonthProfit}</p>

              <p className="title">{getPreviousMonth(3)} Profits</p>
            </div>
          </div>

          <div className="bottoms">
            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedLastFourMonthTotal}</p>
              <p className="title">{getPreviousMonth(4)} Earnings</p>
            </div>

            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedLastFourMonthProfit}</p>

              <p className="title">{getPreviousMonth(4)} Profits</p>
            </div>
          </div>

          <div className="bottoms">
            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedLastFiveMonthTotal}</p>
              <p className="title">{getPreviousMonth(5)} Earnings</p>
            </div>

            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedLastFiveMonthProfit}</p>

              <p className="title">{getPreviousMonth(5)} Profits</p>
            </div>
          </div>

          <div className="bottoms">
            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedLastSixMonthTotal}</p>
              <p className="title">{getPreviousMonth(6)} Earnings</p>
            </div>

            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedLastSixMonthProfit}</p>

              <p className="title">{getPreviousMonth(6)} Profits</p>
            </div>
          </div>
        </div>) : (
        <div className="bottom">
          <p className="title">{Selected} Earnings and Profits</p>
          <div className="bottoms">
            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedAmount}</p>
              <p className="title">Monthly Earnings</p>
            </div>

            <div className="place__holder">
              <p className="amounts" id="dynamicFontSize">{formattedProfit}</p>

              <p className="title">Monthly Profits</p>
            </div>
          </div>
        </div>)}
    </div>
  );
};

export default EarningProfits;
