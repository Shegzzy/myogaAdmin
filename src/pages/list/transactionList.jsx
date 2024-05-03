import "./earningList.scss"
import Sidebar from "../../components/sidebar/sidebar"
import Navbar from "../../components/navbar/navbar"
import TransactionDataTable from "../../components/datatable/transactionDatatable"

const TransactionList = (role) => {
    return (
        <div className="earnList">
            <Sidebar {...role} />
            <div className="earnListContainer">
                <Navbar {...role} />
                <TransactionDataTable />
            </div>
        </div>
    )
}

export default TransactionList