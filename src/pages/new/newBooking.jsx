import Sidebar from "../../components/sidebar/sidebar";
import "./newBooking.scss";
import Navbar from '../../components/navbar/navbar';

const NewBooking = () => {
    return (
        <div className='newBooking'>
            <Sidebar />
            <div className="newBookingContainer">
                <Navbar />
                <div className="top">
                    <h1 className="titleHading">Add New Booking</h1>
                </div>
            </div>
        </div>
    )
}

export default NewBooking