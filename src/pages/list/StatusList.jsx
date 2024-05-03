import "./statusList.scss"
import Sidebar from "../../components/sidebar/sidebar"
import Navbar from "../../components/navbar/navbar"
import StatusDatatable from "../../components/datatable/StatusDatatable"

const StatusList = (role) => {
    return (
        <div className="statusList">
            <Sidebar {...role} />
            <div className="statusListContainer">
                <Navbar {...role} />
                <StatusDatatable />
            </div>
        </div>
    )
}

export default StatusList