import { useState } from 'react';
import './notificationPage.scss';

const NotificationPage = () => {
    const [notifiers, setNotifiers] = useState("");



    return (
        <div className='notify-page'>
            <div className="t-top">
                <div className="t-title">
                    Send Notification
                </div>
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