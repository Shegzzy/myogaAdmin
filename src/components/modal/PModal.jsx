import "./pmodal.scss";
import { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Mmodal = ({ open, onClose }) => {

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
            console.log("The Id IS: ", items.uid);
            setUserID(items.uid);
        }
    }

    if (!open) return null;
    return (
        <div className="overlay">
            <div className="pmodal">
                <div className="modalLeft">
                    <img
                        src="https://images.pexels.com/photos/13419559/pexels-photo-13419559.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="cottonbro studio from Pexels"
                        className="avatar object-cover rounded-full h-[100px] w-[100px]"
                    />
                </div>
                <div className="modalRight">
                    <div className="closeBtn" onClick={onClose}> <h1>&#x2613;</h1></div>
                    <div className="content">
                        <h1>
                            Name:{data.map(data => (data.name))}
                        </h1>
                        <p>
                            Email: {data.map(data => (data.Email))}
                        </p>
                        <p>
                            Date: {data.map(data => (data.date))}
                        </p>
                        <div className="content-item">
                            <a href="./">
                                <div className="pBtn">Change Password</div>
                            </a>
                            <a href="./">
                                <div className="sBtn">Settings</div>
                            </a>
                        </div>
                    </div>
                    <div className="btnContainer">
                        <button className="btnPrimary">
                            <span className="bold">Updated Profile</span>
                        </button>
                        <button className="btnOutline">
                            <span className="bold">Okay</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mmodal