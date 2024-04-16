import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from '../../firebase';


function ViewNotification(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>

            <button onClick={handleShow} class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">View</button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Notification Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p class="text-black hover:text-gray-400"><strong>Audience:</strong> {props.notifier}</p>
                    <p class="text-black hover:text-gray-400"><strong>Title:</strong> {props.title}</p>
                    <p className="text-black hover:text-gray-400"><strong>Date Sent:</strong> {new Date(props.dateCreated?.seconds * 1000).toLocaleString()}</p>
                    <p class="text-black hover:text-gray-400"><strong>Message:</strong></p>
                    <p class="text-black hover:text-purple-400">{props.message}</p>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ViewNotification