import "./assignModal.scss";
import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../../firebase';

import Snakbar from "../snackbar/Snakbar";

function VerifyCompanyModal(props) {
    const dID = props.Id;
    const [dValue, setDvalue] = useState(props.value);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");
    const snackbarRef = useRef(props.snackBar);


    const handleClose = () => {
        setMsg("");
        setLoading(false);
        setShow(false)
    };

    const handleShow = () => setShow(true);

    const handleUpdate = async () => {
        setLoading(true);
        let val = "";

        if(dValue === "1") {
            val = "verified";

            try{
                const docRef = doc(db, 'Companies', dID);
    
                // Update the timestamp field with the value from the server
                await setDoc(docRef, {
                    verification: val,
                }, {merge: true});
    
                const companyVerifcation = await getDoc(docRef);
    
                // console.log("Verification Status: " + companyVerifcation.data().verification);
                if(companyVerifcation.data().verification === "verified"){
                    setMsg("Company Verified Successfully");
                    setType("success");
                }

            }catch(e){
                setMsg("Company Verification Failed");
                setType("error");
            } finally{
                setLoading(false);
            }
        } else {
            setMsg("Please enter 1 to verify company");
            setLoading(false);
            return;
        }

    }

    return (
        <>
            <Snakbar ref={snackbarRef} message={msg} type={sType} />

            <div className="verifyButton" onClick={handleShow}>
                Verify Company
            </div>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Company Verification</Modal.Title>
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
                            <Form.Control type="text" placeholder="Enter 1" value={dValue}
                                onChange={(e) => { setDvalue(e.target.value) }}
                            />
                            <Form.Text className="text-muted">
                                Enter 1 to verify.
                            </Form.Text>
                        </Form.Group>

                        <Form.Text className="text-muted">
                                {msg}
                        </Form.Text>
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

export default VerifyCompanyModal