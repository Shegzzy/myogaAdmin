import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from '../../firebase';
import { format } from 'date-fns';
import Form from 'react-bootstrap/Form';
import emailjs from '@emailjs/browser';
import Snakbar from "../snackbar/Snakbar";



function ViewSupport(props) {
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [userName, setUserName] = useState('');
    const [emailTo, setEmailTo] = useState('');
    const [message, setMessage] = useState('');
    const form = useRef();
    const snackbarRef = useRef();
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseEmail = () => setShowEmail(false);
    const handleShowEmail = () => {
        handleClose();
        setShowEmail(true);
    }

    let from_name = "My Oga";

    const handleUpdate = async () => {
        const docRef = doc(db, 'supportTickets', props.id);

        await updateDoc(docRef, {
            status: "attended",
            timeStamp: serverTimestamp()
        });

        // // Construct the mailto link
        // const mailtoLink = `mailto:${props.email}?subject=Your%20support%20ticket%20has%20been%20attended&body=Your%20support%20ticket%20has%20been%20attended.%20Thank%20you%20for%20contacting%20us.`;

        // // Open the user's default email client with the mailto link
        // window.location.href = mailtoLink;
    }

    const sendEmail = async () => {
        setLoading(true);

        try {
            await emailjs
                .sendForm('service_favwdf7', 'template_vj896xn', form.current, {
                    publicKey: 'VjCHE8YKTs554g1Q-',

                })
                .then(
                    () => {
                        // console.log('SUCCESS!');
                        handleCloseEmail();
                        setMsg("Email Sent Successfully");
                        setType("success");
                        snackbarRef.current.show();
                        handleUpdate();


                        setEmailTo('');
                        setUserName('');
                        setMessage('');
                    },
                    (error) => {
                        // console.log('FAILED...', error);
                        handleCloseEmail();
                        setMsg("Fail to send email");
                        setType("error");
                        snackbarRef.current.show();
                    },
                );
        } catch (error) {
            console.log('Email Error', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Snakbar ref={snackbarRef} message={msg} type={sType} />
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
                    <p class="text-black hover:text-gray-400">Date Created: {format(new Date(props.date), 'dd/MM/yyyy')}</p>
                    <p class="text-black hover:text-gray-400">Message:</p>
                    <p class="text-slate-500 hover:text-purple-400">{props.message}</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {props.status === "new" && (<button className="primaryBtn text-purple-600" form="verifyForm" onClick={handleShowEmail}>Attend</button>)}
                </Modal.Footer>
            </Modal>

            <Modal
                show={showEmail}
                onHide={handleCloseEmail}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Send Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form ref={form}
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendEmail();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">

                            <Form.Label>From:</Form.Label>
                            <Form.Control type="text" value={from_name}
                                name='from_name' required
                            />
                            <Form.Label>User Name:</Form.Label>
                            <Form.Control type="text" value={props.name} name='to_name'
                                onChange={(e) => setUserName(e.target.value)} required
                            />

                            <Form.Label>To:</Form.Label>
                            <Form.Control type="email" value={props.email} name='email_to'
                                onChange={(e) => setEmailTo(e.target.value)} required
                            />

                            <Form.Label>Message:</Form.Label>
                            <div className="filter-select-container">
                                <textarea
                                    placeholder='enter message'
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    name='message'
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
                    <Button variant="secondary" onClick={handleCloseEmail}>
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
}

export default ViewSupport