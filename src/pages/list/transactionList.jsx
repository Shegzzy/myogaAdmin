import "./earningList.scss"
import Sidebar from "../../components/sidebar/sidebar"
import Navbar from "../../components/navbar/navbar"
import TransactionDataTable from "../../components/datatable/transactionDatatable"

const TransactionList = () => {
    return (
        <div className="earnList">
            <Sidebar />
            <div className="earnListContainer">
                <Navbar />
                <TransactionDataTable />
            </div>
        </div>
    )
}

export default TransactionList