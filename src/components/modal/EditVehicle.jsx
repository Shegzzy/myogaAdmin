import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';

function EditVehicle(props) {

    const ID = props.id;
    const [Name, setName] = useState(props.name);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleUpdate = async () => {
        const DocRef = doc(db, "Settings", "deliveryVehicles", "vehicles", ID);
        await updateDoc(DocRef, {
            name: Name
        });
        handleClose();
    }

    return (
        <>

            <button onClick={handleShow} class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Edit</button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Delivery Vehicle Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Vehicle Type</Form.Label>
                            <Form.Control type="text" value={Name}
                                onChange={(e) => { setName(e.target.value) }}
                            />
                            <Form.Text className="text-muted">
                                Enter the devlivery vehicle type.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button className="primaryBtn text-purple-600" form="verifyForm" type="submit">Update</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditVehicle