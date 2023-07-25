import "./reactToast.scss"
import { forwardRef, useImperativeHandle, useState } from 'react';

const ReactToast = ({ timeout = 1500 }, refs) => {

    const [show, setShow] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    useImperativeHandle(refs, () => ({
        showToast(msg = '') {
            setShow(true)
            setToastMsg(msg)
            setTimeout(() => {
                setShow(false)
            }, timeout)
        },
    }))

    return (
        <div className={`toast ${show ? "show" : ""}`}>{toastMsg}</div>
    )
}

export default forwardRef(ReactToast)