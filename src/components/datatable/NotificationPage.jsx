import { useEffect, useState } from 'react';
import './notificationPage.scss';
import { db } from '../../firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import NotificationModal from '../modal/notificationModal';
import { DataGrid } from '@mui/x-data-grid';
import { messagesColumns } from '../../datatablesource';

const NotificationPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    // const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                let list = [];

                const querySnapshot = await getDocs(query(
                    collection(db, "New Notification")
                ));

                querySnapshot.forEach((message) => {
                    list.push({ id: message.id, ...message.data() });
                });

                setData(list);

            } catch (e) {
                console.log("Error ", e);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }

        fetchMessages();
    }, [])




    return (
        <div className='notify-page'>
            <div className="t-top">
                <div className="t-title">
                    Notifications
                </div>
                <NotificationModal />
            </div>
            <div className="t-bottom">
                {!loading ? (<DataGrid
                    className="datagrid"
                    rows={data}
                    columns={messagesColumns}
                    pageSize={9}
                    rowsPerPageOptions={[9]}
                // checkboxSelection
                />) : (<div className="detailItem">
                    <span className="itemKey">
                        <div className="no-data-message">
                            <div className="single-container">
                                <div className="loader">
                                    <div className="lds-dual-ring"></div>
                                    <div>Loading... </div>
                                </div>
                            </div>
                        </div>
                    </span>
                </div>)}
            </div>

        </div>
    )
}

export default NotificationPage