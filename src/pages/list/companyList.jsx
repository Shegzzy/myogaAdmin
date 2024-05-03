import "./companyList.scss"
import Sidebar from '../../components/sidebar/sidebar';
import Navbar from '../../components/navbar/navbar';
import CompanyDatatable from '../../components/datatable/companyDatatable';

const CompanyList = (role) => {
    return (
        <div className='companyList'>
            <Sidebar {...role} />
            <div className="companyListContainer">
                <Navbar {...role} />
                <CompanyDatatable />
            </div>
        </div>
    )
}

export default CompanyList