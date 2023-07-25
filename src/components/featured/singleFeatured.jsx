import "./singleFeatured.scss";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { useState, useEffect } from 'react';
import { collection, getDocs, where, query, getDoc, doc } from "firebase/firestore";
import { db } from '../../firebase'

function SingleFeatured(props) {

    const [data, setData] = useState([]);
    const [uData, setUData] = useState([]);
    const bookID = props.id;
    const [sum, setSum] = useState(0);
    const [diff, setDiff] = useState(null);

    useEffect(() => {
        getData();
        fetchData();
    });

    useEffect(() => {
        const sum = data.reduce((total, item) => total + parseInt(item.Amount), 0);
        setSum(sum);
    }, [data]);

    const fetchData = async () => {
        try {
            const profile = [];
            const docRef = doc(db, "Users", bookID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                profile.push({ id: docSnap.id, ...docSnap.data() })
                setUData(profile);
            } else {
                alert("No Such Document");
            }
        } catch (error) {
            alert("Error", error.message);
        }
    };

    const getData = async () => {
        try {
            const booking = [];
            const q = query(collection(db, "Bookings"), where("Customer ID", "==", bookID));
            const docSnap = await getDocs(q);
            docSnap.forEach((doc) => {
                booking.push({ id: doc.id, ...doc.data() });
            });
            setData(booking);
            setDiff(docSnap.docs.length);
        } catch (error) {
            alert("Error", error.message);
        }
    }

    return (
        <div className="featured">
            <div className="top">
                <h1 className="title">User Summary</h1>
            </div>
            <div className="bottom">
                <div className="summary">
                    <div className="item">
                        <div className="itemTitle">Total Bookings</div>
                        <div className="itemResult positive">
                            <LibraryBooksIcon />
                            <div className="resultAmount">{diff}</div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">Amount Spent</div>
                        <div className="itemResult positive">
                            <AccountBalanceWalletOutlinedIcon />
                            <div className="resultAmount">₦{sum}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default SingleFeatured