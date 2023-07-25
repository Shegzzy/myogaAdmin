import './notification.scss';
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import NotificationPage from '../../components/datatable/NotificationPage';

const Notification = () => {
    return (
        <div className='notify'>
            <Sidebar />
            <div className="notifyContainer">
                <Navbar />
                <NotificationPage />
            </div>
        </div>
    )
}

export default Notification