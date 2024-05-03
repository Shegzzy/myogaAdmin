import "./driversList.scss";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import DriverDatatable from '../../components/datatable/driverDatatable';

const DriversList = (role) => {
    return (
        <div className='driversList'>
            <Sidebar {...role} />
            <div className="driversListContainer">
                <Navbar {...role} />
                <DriverDatatable />
            </div>
        </div>
    )
}

export default DriversList