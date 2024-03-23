import './modalContainer.scss';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { updateDoc, getDocs, where, query, collection } from "firebase/firestore";
import { db } from '../../firebase';
import { toast } from 'react-toastify';

function RefundModal(props) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const docRef = query(collection(db, 'Cancelled Bookings'),
                where("Booking Number", "==", props.id)
            );

            const snapshot = await getDocs(docRef);
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                await updateDoc(doc.ref, {
                    Status: "refunded",
                    "Refunded Date": new Date().toISOString()
                });
                handleClose();
                toast.success("Refunded Successfully");
            } else {
                toast.error("Error updating document");
            }
        } catch (error) {
            console.error("Error updating document:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div onClick={handleShow} className="assignButton">Refund</div>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title >Refund</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-wrap justify-center flex-column">

                        <strong>Booking Number: <span>{props.id}</span></strong>
                        <strong>Customer Name: <span>{props.customerName}</span></strong>
                        <strong>Amount: <span>{props.amount}</span></strong>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate} disabled={loading}>
                        {loading ? 'Loading...' : 'Refund'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RefundModal