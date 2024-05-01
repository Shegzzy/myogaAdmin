import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { InputGroup } from 'react-bootstrap';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Snakbar from '../snackbar/Snakbar';


function EditRole(props) {

    const ID = props.id;
    const [Name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    // const [showPassword, setShowPassword] = useState(false);
    const snackbarRef = useRef(null);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");
    const [loading, setLoading] = useState(false);


    const [error, setError] = useState(null);

    // const togglePasswordVisibility = () => {
    //     setShowPassword(!showPassword);
    // };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleUpdate = async () => {
        const DocRef = doc(db, "Roles", ID);
        await updateDoc(DocRef, {
            role: Name,
            email: email,
            password: password
        });
        handleClose();
    }


    // const handleResetPassword = async () => {
    //     console.log(props.email);
    //     let roleEmail = props.email;

    //     try {
    //         const response = await axios.post('https://us-central1-myoga-80daa.cloudfunctions.net/resetPassword', roleEmail);
    //         // console.log(response)

    //         if (response.status === 200) {
    //             // setResetRequested(true);
    //             console.log(response.data.message);
    //             console.log(response.statusText);
    //         } else {
    //             setError('Failed to send password reset email');
    //             console.log(response.statusText);
    //         }
    //     } catch (error) {
    //         setError('Failed to send password reset email');
    //         console.log(error);
    //     }
    // };

    const handlesResetPassword = async () => {
        // console.log(props.email);
        let roleEmail = props.email;

        try {
            setLoading(true);
            const auth = getAuth();
            sendPasswordResetEmail(auth, roleEmail)
                .then(() => {
                    // console.log("Email sent");
                    setLoading(false);
                    handleClose();
                    setMsg("A password reset link have been sent to your email");
                    setType("success");
                    snackbarRef.current.show();
                })
                .catch((error) => {
                    setLoading(false);
                    setMsg("Password reset failed");
                    setType("error");
                    snackbarRef.current.show();
                });
        } catch (error) {
            setLoading(false);
            setError('Failed to send password reset email');
            console.log(error);
        }
    };


    return (
        <>
            <Snakbar ref={snackbarRef} message={msg} type={sType} />

            <button onClick={handleShow} class="px-4 py-1 text-sm text-purple-600 font-semibold
             rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent
              focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">View</button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handlesResetPassword();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Role</Form.Label>
                            <Form.Control type="text" value={props.name}
                                onChange={(e) => { setName(e.target.value) }}
                            />

                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" value={props.email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />

                            {/* <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    value={props.password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                                </Button>
                            </InputGroup> */}

                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button
                        form='verifyForm'
                        type="submit"
                        className={loading ? "spinner-btn" : "primaryBtn text-purple-600"}
                        disabled={loading}
                    >
                        <span className={loading ? "hidden" : ""}>Reset Password</span>
                        <span className={loading ? "" : "hidden"}>
                            <div className="spinner"></div>
                        </span>
                        {loading && <span>Resetting Password...</span>}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditRole