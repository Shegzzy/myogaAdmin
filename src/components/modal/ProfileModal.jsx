import "./profileModal.scss";
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

function ProfileModal() {
    const [show, setShow] = useState(false);
    const [userID, setUserID] = useState('');
    const [data, setData] = useState([]);
    const [items, setItems] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                    console.log("Document data:", docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.log(error);
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

    return (
        <>
            {/* <Button variant="primary" onClick={handleShow}>
                Launch static backdrop modal
            </Button> */}
            <div className="buttonDiv" onClick={handleShow} >
                <img
                    src="https://cdn-icons-png.flaticon.com/512/3033/3033143.png"
                    alt="cottonbro studio from Pexels"
                    className="mAvatar"
                />
            </div>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title >
                        {data.map(data => (data.name))}
                        <div className="profileImg" >
                            <img
                                src={data.map(data => (data.img))}
                                alt="cottonbro studio from Pexels"
                                className="pAvatar"
                            />
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Email:  {data.map(data => (data.Email))}</p><br />
                    <p>Created on:  {data.map(data => (data.date))}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">Update Profile</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ProfileModal