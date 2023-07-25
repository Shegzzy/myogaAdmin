import "./bookingList.scss";
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import BookingDatatable from '../../components/datatable/bookingDatatable';

const BookingList = () => {
    return (
        <div className='bookingList'>
            <Sidebar />
            <div className="bookingListContainer">
                <Navbar />
                <BookingDatatable />
            </div>
        </div>
    )
}

export default BookingList