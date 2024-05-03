import './profile.scss';
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import ProfilePage from '../../components/datatable/ProfilePage';

const Profile = (role) => {
    return (
        <div className='profileList'>
            <Sidebar {...role} />
            <div className="listContainer">
                <Navbar {...role} />
                <ProfilePage />
            </div>
        </div>
    )
}

export default Profile