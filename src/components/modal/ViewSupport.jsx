import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from '../../firebase';


function ViewSupport(props) {

    const [show, setShow] = useState(false);
    const [status, setStatus] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleUpdate = async () => {
        const docRef = doc(db, 'supportTickets', props.id);

        await updateDoc(docRef, {
            status: "attended",
            timeStamp: serverTimestamp()
        });
    }

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
                    <Modal.Title>Support Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p class="text-slate-400 hover:text-purple-400">Type: {props.type}</p>
                    <p class="text-slate-500 hover:text-purple-400">Subject: {props.subject}</p>
                    <p class="text-black hover:text-gray-400">Name: {props.name}</p>
                    <p class="text-black hover:text-gray-400">Email: {props.email}</p>
                    <p class="text-black hover:text-gray-400">Date: {new Date(props.date).toLocaleDateString(
                        "en-US"
                    )}</p>
                    <p class="text-slate-500 hover:text-purple-400">{props.message}</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {props.status === "new" && (<button className="primaryBtn text-purple-600" form="verifyForm" type="submit" onClick={handleUpdate}>Attend</button>)}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ViewSupport