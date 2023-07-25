import "./companyList.scss"
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import CompanyDatatable from '../../components/datatable/companyDatatable';

const CompanyList = () => {
    return (
        <div className='companyList'>
            <Sidebar />
            <div className="companyListContainer">
                <Navbar />
                <CompanyDatatable />
            </div>
        </div>
    )
}

export default CompanyList