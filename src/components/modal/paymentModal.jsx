import React, { useState } from 'react';
import { db } from '../../firebase';
import { Timestamp, addDoc, collection, } from 'firebase/firestore';
import { Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { format } from 'date-fns';

function PaymentModal(props) {
    const [companyName, setCompanyName] = useState("");
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [amount, setAmount] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        try {
            setLoading(true);

            const notificationRef = collection(db, 'New Notification');
            await addDoc(notificationRef, {
                "Company ID": props.id,
                "Company Name": companyName,
                Amount: amount,
                From: dateFrom,
                To: dateTo,
                "Date Paid": Timestamp.now(),
            });

            alert('Notification sent successfully!');
            setAmount('');
            setCompanyName('');
            setDateFrom('');
            setDateTo('');
            setLoading(false);
        } catch (error) {
            console.error('Error creating role and credentials:', error);
            alert('An error occurred while sending notification. Please try again.');
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAmount('');
        setCompanyName('');
        setDateFrom('');
        setDateTo('');
        setShow(false);
        setLoading(false);
    };
    const handleShow = () => setShow(true);

    return (
        <>

            <button onClick={handleShow} class="px-4 py-1 
            text-sm text-purple-600 font-semibold rounded-full border 
            border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent 
            focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Pay</button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Make Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Company:</Form.Label>
                            <Form.Control type="text" value={props.name}
                                onChange={(e) => setCompanyName(e.target.value)} required
                            />

                            <Form.Label>From:</Form.Label>
                            <Form.Control type="text" value={format(new Date(props.startOfPeriod), 'dd/MM/yyyy')}
                                onChange={(e) => setDateFrom(e.target.value)} required
                            />

                            <Form.Label>To:</Form.Label>
                            <Form.Control type="text" value={format(new Date(props.endOfPeriod), 'dd/MM/yyyy')}
                                onChange={(e) => setDateTo(e.target.value)} required
                            />

                            <Form.Label>Amount:</Form.Label>
                            <Form.Control type="text" value={props.toBeBalanced}
                                onChange={(e) => setAmount(e.target.value)} required
                            />

                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button className={loading ? "spinner-btn" : "primaryBtn text-purple-600"}
                        disabled={loading} form="verifyForm" type="submit">
                        <span className={loading ? "hidden" : ""}>Pay Now</span>
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

export default PaymentModal;
