import "./newDriver.scss";
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';

const NewDriver = () => {
    return (
        <div className="newDriver">
            <Sidebar />
            <div className="newDriverContainer">
                <Navbar />
                <div className="top">
                    <h1 className="titleHading">Add New Driver</h1>
                </div>
            </div>
        </div>
    )
}

export default NewDriver