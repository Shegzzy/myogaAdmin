import "./driversList.scss";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import UnverifiedDriversList from "../../components/datatable/unverifiedDriverList";

const UnverifiedDrivers = () => {
    return (
        <div className='driversList'>
            <Sidebar />
            <div className="driversListContainer">
                <Navbar />
                <UnverifiedDriversList />
            </div>
        </div>
    )
}

export default UnverifiedDrivers