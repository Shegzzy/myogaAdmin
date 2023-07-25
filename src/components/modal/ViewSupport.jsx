import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from '../../firebase';

function ViewSupport(props) {

    //const ID = props.id;
    // const [Name, setName] = useState(props.name);
    // const [Rate, setRate] = useState(props.rate);
    // const [Duration, setDuration] = useState(props.duration);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // const handleUpdate = async () => {
    //     const DocRef = doc(db, "Settings", "deliverymodes", "modes", ID);
    //     await updateDoc(DocRef, {
    //         name: Name,
    //         rate: Rate,
    //         duration: Duration
    //     });
    //     handleClose();
    // }

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
                    <p class="text-slate-400 hover:text-purple-400">{props.type}</p>
                    <p class="text-slate-500 hover:text-purple-400">{props.subject}</p>
                    <p class="text-slate-500 hover:text-purple-400">{props.message}</p>
                    <p class="text-black hover:text-gray-400">{props.name}</p>
                    <p class="text-black hover:text-gray-400">{props.email}</p>
                    <p class="text-black hover:text-gray-400">{props.date}</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button className="primaryBtn text-purple-600" form="verifyForm" type="submit">Attend</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ViewSupport