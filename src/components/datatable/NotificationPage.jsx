import { useState } from 'react';
import './notificationPage.scss';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import NotificationModal from '../modal/notificationModal';

const NotificationPage = () => {
    const [notifiers, setNotifiers] = useState("");
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');




    return (
        <div className='notify-page'>
            <div className="t-top">
                <div className="t-title">
                    Notifications

                </div>
                <NotificationModal />

            </div>
            <div className="t-bottom">
                <div className="filter-select-container">
                    <select
                        className="chart-selects"
                        value={notifiers}
                        onChange={(e) => setNotifiers(e.target.value)}
                    >
                        <option value="all"></option>
                        <option value="7">Users</option>
                        <option value="1">Riders</option>
                    </select>
                </div>
            </div>

        </div>
    )
}

export default NotificationPage