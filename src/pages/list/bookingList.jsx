import "./bookingList.scss";
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import BookingDatatable from '../../components/datatable/bookingDatatable';

const BookingList = (role) => {
    return (
        <div className='bookingList'>
            <Sidebar {...role} />
            <div className="bookingListContainer">
                <Navbar {...role} />
                <BookingDatatable />
            </div>
        </div>
    )
}

export default BookingList