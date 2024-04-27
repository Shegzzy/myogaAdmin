import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { InputGroup } from 'react-bootstrap';


function EditRole(props) {

    const ID = props.id;
    const [Name, setName] = useState(props.name);
    const [email, setEmail] = useState(props.email);
    const [password, setPassword] = useState(props.password);
    const [show, setShow] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                    <Modal.Title>Edit Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Role</Form.Label>
                            <Form.Control type="text" value={Name}
                                onChange={(e) => { setName(e.target.value) }}
                            />

                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email" value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />

                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
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
                    <button className="primaryBtn text-purple-600" form="verifyForm" type="submit">Update</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditRole