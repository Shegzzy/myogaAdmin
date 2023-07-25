import './supportList.scss';
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import SupportPage from '../../components/datatable/SupportPage';

const SupportList = () => {
    return (
        <div className='support'>
            <Sidebar />
            <div className="supportContainer">
                <Navbar />
                <SupportPage />
            </div>
        </div>
    )
}

export default SupportList