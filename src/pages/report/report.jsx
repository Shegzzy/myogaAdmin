import React from "react";
import "./report.scss";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import ReportChart from "../../components/report-charts/report_chart";
import CompletedBookingsChart from "../../components/report-charts/completed_bookings_chart";
import UsersChart from "../../components/report-charts/users_chart";
import CompanyChart from "../../components/report-charts/companies_chart";

const Report = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="reportTitle">Last 6 Months Report</div>
        <div className="charts">
          <ReportChart title="Riders Chart" aspect={4 / 3} />
          <CompletedBookingsChart
            title="Completed Bookings Chart"
            aspect={4 / 3}
          />
          <UsersChart title="Users Chart" aspect={4 / 3} />
          <CompanyChart title="Company Chart" aspect={4 / 3} />
        </div>
      </div>
    </div>
  );
};

export default Report;
