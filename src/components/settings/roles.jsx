import React, { useState } from 'react'
import { deleteDoc, doc } from "firebase/firestore";
import { db } from './../../firebase';
import EditRole from '../modal/editRole';

const RoleSet = (props) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteDoc(doc(db, "Roles", props.id));
        } catch (erre) {
            console.log(erre)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="m-2 py-8 px-8 max-w-sm bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
            <p class="text-slate-400 hover:text-sky-400 text-left">Role</p>
            <div class="text-center space-y-2 sm:text-left">
                <div class="space-y-0.5">
                    <p class="text-lg text-black font-semibold">
                        {props.name}
                    </p>
                </div>
                <EditRole id={props.id} name={props.name} email={props.email} password={props.password} />
                <button onClick={() => handleDelete()} disabled={loading} class={loading ? "spinner-btn" : "px-4 py-1 text-sm text-red-600 font-semibold rounded-full border border-red-200 hover:text-white hover:bg-red-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"}>
                    <span className={loading ? "hidden" : ""}>Delete</span>
                    <span className={loading ? "" : "hidden"}>
                        <div className="spinner"></div>
                    </span>
                    {loading && <span>Deleting...</span>}
                </button>

            </div>
        </div>
    )
}

export default RoleSet