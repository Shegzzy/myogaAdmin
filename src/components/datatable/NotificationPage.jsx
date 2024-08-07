import { useEffect, useState } from 'react';
import './notificationPage.scss';
import { db } from '../../firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import NotificationModal from '../modal/notificationModal';
import { DataGrid } from '@mui/x-data-grid';
import { messagesColumns } from '../../datatablesource';
import ViewNotification from '../modal/viewNotificationModal';

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

                list.sort(
                    (a, b) => new Date(b["dateCreated"].seconds * 1000) - new Date(a["dateCreated"].seconds * 1000)
                );
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

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <ViewNotification {...params.row} />
                );
            },
        },
    ];

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
                    columns={messagesColumns.concat(actionColumn)}
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