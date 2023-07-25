import "./settingList.scss"
import Sidebar from "../../components/sidebar/sidebar"
import Navbar from "../../components/navbar/navbar"
import SettingData from "../../components/datatable/SettingData"

const SettingList = () => {
    return (
        <div className="setList">
            <Sidebar />
            <div className="setListContainer">
                <Navbar />
                <SettingData />
            </div>
        </div>
    )
}

export default SettingList