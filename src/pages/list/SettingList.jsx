import "./settingList.scss"
import Sidebar from "../../components/sidebar/sidebar"
import Navbar from "../../components/navbar/navbar"
import SettingData from "../../components/datatable/SettingData"

const SettingList = (role) => {
    return (
        <div className="setList">
            <Sidebar {...role} />
            <div className="setListContainer">
                <Navbar {...role} />
                <SettingData />
            </div>
        </div>
    )
}

export default SettingList