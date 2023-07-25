import "./singleBooking.scss";
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import { useLocation } from "react-router-dom";

const SingleBooking = () => {

    const location = useLocation();
    const userID = location.state.id;

    return (
        <div className='singleBooking'>
            <Sidebar />
            <div className="singleBookingContainer">
                <Navbar />
                <div className="top">
                    <div className="content">
                        CONTENT GOES HERE
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleBooking