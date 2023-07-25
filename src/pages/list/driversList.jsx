import "./driversList.scss";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import DriverDatatable from '../../components/datatable/driverDatatable';

const DriversList = () => {
    return (
        <div className='driversList'>
            <Sidebar />
            <div className="driversListContainer">
                <Navbar />
                <DriverDatatable />
            </div>
        </div>
    )
}

export default DriversList