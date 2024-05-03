import './index.css';
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Single from "./pages/single/single";
import SingleDriver from "./pages/single/singleDriver";
import List from "./pages/list/list";
import DriversList from "./pages/list/driversList";
// import NewDriver from './pages/new/newDriver';
import New from "./pages/new/new";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { userInputs, driverInputs, companyInputs, adminInputs } from "./formSource";
import "./style/dark.scss"
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from './context/darkModeContext';
import { AuthContext } from "./context/authContext";
import CompanyList from './pages/list/companyList';
import NewCompany from './pages/new/newCompany';
import SingleCompany from './pages/single/singleCompany';
import BookingList from './pages/list/bookingList';
import NewBooking from './pages/new/newBooking';
import SingleBooking from './pages/single/singleBooking';
import StatusList from './pages/list/StatusList';
import EarningList from './pages/list/EarningList';
import SettingList from './pages/list/SettingList';
import Report from './pages/report/report'
import Profile from './pages/list/Profile';
import Notification from './pages/list/Notification';
import SupportList from './pages/list/SupportList';
import EditDriver from './pages/edit/editDriver';
import EditCompany from './pages/edit/editCompany';
import EditUser from './pages/edit/editUser';
import EditProfile from './pages/edit/editProfile';
// import styled from "styled-components";
import CancelledBookingList from './pages/list/cancelledBookingsList';
import UnverifiedDrivers from './pages/list/unverifiedDrivers';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import TransactionList from './pages/list/transactionList';



function App() {

  const { darkMode } = useContext(DarkModeContext)
  const { currentUser } = useContext(AuthContext)

  const RequireAuth = ({ children }) => {
    return currentUser ? (children) : <Navigate to="/login" />;
  }

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
            try {
                const roleRef = doc(db, "Roles", currentUser.uid);
                const adminRef = doc(db, "Admin", currentUser.uid);

                const roleDocs = await getDoc(roleRef);
                const adminDocs = await getDoc(adminRef);

                if (roleDocs.exists()) {
                    setUserRole(roleDocs.data());
                } else {
                  setUserRole(adminDocs.data());
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData()
  }, [currentUser]);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            

            { userRole && (
              <>
            <Route index element={
              <RequireAuth>
                <Home {...userRole} />
              </RequireAuth>
            }
            />

              {/* super admin */}
              { (userRole.role === "Super Admin1" || userRole.role === "Super Admin2") && (
            <>
            <Route path="users">
              <Route index element={
                <RequireAuth>
                  <List {...userRole}/>
                </RequireAuth>
              }
              />
              <Route path="/users/:id" element={
                <RequireAuth>
                  <Single {...userRole}/>
                </RequireAuth>
              }
              />
              <Route path="new" element={
                <RequireAuth>
                  <New inputs={userInputs} title="Add New User" />
                </RequireAuth>
              }
              />
            </Route>

            <Route path="drivers">
              <Route index element={
                <RequireAuth>
                  <DriversList {...userRole}/>
                </RequireAuth>
              }
              />

              <Route path="/drivers/:id" element={
                <RequireAuth>
                  <SingleDriver {...userRole}/>
                </RequireAuth>
              }
              />
              
            </Route>

            <Route path="company">
              <Route index element={
                <RequireAuth>
                  <CompanyList {...userRole}/>
                </RequireAuth>
              }
              />
              <Route path=":companyId" element={
                <RequireAuth>
                  <SingleCompany {...userRole}/>
                </RequireAuth>
              }
              />
              <Route path="new" element={
                <RequireAuth>
                  <NewCompany />
                </RequireAuth>
              }
              />
            </Route>

            <Route path="bookings">
              <Route index element={
                <RequireAuth>
                  <BookingList {...userRole}/>
                </RequireAuth>
              }
              />
              <Route path=":bookingId" element={
                <RequireAuth>
                  <SingleBooking />
                </RequireAuth>
              }
              />
              <Route path="new" element={
                <RequireAuth>
                  <NewBooking />
                </RequireAuth>
              }
              />
            </Route>

            <Route path="cancelled-bookings">
              <Route index element={
                <RequireAuth>
                  <CancelledBookingList {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="bookingstatus">
              <Route index element={
                <RequireAuth>
                  <StatusList {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="unverified-drivers">
              <Route index element={
                <RequireAuth>
                  <UnverifiedDrivers {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="reports">
              <Route index element={
                <RequireAuth>
                  <Report {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="earnings">
              <Route index element={
                <RequireAuth>
                  <EarningList {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="transactions">
              <Route index element={
                <RequireAuth>
                  <TransactionList {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="setting">
              <Route index element={
                <RequireAuth>
                  <SettingList {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>
            
            <Route path="profile">
              <Route index element={
                <RequireAuth>
                  <Profile {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="notification">
              <Route index element={
                <RequireAuth>
                  <Notification {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="support">
              <Route index element={
                <RequireAuth>
                  <SupportList {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>
            
            <Route path="edit/:id"
              element={
                <RequireAuth>
                  <EditDriver inputs={driverInputs} title="Update Rider" role={userRole}/>
                </RequireAuth>
              }
            />

            <Route
              path="editcompany/:id"
              element={
                <RequireAuth>
                  <EditCompany inputs={companyInputs} title="Update Company" role={userRole}/>
                </RequireAuth>
              }
            />

            <Route
              path="edituser/:id"
              element={
                <RequireAuth>
                  <EditUser inputs={userInputs} title="Update User" role={userRole}/>
                </RequireAuth>
              }
            />

            <Route
              path="editprofile/:id"
              element={
                <RequireAuth>
                  <EditProfile inputs={adminInputs} title="Update Profile" role={userRole}/>
                </RequireAuth>
              }
            />
            </>
            )}
            
            {/* finance admin */}
            { (userRole.role === "Finance1" || userRole.role === "Finance2") && (
            <>

            <Route path="company">
              <Route index element={
                <RequireAuth>
                  <CompanyList {...userRole}/>
                </RequireAuth>
              }
              />
              <Route path=":companyId" element={
                <RequireAuth>
                  <SingleCompany {...userRole}/>
                </RequireAuth>
              }
              />
              
            </Route>

            <Route
              path="editcompany/:id"
              element={
                <RequireAuth>
                  <EditCompany inputs={companyInputs} title="Update Company" role={userRole}/>
                </RequireAuth>
              }
            />

            {/* <Route path="bookings">
              <Route index element={
                <RequireAuth>
                  <BookingList />
                </RequireAuth>
              }
              />
              <Route path=":bookingId" element={
                <RequireAuth>
                  <SingleBooking />
                </RequireAuth>
              }
              />
              <Route path="new" element={
                <RequireAuth>
                  <NewBooking />
                </RequireAuth>
              }
              />
            </Route> */}

            {/* <Route path="cancelled-bookings">
              <Route index element={
                <RequireAuth>
                  <CancelledBookingList />
                </RequireAuth>
              }
              />
            </Route> */}

            {/* <Route path="bookingstatus">
              <Route index element={
                <RequireAuth>
                  <StatusList />
                </RequireAuth>
              }
              />
            </Route>

            <Route path="unverified-drivers">
              <Route index element={
                <RequireAuth>
                  <UnverifiedDrivers />
                </RequireAuth>
              }
              />
            </Route> */}

            <Route path="earnings">
              <Route index element={
                <RequireAuth>
                  <EarningList {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="transactions">
              <Route index element={
                <RequireAuth>
                  <TransactionList {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="reports">
              <Route index element={
                <RequireAuth>
                  <Report {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            </>
            )}

            {/* support admin */}
            { (userRole.role === "Support1" || userRole.role === "Support2") && (
            <>

            <Route path="bookings">
              <Route index element={
                <RequireAuth>
                  <BookingList {...userRole}/>
                </RequireAuth>
              }
              />
              <Route path=":bookingId" element={
                <RequireAuth>
                  <SingleBooking {...userRole}/>
                </RequireAuth>
              }
              />
              <Route path="new" element={
                <RequireAuth>
                  <NewBooking />
                </RequireAuth>
              }
              />
            </Route>

            <Route path="cancelled-bookings">
              <Route index element={
                <RequireAuth>
                  <CancelledBookingList {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="bookingstatus">
              <Route index element={
                <RequireAuth>
                  <StatusList {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="support">
              <Route index element={
                <RequireAuth>
                  <SupportList {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            {/* <Route path="unverified-drivers">
              <Route index element={
                <RequireAuth>
                  <UnverifiedDrivers />
                </RequireAuth>
              }
              />
            </Route> */}

            {/* <Route path="earnings">
              <Route index element={
                <RequireAuth>
                  <EarningList />
                </RequireAuth>
              }
              />
            </Route> */}

            {/* <Route path="reports">
              <Route index element={
                <RequireAuth>
                  <Report />
                </RequireAuth>
              }
              />
            </Route> */}

            </>
            )}

            {/* Bus dev admin*/}
            { (userRole.role === "Business Dev1" || userRole.role === "Business Dev2") && (
            <>

            <Route path="company">
              <Route index element={
                <RequireAuth>
                  <CompanyList {...userRole}/>
                </RequireAuth>
              }
              />

              <Route path=":companyId" element={
                <RequireAuth>
                  <SingleCompany {...userRole}/>
                </RequireAuth>
              }
              />

              <Route path="new" element={
                <RequireAuth>
                  <NewCompany />
                </RequireAuth>
              }
              />

              
            </Route>

            <Route
              path="editcompany/:id"
              element={
                <RequireAuth>
                  <EditCompany inputs={companyInputs} title="Update Company" role={userRole}/>
                </RequireAuth>
              }
            />

            <Route path="users">
              <Route index element={
                <RequireAuth>
                  <List {...userRole}/>
                </RequireAuth>
              }
              />
              <Route path="/users/:id" element={
                <RequireAuth>
                  <Single {...userRole}/>
                </RequireAuth>
              }
              />
              <Route path="new" element={
                <RequireAuth>
                  <New inputs={userInputs} title="Add New User" />
                </RequireAuth>
              }
              />

              
            </Route>
            <Route
              path="edituser/:id"
              element={
                <RequireAuth>
                  <EditUser inputs={userInputs} title="Update User" role={userRole}/>
                </RequireAuth>
              }
            />

            <Route path="drivers">
              <Route index element={
                <RequireAuth>
                  <DriversList {...userRole}/>
                </RequireAuth>
              }
              />

              <Route path="/drivers/:id" element={
                <RequireAuth>
                  <SingleDriver {...userRole}/>
                </RequireAuth>
              }
              />
              
              
            </Route>
            <Route path="edit/:id"
              element={
                <RequireAuth>
                  <EditDriver inputs={driverInputs} title="Update Driver" role={userRole}/>
                </RequireAuth>
              }
            />

            <Route path="unverified-drivers">
              <Route index element={
                <RequireAuth>
                  <UnverifiedDrivers {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            <Route path="setting">
              <Route index element={
                <RequireAuth>
                  <SettingList {...userRole}/>
                </RequireAuth>
              }
              />
            </Route>

            {/* <Route path="bookings">
              <Route index element={
                <RequireAuth>
                  <BookingList />
                </RequireAuth>
              }
              />
              <Route path=":bookingId" element={
                <RequireAuth>
                  <SingleBooking />
                </RequireAuth>
              }
              />
              <Route path="new" element={
                <RequireAuth>
                  <NewBooking />
                </RequireAuth>
              }
              />
            </Route> */}

            {/* <Route path="cancelled-bookings">
              <Route index element={
                <RequireAuth>
                  <CancelledBookingList />
                </RequireAuth>
              }
              />
            </Route> */}

            {/* <Route path="bookingstatus">
              <Route index element={
                <RequireAuth>
                  <StatusList />
                </RequireAuth>
              }
              />
            </Route>

            <Route path="unverified-drivers">
              <Route index element={
                <RequireAuth>
                  <UnverifiedDrivers />
                </RequireAuth>
              }
              />
            </Route> */}

            {/* <Route path="earnings">
              <Route index element={
                <RequireAuth>
                  <EarningList />
                </RequireAuth>
              }
              />
            </Route>

            <Route path="reports">
              <Route index element={
                <RequireAuth>
                  <Report />
                </RequireAuth>
              }
              />
            </Route> */}

            </>
            )}
            
            </>)}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
