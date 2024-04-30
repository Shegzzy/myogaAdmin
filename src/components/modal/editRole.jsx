import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from '../../firebase';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { InputGroup } from 'react-bootstrap';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import axios from 'axios';


function EditRole(props) {

    const ID = props.id;
    const [Name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseChangePassword = () => setShowChangePassword(false);
    const handleShowChangePassword = () => {
        handleClose();
        setShowChangePassword(true);
    }

    const handleUpdate = async () => {
        const DocRef = doc(db, "Roles", ID);
        await updateDoc(DocRef, {
            role: Name,
            email: email,
            password: password
        });
        handleClose();
    }


    const handleResetPassword = async () => {
        console.log(props.email);
        let roleEmail = props.email;

        try {
            const response = await axios.post('https://us-central1-myoga-80daa.cloudfunctions.net/resetPassword', roleEmail);
            // console.log(response)

            if (response.status === 200) {
                // setResetRequested(true);
                console.log(response.data.message);
                console.log(response.statusText);
            } else {
                setError('Failed to send password reset email');
                console.log(response.statusText);
            }
        } catch (error) {
            setError('Failed to send password reset email');
            console.log(error);
        }
    };


    return (
        <>

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
                            handleResetPassword();
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

                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    value={props.password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                                </Button>
                            </InputGroup>

                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <button className="primaryBtn text-purple-600" form="verifyForm" type="submit">Reset Password</button>                </Modal.Footer>
            </Modal>

            {/* change password modal */}
            <Modal
                show={showChangePassword}
                onHide={handleCloseChangePassword}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            // handleChangePassword();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">


                            <Form.Label>Old Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder='enter old password'
                                />
                                <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                                </Button>
                            </InputGroup>

                            <Form.Label>New Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder='enter new password'
                                />
                                <Button variant="outline-secondary" onClick={toggleNewPasswordVisibility}>
                                    {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                                </Button>
                            </InputGroup>

                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseChangePassword}>
                        Close
                    </Button>
                    <button className="primaryBtn text-purple-600" form="verifyForm" type="submit">Submit</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditRole