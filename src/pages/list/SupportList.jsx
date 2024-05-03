import './supportList.scss';
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import SupportPage from '../../components/datatable/SupportPage';

const SupportList = (role) => {
    return (
        <div className='support'>
            <Sidebar {...role} />
            <div className="supportContainer">
                <Navbar {...role} />
                <SupportPage />
            </div>
        </div>
    )
}

export default SupportList