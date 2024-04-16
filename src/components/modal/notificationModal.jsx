import React, { useState } from 'react';
import { db } from '../../firebase';
import { Timestamp, addDoc, collection, } from 'firebase/firestore';
import { Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

function NotificationModal() {
    const [notifiers, setNotifiers] = useState("");
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        try {
            setLoading(true);

            const notificationRef = collection(db, 'New Notification');
            await addDoc(notificationRef, {
                notifier: notifiers,
                message: message,
                title: title,
                dateCreated: Timestamp.now(),
            });

            alert('Notification sent successfully!');
            setNotifiers('');
            setTitle('');
            setMessage('');
            setLoading(false);
        } catch (error) {
            console.error('Error creating role and credentials:', error);
            alert('An error occurred while sending notification. Please try again.');
            setLoading(false);
        }
    };

    const handleClose = () => {
        setNotifiers('');
        setTitle('');
        setMessage('');
        setShow(false);
        setLoading(false);
    };
    const handleShow = () => setShow(true);

    return (
        <>

            <button onClick={handleShow} class="px-4 py-1 
            text-sm text-purple-600 font-semibold rounded-full border 
            border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent 
            focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">New Notification</button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Send New Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Destination:</Form.Label>
                            <div className="filter-select-container">
                                <select
                                    className="chart-selects"
                                    value={notifiers}
                                    onChange={(e) => setNotifiers(e.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="Users">Users</option>
                                    <option value="Riders">Riders</option>
                                </select>
                            </div>

                            <Form.Label>Title:</Form.Label>
                            <Form.Control type="text" value={title}
                                onChange={(e) => setTitle(e.target.value)} required
                            />

                            <Form.Label>Message:</Form.Label>
                            <div className="filter-select-container">
                                <textarea
                                    placeholder='enter message'
                                    onChange={(e) => setMessage(e.target.value)} required
                                    value={message}
                                    style={{
                                        width: '100%',
                                        padding: '15px',
                                        outline: 'solid',
                                        outlineWidth: '1px',
                                        outlineColor: 'grey',
                                        resize: 'none',
                                        borderRadius: '5px'
                                    }}
                                />

                            </div>

                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button className={loading ? "spinner-btn" : "primaryBtn text-purple-600"}
                        disabled={loading} form="verifyForm" type="submit">
                        <span className={loading ? "hidden" : ""}>Send</span>
                        <span className={loading ? "" : "hidden"}>
                            <div className="spinner"></div>
                        </span>
                        {loading && <span>Sending...</span>}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default NotificationModal;
