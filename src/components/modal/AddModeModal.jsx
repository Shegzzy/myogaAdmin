import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase';

function AddModeModal() {

    const [Name, setName] = useState('');
    const [Rate, setRate] = useState('');
    const [Duration, setDuration] = useState('');
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAdd = async () => {
        const DocRef = collection(db, "Settings", "deliverymodes", "modes");
        await addDoc(DocRef, {
            name: Name,
            rate: Rate,
            duration: Duration
        });
        handleClose();
    }

    return (
        <>

            <button onClick={handleShow} class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Add</button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add New Delivery Mode</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAdd();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Mode Name</Form.Label>
                            <Form.Control type="text" placeholder="e.g Express" value={Name}
                                onChange={(e) => { setName(e.target.value) }}
                            />
                            <Form.Text className="text-muted">
                                Enter the devlivery mode name.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Mode Rate</Form.Label>
                            <Form.Control type="text" placeholder="e.g 230" value={Rate}
                                onChange={(e) => { setRate(e.target.value) }}
                            />
                            <Form.Text className="text-muted">
                                Enter the rate per kilometer.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Mode Duration</Form.Label>
                            <Form.Control type="text" placeholder="e.g 6" value={Duration}
                                onChange={(e) => { setDuration(e.target.value) }}
                            />
                            <Form.Text className="text-muted">
                                Enter the hours for delivery.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button className="primaryBtn text-purple-600" form="verifyForm" type="submit">Add</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddModeModal