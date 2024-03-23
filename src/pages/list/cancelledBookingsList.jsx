import "./bookingList.scss";
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import BookingDatatable from '../../components/datatable/bookingDatatable';
import CancelledBookingDataTable from "../../components/datatable/cancelledBookingsDataTable";

const CancelledBookingList = () => {
    return (
        <div className='bookingList'>
            <Sidebar />
            <div className="bookingListContainer">
                <Navbar />
                <CancelledBookingDataTable />
            </div>
        </div>
    )
}

export default CancelledBookingList