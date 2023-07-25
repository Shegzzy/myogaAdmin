import "./newCompany.scss";
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';

const NewCompany = () => {
    return (
        <div className='newCompany'>
            <Sidebar />
            <div className="newCompanyContainer">
                <Navbar />
                <div className="top">
                    <h1 className="titleHading">Add New Company</h1>
                </div>
            </div>
        </div>
    )
}

export default NewCompany