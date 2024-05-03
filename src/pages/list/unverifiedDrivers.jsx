import "./driversList.scss";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import UnverifiedDriversList from "../../components/datatable/unverifiedDriverList";

const UnverifiedDrivers = (role) => {
    return (
        <div className='driversList'>
            <Sidebar {...role} />
            <div className="driversListContainer">
                <Navbar {...role} />
                <UnverifiedDriversList />
            </div>
        </div>
    )
}

export default UnverifiedDrivers