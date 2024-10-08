import "./assignModal.scss";
import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { updateDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from '../../firebase';

import Snakbar from "../snackbar/Snakbar";

function VerifyRiderModal(props) {
    const dID = props.Id;
    const [dValue, setDvalue] = useState(props.value);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");
    const snackbarRef = useRef();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleUpdate = async () => {
        setLoading(true);

        try{
            const docRef = doc(db, 'Drivers', dID);

            // Update the timestamp field with the value from the server
            const updateTimestamp = await updateDoc(docRef, {
                Verified: dValue,
                timeStamp: serverTimestamp()
            });

            handleClose();
            setMsg("Rider Verified Successfully");
            setType("success");
            snackbarRef.current.show();
        }catch(e){
            console.log('verify error ', e);
            handleClose();
            setMsg("Rider Verification Failed");
            setType("error");
            snackbarRef.current.show();
        } finally{
            setLoading(false);
        }
    }

    return (
        <>
            <Snakbar ref={snackbarRef} message={msg} type={sType} />

            <div className="verifyButton" onClick={handleShow}>
                Verify Rider
            </div>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Verify Rider</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Verification Value</Form.Label>
                            <Form.Control type="text" placeholder="Enter 1 or 0" value={dValue}
                                onChange={(e) => { setDvalue(e.target.value) }}
                            />
                            <Form.Text className="text-muted">
                                Enter 1 for verify and 0 for not verified.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {/* <button className="primaryBtn" form="verifyForm" type="submit">Verify</button> */}
                    <button className={loading ? "spinner-btn" : "primaryBtn"}
                        disabled={loading} form="verifyForm" type="submit">
                        <span className={loading ? "hidden" : ""}>Verify</span>
                        <span className={loading ? "" : "hidden"}>
                            <div className="spinner"></div>
                        </span>
                        {loading && <span>verifying...</span>}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default VerifyRiderModal