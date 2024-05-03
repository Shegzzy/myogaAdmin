import './notification.scss';
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import NotificationPage from '../../components/datatable/NotificationPage';

const Notification = (role) => {
    return (
        <div className='notify'>
            <Sidebar {...role} />
            <div className="notifyContainer">
                <Navbar {...role} />
                <NotificationPage />
            </div>
        </div>
    )
}

export default Notification