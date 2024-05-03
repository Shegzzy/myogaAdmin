import "./list.scss"
import Sidebar from "../../components/sidebar/sidebar"
import Navbar from "../../components/navbar/navbar"
import Datatable from "../../components/datatable/datatable"

const List = (role) => {
    return (
        <div className="list">
            <Sidebar {...role} />
            <div className="listContainer">
                <Navbar {...role} />
                <Datatable />
            </div>
        </div>
    )
}

export default List