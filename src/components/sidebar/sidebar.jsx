import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
// import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import SettingsIcon from "@mui/icons-material/Settings";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LogoutIcon from "@mui/icons-material/Logout";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { auth } from "./../../firebase";
import { signOut } from "firebase/auth";
import Snakbar from "../snackbar/Snakbar";
import MyOga from "../../myogaIcon3.png";
import { AttachMoney, CancelPresentation, CarCrash } from "@mui/icons-material";
import { FaMoneyBillTransfer } from "react-icons/fa6";

const Sidebar = (role) => {
  const { dispatch } = useContext(DarkModeContext, AuthContext);
  const navigate = useNavigate();
  const snackbarRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [sType, setType] = useState("");

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        setMsg("Logged Out Succesfully");
        setType("success");
        snackbarRef.current.show();
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
        setMsg(error.message);
        setType("error");
        snackbarRef.current.show();
      });
  };

  return (
    <div className="sidebar">
      <Snakbar ref={snackbarRef} message={msg} type={sType} />
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">
            <img src={MyOga} className="App-logo" alt="logo" />
          </span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li tabindex="0">
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>

          {/* super admins */}
          {(role.role === "Super Admin1" || role.role === "Super Admin2") && (
            <>
              <p className="title">LIST</p>
              <Link to="/users" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <AccountCircleIcon className="icon" />
                  <span>Users</span>
                </li>
              </Link>

              <Link to="/drivers" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <DirectionsCarIcon className="icon" />
                  <span>Riders</span>
                </li>
              </Link>

              <Link to="/unverified-drivers" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CarCrash className="icon" />
                  <span>Unverified Riders</span>
                </li>
              </Link>

              <Link to="/company" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <EmojiTransportationIcon className="icon" />
                  <span>Companies</span>
                </li>
              </Link>

              <Link to="/bookings" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <LibraryBooksIcon className="icon" />
                  <span>Bookings</span>
                </li>
              </Link>

              <Link to="/cancelled-bookings" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CancelPresentation className="icon" />
                  <span>Cancelled Bookings</span>
                </li>
              </Link>

              <Link to="/bookingstatus" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <GpsFixedIcon className="icon" />
                  <span>Order Status</span>
                </li>
              </Link>

              <Link to="/earnings" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <AttachMoney className="icon" />
                  <span>Earnings</span>
                </li>
              </Link>

              <Link to="/transactions" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <FaMoneyBillTransfer className="icon" />
                  <span>Transactions</span>
                </li>
              </Link>


              <p className="title">USEFUL LINKS</p>
              <Link to="/notification" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CircleNotificationsIcon className="icon" />
                  <span>Notifications</span>
                </li>
              </Link>

              <Link to="/reports" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <ContentPasteIcon className="icon" />
                  <span>Reports</span>
                </li>
              </Link>

              <Link to="/support" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CreditScoreIcon className="icon" />
                  <span>Support</span>
                </li>
              </Link>

              <Link to="/setting" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <SettingsIcon className="icon" />
                  <span>Settings</span>
                </li>
              </Link>

              <Link to="/profile" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <PermIdentityIcon className="icon" />
                  <span>Profile</span>
                </li>
              </Link>
            </>
          )}


          {/* finance admins */}
          {(role.role === "Finance1" || role.role === "Finance2") && (
            <>
              <p className="title">LIST</p>
              {/* <Link to="/users" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <AccountCircleIcon className="icon" />
                  <span>Users</span>
                </li>
              </Link>

              <Link to="/drivers" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <DirectionsCarIcon className="icon" />
                  <span>Riders</span>
                </li>
              </Link>

              <Link to="/unverified-drivers" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CarCrash className="icon" />
                  <span>Unverified Riders</span>
                </li>
              </Link> */}

              <Link to="/company" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <EmojiTransportationIcon className="icon" />
                  <span>Companies</span>
                </li>
              </Link>

              {/* <Link to="/bookings" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <LibraryBooksIcon className="icon" />
                  <span>Bookings</span>
                </li>
              </Link>

              <Link to="/cancelled-bookings" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CancelPresentation className="icon" />
                  <span>Cancelled Bookings</span>
                </li>
              </Link>

              <Link to="/bookingstatus" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <GpsFixedIcon className="icon" />
                  <span>Order Status</span>
                </li>
              </Link> */}

              <Link to="/earnings" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <AttachMoney className="icon" />
                  <span>Earnings</span>
                </li>
              </Link>

              <Link to="/transactions" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <FaMoneyBillTransfer className="icon" />
                  <span>Transactions</span>
                </li>
              </Link>


              <p className="title">USEFUL LINKS</p>
              {/* <Link to="/notification" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CircleNotificationsIcon className="icon" />
                  <span>Notifications</span>
                </li>
              </Link> */}

              <Link to="/reports" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <ContentPasteIcon className="icon" />
                  <span>Reports</span>
                </li>
              </Link>

              {/* <Link to="/support" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CreditScoreIcon className="icon" />
                  <span>Support</span>
                </li>
              </Link>

              <Link to="/setting" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <SettingsIcon className="icon" />
                  <span>Settings</span>
                </li>
              </Link>

              <Link to="/profile" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <PermIdentityIcon className="icon" />
                  <span>Profile</span>
                </li>
              </Link> */}
            </>
          )}


          {/* support admins */}
          {(role.role === "Support1" || role.role === "Support2") && (
            <>
              <p className="title">LIST</p>
              {/* <Link to="/users" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <AccountCircleIcon className="icon" />
                  <span>Users</span>
                </li>
              </Link>

              <Link to="/drivers" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <DirectionsCarIcon className="icon" />
                  <span>Riders</span>
                </li>
              </Link>

              <Link to="/unverified-drivers" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CarCrash className="icon" />
                  <span>Unverified Riders</span>
                </li>
              </Link> */}

              {/* <Link to="/company" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <EmojiTransportationIcon className="icon" />
                  <span>Companies</span>
                </li>
              </Link> */}

              <Link to="/bookings" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <LibraryBooksIcon className="icon" />
                  <span>Bookings</span>
                </li>
              </Link>

              <Link to="/cancelled-bookings" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CancelPresentation className="icon" />
                  <span>Cancelled Bookings</span>
                </li>
              </Link>

              <Link to="/bookingstatus" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <GpsFixedIcon className="icon" />
                  <span>Order Status</span>
                </li>
              </Link>

              {/* <Link to="/earnings" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <AttachMoney className="icon" />
                  <span>Earnings</span>
                </li>
              </Link>

              <Link to="/transactions" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <FaMoneyBillTransfer className="icon" />
                  <span>Transactions</span>
                </li>
              </Link> */}


              <p className="title">USEFUL LINKS</p>
              {/* <Link to="/notification" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CircleNotificationsIcon className="icon" />
                  <span>Notifications</span>
                </li>
              </Link> */}

              {/* <Link to="/reports" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <ContentPasteIcon className="icon" />
                  <span>Reports</span>
                </li>
              </Link> */}

              <Link to="/support" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CreditScoreIcon className="icon" />
                  <span>Support</span>
                </li>
              </Link>

              {/* <Link to="/setting" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <SettingsIcon className="icon" />
                  <span>Settings</span>
                </li>
              </Link>

              <Link to="/profile" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <PermIdentityIcon className="icon" />
                  <span>Profile</span>
                </li>
              </Link> */}
            </>
          )}


          {(role.role === "Business Dev1" || role.role === "Business Dev2") && (
            <>
              <p className="title">LIST</p>
              <Link to="/users" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <AccountCircleIcon className="icon" />
                  <span>Users</span>
                </li>
              </Link>

              <Link to="/drivers" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <DirectionsCarIcon className="icon" />
                  <span>Riders</span>
                </li>
              </Link>

              <Link to="/unverified-drivers" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CarCrash className="icon" />
                  <span>Unverified Riders</span>
                </li>
              </Link>

              <Link to="/company" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <EmojiTransportationIcon className="icon" />
                  <span>Companies</span>
                </li>
              </Link>

              {/* <Link to="/bookings" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <LibraryBooksIcon className="icon" />
                  <span>Bookings</span>
                </li>
              </Link>

              <Link to="/cancelled-bookings" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CancelPresentation className="icon" />
                  <span>Cancelled Bookings</span>
                </li>
              </Link>

              <Link to="/bookingstatus" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <GpsFixedIcon className="icon" />
                  <span>Order Status</span>
                </li>
              </Link> */}

              {/* <Link to="/earnings" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <AttachMoney className="icon" />
                  <span>Earnings</span>
                </li>
              </Link>

              <Link to="/transactions" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <FaMoneyBillTransfer className="icon" />
                  <span>Transactions</span>
                </li>
              </Link> */}


              {/* <p className="title">USEFUL LINKS</p> */}
              {/* <Link to="/notification" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CircleNotificationsIcon className="icon" />
                  <span>Notifications</span>
                </li>
              </Link> */}

              {/* <Link to="/reports" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <ContentPasteIcon className="icon" />
                  <span>Reports</span>
                </li>
              </Link> */}

              {/* <Link to="/support" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <CreditScoreIcon className="icon" />
                  <span>Support</span>
                </li>
              </Link> */}

              {/* <Link to="/setting" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <SettingsIcon className="icon" />
                  <span>Settings</span>
                </li>
              </Link> */}

              {/* <Link to="/profile" style={{ textDecoration: "none" }}>
                <li tabindex="0">
                  <PermIdentityIcon className="icon" />
                  <span>Profile</span>
                </li>
              </Link> */}
            </>
          )}

          <li tabindex="0">
            <div onClick={() => handleSignOut()}>
              <LogoutIcon className="icon" />
              <span>Logout</span>
            </div>
          </li>

        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
