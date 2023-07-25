import "./verifyModal.scss"
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Drivers from '../driver/Drivers';

function VerifyModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [data, setData] = useState([]);

    useEffect(() => {

        const unsub = onSnapshot(collection(db, "Drivers"), (snapShot) => {
            let list = [];
            snapShot.docs.forEach(doc => {
                list.push({ id: doc.id, name: doc.data().FullName, vehicle: doc.data()['Vehicle Type'], online: doc.data().Online, addy: doc.data()['Driver Address'], img: doc.data()['Profile Photo'], ...doc.data() });
            });
            setData(list);
            // setMsg(" Displaying Users Information ");
            // setType("success");
            // snackbarRef.current.show();
        }, (error) => {
            // setMsg(error.message);
            // setType("error");
            // snackbarRef.current.show();
        });

        return () => {
            unsub();
        }
    }, []);

    return (
        <>
            <div className="assignButton" onClick={handleShow}>Assign</div>

            <Modal
                show={show}
                size="lg"
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">Assign Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-wrap justify-center">
                        {data.map((data) => {
                            return (
                                < Drivers name={data.name} vehicle={data.vehicle} online={data.online} addy={data.addy} img={data.img} id={data.id} bookID={props.Id} bookNum={props.bookNum} customer={props.customer} />
                            )
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">Assign</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default VerifyModal