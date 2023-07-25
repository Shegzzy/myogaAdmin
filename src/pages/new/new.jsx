import Navbar from "../../components/navbar/navbar"
import Sidebar from "../../components/sidebar/sidebar"
import { useEffect, useState, useRef } from "react";
import "./new.scss"
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Snakbar from "../../components/snackbar/Snakbar";

const New = ({ inputs, title }) => {

    const [file, setFile] = useState("");
    const [data, setData] = useState({});
    const [per, setPerc] = useState(null);
    const navigate = useNavigate();
    const snackbarRef = useRef(null);
    const [msg, setMsg] = useState("");
    const [sType, setType] = useState("");

    useEffect(() => {
        const uploadFile = () => {

            const name = new Date().getTime() + file.name
            const storageRef = ref(storage, name);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setPerc(progress)
                    switch (snapshot.state) {
                        case 'paused':
                            setMsg("Upload is Paused");
                            setType("success");
                            snackbarRef.current.show();
                            break;
                        case 'running':
                            setMsg("Upload is Running");
                            setType("success");
                            snackbarRef.current.show();
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    // Handle unsuccessful uploads
                    setMsg(error.message);
                    setType("error");
                    snackbarRef.current.show();
                },
                () => {
                    // Handle successful uploads on complete
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setData((prev) => ({ ...prev, 'Profile Photo': downloadURL })
                        )
                    });
                    setMsg("Upload is Successful");
                    setType("success");
                    snackbarRef.current.show();
                }
            );

        }
        file && uploadFile();
    }, [file])

    const handleInput = (e) => {
        const id = e.target.id;
        const value = e.target.value;

        setData({ ...data, [id]: value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        try {
            const response = await createUserWithEmailAndPassword(auth, data.Email, data.Password);
            const docRef = await setDoc(doc(db, "Users", response.user.uid), {
                ...data,
                timeStamp: serverTimestamp(),
                Status: "inactive",
                'Date Created': new Date().toString(),
            });
            setMsg("User Added Successfully", docRef.id);
            setType("success");
            snackbarRef.current.show();
            navigate(-1);

        } catch (e) {
            setMsg(e.message);
            setType("error");
            snackbarRef.current.show();
        }

    }

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <Snakbar ref={snackbarRef} message={msg} type={sType} />
                    <h1 className="titleHading">{title}</h1>
                </div>
                <div className="bottom">
                    <div className="new-left">
                        <img src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="empty icon" />
                    </div>
                    <div className="new-right">
                        <form onSubmit={handleAdd}>
                            <div className="formInput">
                                <label htmlFor="file"> Upload Image <DriveFolderUploadIcon className="icon" /></label>
                                <input type="file" id="file" onChange={e => setFile(e.target.files[0])} style={{ display: "none" }} />
                            </div>

                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input id={input.id} type={input.type} placeholder={input.placeholder} onChange={handleInput} />
                                </div>
                            ))}
                            <button disabled={per !== null && per < 100} type="submit">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default New