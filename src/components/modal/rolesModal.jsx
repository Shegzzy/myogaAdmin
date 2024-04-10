import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function RoleAndCredentialsForm() {
    const [roleName, setRoleName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);


    const handleSubmit = async (e) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, 'Roles', uid), {
                role: roleName,
                email: email,
                password: password,
            });

            alert('Role and login credentials created successfully!');
            setRoleName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Error creating role and credentials:', error);
            alert('An error occurred while creating the role and credentials. Please try again.');
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>

            <button onClick={handleShow} class="px-4 py-1 
            text-sm text-purple-600 font-semibold rounded-full border 
            border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent 
            focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Add New Role</button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create New Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Role Name:</Form.Label>
                            <Form.Control type="text" value={roleName}
                                onChange={(e) => setRoleName(e.target.value)} required
                            />

                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="text" value={email}
                                onChange={(e) => setEmail(e.target.value)} required
                            />

                            <Form.Label>Password:</Form.Label>
                            <Form.Control type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)} required
                            />
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
};

export default RoleAndCredentialsForm;
