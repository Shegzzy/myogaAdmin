import "./earningList.scss"
import Sidebar from "../../components/sidebar/sidebar"
import Navbar from "../../components/navbar/navbar"
import EarningDatatable from "../../components/datatable/EarningDatatable"

const EarningList = (role) => {
    return (
        <div className="earnList">
            <Sidebar {...role} />
            <div className="earnListContainer">
                <Navbar {...role} />
                <EarningDatatable />
            </div>
        </div>
    )
}

export default EarningList