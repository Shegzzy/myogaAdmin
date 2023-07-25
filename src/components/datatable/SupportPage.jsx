import './supportPage.scss';
import SupportCard from '../support/SupportCard';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase'

const SupportPage = () => {

    const [Sdata, setSData] = useState([]);

    useEffect(() => {
        fetchSupport();

    });

    const fetchSupport = () => {
        const unsub = onSnapshot(collection(db, "supportTickets"), (snapShot) => {
            let list = [];
            snapShot.docs.forEach(doc => {
                list.push({ id: doc.id, name: doc.data().name, status: doc.data().status, ticket: doc.data().ticketNumber, email: doc.data().email, subject: doc.data().subject, type: doc.data().type, date: doc.data().dateCreated, message: doc.data().message });
            });
            setSData(list);
            // setMsg(" Displaying Users Information ");
            // setType("success");
            // snackbarRef.current.show();
        }, (error) => {
            // setMsg(error.message);
            // setType("error");
            // snackbarRef.current.show();
        });

        return () => {
            unsub();
        }
    }

    return (
        <div className='support-page'>
            <div className="s-top">
                <div className="s-title">
                    Supports
                </div>
            </div>
            <div className="s-bottom">
                {Sdata.map((data) => {
                    return (
                        <SupportCard id={data.id} name={data.name} subject={data.subject} type={data.type} ticket={data.ticket} date={data.date} message={data.message} status={data.status} email={data.email} />
                    )
                })}

            </div>

        </div>
    )
}

export default SupportPage