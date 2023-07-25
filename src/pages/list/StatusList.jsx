import "./statusList.scss"
import Sidebar from "../../components/sidebar/sidebar"
import Navbar from "../../components/navbar/navbar"
import StatusDatatable from "../../components/datatable/StatusDatatable"

const StatusList = () => {
    return (
        <div className="statusList">
            <Sidebar />
            <div className="statusListContainer">
                <Navbar />
                <StatusDatatable />
            </div>
        </div>
    )
}

export default StatusList