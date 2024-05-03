import "./bookingList.scss";
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import CancelledBookingDataTable from "../../components/datatable/cancelledBookingsDataTable";

const CancelledBookingList = (role) => {
    return (
        <div className='bookingList'>
            <Sidebar {...role} />
            <div className="bookingListContainer">
                <Navbar {...role} />
                <CancelledBookingDataTable />
            </div>
        </div>
    )
}

export default CancelledBookingList