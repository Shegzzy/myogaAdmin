import './profilePage.scss';
import { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";

const ProfilePage = () => {

    const [userID, setUserID] = useState('');
    const [data, setData] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchID();

        const fetchData = async () => {
            try {
                const profile = [];
                const docRef = doc(db, "Admin", userID);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    profile.push({ name: docSnap.data().name, Email: docSnap.data().email, date: docSnap.data().dateCreated, img: docSnap.data().profilePhoto })
                    setData(profile);
                } else {

                }
            } catch (error) {
            }
        };
        fetchData()
    }, [userID]);

    const fetchID = () => {
        const items = JSON.parse(localStorage.getItem('user'));
        if (items) {
            setItems(items);
            setUserID(items.uid);
        }
    }

    return (
        <div className='profile-page'>
            <div className="top">
                <div className="profileTitle">
                    Admin Profile
                </div>
            </div>
            <div className="bottom">
                <div className="p-left">
                    <img src={data.map(data => (data.img))} alt="empty icon" />
                </div>
                <div className="p-right">
                    <div className="p-detail">
                        <h1>Name</h1>
                        <p>{data.map(data => (data.name))}</p>

                        <h1>Email</h1>
                        <p>{data.map(data => (data.Email))}</p>

                        <h1>Date Created</h1>
                        <p>{data.map(data => (data.date))}</p>
                        <button>
                            Change Password
                        </button>
                        <Link to={`/editprofile/${userID}`}>
                            <button>
                                Edit Profile
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage