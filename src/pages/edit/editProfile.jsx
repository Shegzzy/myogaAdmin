import "./editProfile.scss";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const EditProfile = ({ inputs, title }) => {

    const [file, setFile] = useState("");
    const [userProfile, setUserProfile] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userRef = doc(db, "Admin", id);
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
            let photoUrl = userProfile.profilePhoto || "";
            if (file) {
                const storageRef = ref(storage, file.name);
                const snapshot = await uploadBytes(storageRef, file);
                photoUrl = await getDownloadURL(snapshot.ref);
            }

            // Update user profile with new photo URL
            const updatedProfile = {
                ...userProfile,
                profilePhoto: photoUrl,
            };
            const userRef = doc(db, "Admin", id);
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
                                    : userProfile?.profilePhoto ||
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

export default EditProfile