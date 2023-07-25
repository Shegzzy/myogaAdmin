import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";
import { useEffect, useState } from "react";
import "./editUser.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditUser = ({ inputs, title }) => {

    const [userProfile, setUserProfile] = useState(null);
    const { id } = useParams();
    const [file, setFile] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userRef = doc(db, "Users", id);
                const snapshot = await getDoc(userRef);
                setUserProfile(snapshot.data());
            } catch (error) {
                toast.error("Error fetching user profile", error);
            }
        };

        fetchUserProfile();
    }, [id]);

    const handleFormSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            // Upload new photo to Firebase Storage
            let photoUrl = userProfile["Profile Photo"] || "";
            if (file) {
                const storageRef = ref(storage, file.name);
                const snapshot = await uploadBytes(storageRef, file);
                photoUrl = await getDownloadURL(snapshot.ref);
            }

            // Update user profile with new photo URL
            const updatedProfile = {
                ...userProfile,
                "Profile Photo": photoUrl,
            };
            const userRef = doc(db, "Users", id);
            await updateDoc(userRef, updatedProfile);
            toast.success("Profile Updated");
        } catch (error) {
            toast.error(error.message);
        }

        navigate(-1);
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                file
                                    ? URL.createObjectURL(file)
                                    : userProfile?.["Profile Photo"] ||
                                    "https://picsum.photos/200"
                            }
                            alt="User Avatar"
                        />
                    </div>
                    <div className="right">
                        <form onSubmit={handleFormSubmit}>
                            <div className="formInput">
                                <label htmlFor="file">
                                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                    <br />
                                    click icon to upload profile photo
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        value={userProfile?.[input.id] || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setUserProfile((prevProfile) => ({
                                                ...prevProfile,
                                                [input.id]: value,
                                            }));
                                        }}
                                        disabled={input.disabled}
                                    />
                                    {" "}
                                </div>
                            ))}

                            <button
                                type="submit"
                                className={loading ? "spinner-btn" : ""}
                                disabled={loading}
                            >
                                <span className={loading ? "hidden" : ""}>Update</span>
                                <span className={loading ? "" : "hidden"}>
                                    <div className="spinner"></div>
                                </span>
                                {loading && <span>Updating...</span>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditUser