import "./earningList.scss"
import Sidebar from "../../components/sidebar/sidebar"
import Navbar from "../../components/navbar/navbar"
import EarningDatatable from "../../components/datatable/EarningDatatable"

const EarningList = () => {
    return (
        <div className="earnList">
            <Sidebar />
            <div className="earnListContainer">
                <Navbar />
                <EarningDatatable />
            </div>
        </div>
    )
}

export default EarningList