import './profile.scss';
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import ProfilePage from '../../components/datatable/ProfilePage';

const Profile = () => {
    return (
        <div className='profileList'>
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <ProfilePage />
            </div>
        </div>
    )
}

export default Profile