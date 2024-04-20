import React, { useRef } from "react";
import "./report.scss";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import ReportChart from "../../components/report-charts/report_chart";
import CompletedBookingsChart from "../../components/report-charts/completed_bookings_chart";
import UsersChart from "../../components/report-charts/users_chart";
import CompanyChart from "../../components/report-charts/companies_chart";
import EarningProfits from "../../components/report-charts/monthly_earnings_and_profits";
import TopUsers from "../../components/report-charts/top_users_report";
import Chart from "../../components/chart/chart";
import { Button } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";

const Report = () => {

  function handlePrint() {
    window.print()
  }

  const componentRef = useRef();
  const handlePagePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="reportTitle">Reports</div>
        <div className="charts">
          <div class="row" ref={componentRef}>
            <div class="col-sm-6">
              <TopUsers title="Top 50 Users" />
              <br />
              <CompletedBookingsChart
                title="Completed Bookings Chart"
                aspect={4 / 1}
              />
              <br />
              <UsersChart title="Registered Users" aspect={4 / 1} />

            </div>
            <div class="col-sm-6">
              <EarningProfits title="Monthly Earnings and Profits" />
              <br />

              <ReportChart title="Registered Riders" aspect={4 / 1} />

              <br />
              <CompanyChart title="Registered Companies" aspect={4 / 1} />
              <br />


            </div>
            <br />
            <Chart title="Earnings (Revenue) 6 Months Curve" aspect={4 / 1} />
          </div>

          <Button onClick={handlePagePrint}>Print</Button>
        </div>
      </div>
    </div>
  );
};

export default Report;
