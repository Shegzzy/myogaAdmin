import './index.css';
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Single from "./pages/single/single";
import SingleDriver from "./pages/single/singleDriver";
import List from "./pages/list/list";
import DriversList from "./pages/list/driversList";
import NewDriver from './pages/new/newDriver';
import New from "./pages/new/new";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { userInputs, driverInputs, companyInputs, adminInputs } from "./formSource";
import "./style/dark.scss"
import { useContext } from "react";
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
import Profile from './pages/list/Profile';
import Notification from './pages/list/Notification';
import SupportList from './pages/list/SupportList';
import EditDriver from './pages/edit/editDriver';
import EditCompany from './pages/edit/editCompany';
import EditUser from './pages/edit/editUser';
import EditProfile from './pages/edit/editProfile';


function App() {

  const {darkMode} = useContext(DarkModeContext)
  const {currentUser} = useContext(AuthContext)

  const RequireAuth = ({children}) => {
    return currentUser ? (children) : <Navigate to="/login"/>;
  }

  return (
    <div className={ darkMode ? "app dark": "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path ="login" element={<Login />} />
            <Route index element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              } 
            />
            <Route path="users">
              <Route index element={
                  <RequireAuth>
                    <List/>
                  </RequireAuth>
                }
              />
              <Route path=":userId" element={
                  <RequireAuth>
                    <Single/>
                  </RequireAuth>
                }
              />
              <Route path="new" element={
                  <RequireAuth>
                    <New inputs={userInputs} title="Add New User"/>
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="drivers">
              <Route index element={
                  <RequireAuth>
                      <DriversList />
                  </RequireAuth>
                }
              />
              <Route path=":driverId" element={
                  <RequireAuth>
                    <SingleDriver/>
                  </RequireAuth>
                }
              />
              <Route path="new" element={
                  <RequireAuth>
                    <NewDriver/>
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="company">
              <Route index element={
                  <RequireAuth>
                    <CompanyList/>
                  </RequireAuth>
                }
              />
              <Route path=":companyId" element={
                  <RequireAuth>
                    <SingleCompany/>
                  </RequireAuth>
                }
              />
              <Route path="new" element={
                  <RequireAuth>
                    <NewCompany/>
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="bookings">
              <Route index element={
                  <RequireAuth>
                    <BookingList/>
                  </RequireAuth>
                }
              />
              <Route path=":bookingId" element={
                  <RequireAuth>
                    <SingleBooking/>
                  </RequireAuth>
                }
              />
              <Route path="new" element={
                  <RequireAuth>
                    <NewBooking/>
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="bookingstatus">
              <Route index element={
                  <RequireAuth>
                    <StatusList/>
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="earnings">
              <Route index element={
                  <RequireAuth>
                    <EarningList/>
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="setting">
              <Route index element={
                  <RequireAuth>
                    <SettingList/>
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="profile">
              <Route index element={
                  <RequireAuth>
                    <Profile/>
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="notification">
              <Route index element={
                  <RequireAuth>
                    <Notification/>
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="support">
              <Route index element={
                  <RequireAuth>
                    <SupportList/>
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="edit/:id"
              element={
                <RequireAuth>
                  <EditDriver inputs={driverInputs} title="Update Driver" />
                </RequireAuth>
              }
            />
            <Route
              path="editcompany/:id"
              element={
                <RequireAuth>
                  <EditCompany inputs={companyInputs} title="Update Company" />
                </RequireAuth>
              }
            />
            <Route
              path="edituser/:id"
              element={
                <RequireAuth>
                  <EditUser inputs={userInputs} title="Update User" />
                </RequireAuth>
              }
            />
            <Route
              path="editprofile/:id"
              element={
                <RequireAuth>
                  <EditProfile inputs={adminInputs} title="Update Profile" />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
