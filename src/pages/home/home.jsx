import "./home.scss";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import Widget from "../../components/widget/widget";
import Chart from "../../components/chart/chart";
import Featured from "../../components/featured/featured";
// import TableJ from "../../components/table/table";
// import SupportPage from "../../components/datatable/SupportPage";
// import EarningDatatable from "../../components/datatable/EarningDatatable";

const Home = (role) => {
  return (
    <div className="home">
      <Sidebar {...role} />
      <div className="homeContainer">
        <Navbar {...role} />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="driver" />
          <Widget type="booking" />
          <Widget type="company" />
        </div>
        <div className="charts">
          <Featured />
          <Chart aspect={2 / 1} title="Last 6 Months (Revenue)" />
        </div>
        {/* <div className="listContainer"> */}
        {/* < div className="listTitle">Latest Bookings</div> */}
        {/* <TableJ /> */}
        {/* <SupportPage />
          <EarningDatatable /> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Home;
