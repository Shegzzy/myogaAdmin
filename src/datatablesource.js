import AssignModal from './components/modal/AssignModal';
import ModalContainer from './components/modal/ModalContainer';
import VerifyModal from './components/modal/VerifyModal';

export const userColumns = [
    { field: 'id', headerName: 'ID', width: 150 },
    {
        field: "user", headerName: "User", width: 200, renderCell: (params)=>{
            return (
                <div className="cellWithImg">
                    <img className="cellImg" src={params.row['Profile Photo']} alt=" avatar "/>
                    {params.row.FullName}
                </div>
            )
        }
    },
    {
        field: "Email", headerName:"Email", width: 200,
    },
    {
        field: "Phone", headerName:"Phone Number", width: 150,
    },
    {
        field: ['Date of Birth'], headerName:"Date of Birth", width: 100,
    },
    {
        field: "Gender", headerName:"Gender", width: 100,
    },
    {
        field: "Address", headerName:"Address", width: 150,
    },
    {
        field: "Status", headerName:"Status", width: 100,
        renderCell:(params)=>{
            return(
                <div className={`cellWithStatus ${params.row.Status}`}>
                    {params.row.Status}
                </div>
            )
        }
    },
    {
        field: ['Date Created'], headerName:"Date Created", width: 150,
    },
];

export const driverColumns = [
    { field: 'id', headerName: 'ID', width: 150 },
    {
        field: "FullName", headerName: "Driver Name", width: 200, renderCell: (params)=>{
            return (
                <div className="cellWithImg">
                    <img className="cellImg" src={params.row['Profile Photo']} alt=" avatar "/>
                    {params.row.FullName}
                </div>
            )
        }
    },
    {
        field: "Email", headerName:"Email", width: 200,
    },
    {
        field: "Phone", headerName:"Phone Number", width: 150,
    },
    {
        field: ['Date of Birth'], headerName:"Date of Birth", width: 100,
    },
    {
        field: "Gender", headerName:"Gender", width: 100,
    },
    {
        field: "State", headerName:"Location", width: 100,
    },
    {
        field: "Address", headerName:"Address", width: 150,
    },
    {
        field: "Online", headerName:"Status", width: 100,
        renderCell:(params)=>{
            return(
                <div className={`cellWithStatus ${params.row.Online}`}>
                    {params.row.Online==="1"?"online":"offline"}
                </div>
            )
        }
    },
    {
        field: "Verified", headerName:"Verification", width: 100,
        renderCell:(params)=>{
            return(
                <div className={`cellWithVerify ${params.row.Verified}`}>
                    {params.row.Verified==="1"?"verified":"not verified"}
                    {params.row.Verified==="0"?<AssignModal value={params.row.Verified} Id={params.row.id} />:<div className="verifiedButton">Verified</div>}
                </div>
            )
        }
    },
    {
        field: "Company", headerName:"Company", width: 150,
    },
    {
        field: "Documents", headerName:"Documents", width: 150,
        renderCell: (params)=>{
            return (
                <div className="cellWithImg">
                    <img className="cellImg" src={params.row['Documents']} alt=" docs "/>
                </div>
            )
        }
    },
    {
        field: "Vehicle Type", headerName:"Vehicle Type", width: 100,
    },
    {
        field: "Vehicle Make", headerName:"Vehicle Make", width: 100,
    },
    {
        field: "Vehicle Color", headerName:"Vehicle Color", width: 100,
    },
    {
        field: "Vehicle Year", headerName:"Vehicle Year", width: 100,
    },
    {
        field: "Vehicle Number", headerName:"Vehicle Number", width: 100,
    },
    {
        field: "Date Created", headerName:"Date Created", width: 150,
    },
];
export const companyColumns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
        field: "Company Name", headerName: "Company Name", width: 200, renderCell: (params)=>{
            return (
                <div className="cellWithImg">
                   { params.row['Profile Photo'] === null ? <img className="cellImg" src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg" alt=" avatar "/>
                   :<img className="cellImg" src={params.row['Profile Photo']} alt=" avatar "/>
                   }
                    {params.row.company}
                </div>
            )
        }
    },
    {
        field: "email", headerName:"Email", width: 200,
    },
    {
        field: "phone", headerName:"Company Phone Number", width: 150,
    },
    {
        field: "regnumber", headerName:"Registration Number", width: 150,
    },
    {
        field: "address", headerName:"Company Address", width: 150,
    },
    {
        field: "location", headerName:"Location", width: 150,
    },
    {
        field: "Status", headerName:"Status", width: 100,
        renderCell:(params)=>{
            return(
                <div className={`cellWithStatus ${params.row.Status}`}>
                    {params.row.Status}
                </div>
            )
        }
    },
    {
        field: "Document", headerName:"Documents", width: 150, renderCell:(params)=>{
            return(
                <div className="cellWithImg" >
                    { params.row.documents === null ? <img className="cellImg" src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg" alt=" avatar "/>
                   :<img className="cellImg" src={params.row.documents} alt=" avatar "/>
                   }
                </div>
            )
        }
    },
    {
        field: "date", headerName:"Date Created", width: 150,
    },
];
export const bookingColumns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
        field: "Booking Number", headerName:"Booking Number", width: 150,
    },
    {
        field: "Customer Name", headerName:"Cusomer Name", width: 150,
    },
    {
        field: "Customer Phone", headerName:"Customer Phone", width: 150,
    },
    {
        field: 'Customer ID', headerName:"Customer ID", width: 100,
    },
    {
        field: "Driver ID", headerName:"Driver ID", width: 100,
    },
    {
        field: ['PickUp Address'], headerName:"Pick Up Address", width: 150,
    },
    {
        field: ['DropOff Address'], headerName:"Drop Off Address", width: 150,
    },
    {
        field: "Distance", headerName:"Distance", width: 80,
    },
    {
        field: "Amount", headerName:"Amount NGN", width: 100,
    },
    {
        field: "Payment Method", headerName:"Payment Method", width: 150,
    },
    {
        field: "Status", headerName:"Status", width: 100,
        renderCell:(params)=>{
            return(
                <div className={`cellWithStatus ${params.row.Status}`}>
                    {params.row.Status}
                    {params.row.Status === "pending"?<VerifyModal Id={params.row.id} customer={params.row['Customer ID']} bookNum={params.row['Booking Number']}/>:<ModalContainer id={params.row['Booking Number']}/>}
                </div>
            )
        }
    },
    {
        field: "Date Created", headerName:"Date Created", width: 150,
    },
];

export const statusColumns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
        field: "Booking Number", headerName:"Booking Number", width: 150,
        
    },
    {
        field: 'Customer ID', headerName:"Customer ID", width: 100,
        
    },
    {
        field: "Driver ID", headerName:"Driver ID", width: 100,
        
    },
    {
        field: ['Order Assigned'], headerName:"Booking Accepted", width: 150,
        renderCell:(params)=>{
            return(
                <div className='cellStatus'>
                    {params.row['Order Assigned'] === "1"?"Yes":"Not Yet"}
                </div>
            )
        }
    },
    {
        field: ['Out For PickUp'], headerName:"On Way to Pick Up", width: 150,
        renderCell:(params)=>{
            return(
                <div className='cellStatus'>
                    {params.row['Out For PickUp'] === "1"?"Yes":"Not Yet"}
                </div>
            )
        }
    },
    {
        field: "Arrived at PickUp", headerName:"Arrived at Pick Up", width: 80,
        renderCell:(params)=>{
            return(
                <div className='cellStatus'>
                    {params.row['Arrive at PickUp'] === "1"?"Yes":"Not Yet"}
                </div>
            )
        }
    },
    {
        field: "Parcel Picked", headerName:"Parcel Picked", width: 100,
        renderCell:(params)=>{
            return(
                <div className='cellStatus'>
                    {params.row['Parcel Picked'] === "1"?"Yes":"Not Yet"}
                </div>
            )
        }
    },
    {
        field: "Going to DropOff", headerName:"On Way to Drop", width: 150,
        renderCell:(params)=>{
            return(
                <div className='cellStatus'>
                    {params.row['Going to DropOff'] === "1"?"Yes":"Not Yet"}
                </div>
            )
        }
    },
    {
        field: "Arrived at DropOff", headerName:"Arrived at Drop", width: 100,
        renderCell:(params)=>{
            return(
                <div className='cellStatus'>
                    {params.row['Arrive DropOff'] === "1"?"Yes":"Not Yet"}
                </div>
            )
        }
    },
    {
        field: "Completed", headerName:"Completed", width: 100,
        renderCell:(params)=>{
            return(
                <div className='cellStatus'>
                    {params.row.Completed === "1"?"Yes":"Not Yet"}
                </div>
            )
        }
    },
    {
        field: "Date Created", headerName:"Date Created", width: 150,
    },
];
export const earningColumns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
        field: "BookingID", headerName:"Booking Number", width: 150,
        
    },
    {
        field: "Driver", headerName:"Driver ID", width: 150,
        renderCell:(params)=>{
            return(
                <div className='cellStatus'>
                    <a href='./'>
                        {params.row.Driver}
                    </a>
                </div>
            )
        }
    },
    {
        field: "Company", headerName:"Company", width: 150,
    },
    {
        field: "Amount", headerName:"Amount", width: 100,
        renderCell:(params)=>{
            return(
                <div className='cellStatus'>
                    N{params.row.Amount}
                </div>
            )
        }
    },
    {
        field: "Customer", headerName:"Customer ID", width: 100,
        renderCell:(params)=>{
            return(
                <div className='cellStatus'>
                    <a href='./'>
                        {params.row.Customer}
                    </a>
                </div>
            )
        }
    },
    {
        field: "DateCreated", headerName:"Date Created", width: 150,
    },
];

export const driversRows = [
    {
        id: "12DFsdCDEZ",
        user: "Jane Lawrence",
        Email: "Jane Lawrence",
        Phone: "+2349023453223",
        DateOfBirth: "22 MAY 1993",
        Gender: "Male",
        Address: "no 43 Street gwags",
        Location: "Abuja",
        timeStamp: "02 March 2023",
        Company: "Kelvent Logistics",
        Document: "no docs",
        VehicleType: "Motorcycle",
        VehicleMake: "BAJAJ",
        VehicleColor: "RED",
        VehicleYear: "2010",
        VehicleNumber: "SKLL79-ABJ",
        Status: "Pending",
    },
    {
        id: "12DFCazDEZ",
        user: "Jane Lawrence",
        Email: "Jane Lawrence",
        Phone: "+2349023453223",
        DateOfBirth: "22 MAY 1993",
        Gender: "Male",
        Address: "no 43 Street gwags",
        Location: "Abuja",
        timeStamp: "02 March 2023",
        Company: "Kelvent Logistics",
        Document: "12km",
        VehicleType: "Motorcycle",
        VehicleMake: "TSUZUKI",
        VehicleColor: "RED",
        VehicleYear: "2010",
        VehicleNumber: "SKLL79-ABJ",
        Status: "active",
    },
    {
        id: "12DFLKCDEZ",
        user: "Jane Lawrence",
        Email: "Jane Lawrence",
        Phone: "+2349023453223",
        DateOfBirth: "22 May 1993",
        Gender: "Male",
        Address: "no 43 Street gwags",
        Location: "Abuja",
        timeStamp: "22 April 2022",
        Company: "MerryGo Logistics",
        Document: "12km",
        VehicleType: "Motorcycle",
        VehicleMake: "BAJAJ",
        VehicleColor: "RED",
        VehicleYear: "2010",
        VehicleNumber: "SKLL79-ABJ",
        Status: "inactive",
    },
    {
        id: "12ZGDFCDEZ",
        user: "Jane Lawrence",
        Email: "Jane Lawrence",
        Phone: "+2349023453223",
        DateOfBirth: "22 MAY 1993",
        Gender: "Male",
        Address: "no 43 Street gwags",
        Location: "Abuja",
        timeStamp: "22 April 2022",
        Company: "Kelvent Logistics",
        Document: "12km",
        VehicleType: "Motorcycle",
        VehicleMake: "BAJAJ",
        VehicleColor: "RED",
        VehicleYear: "2010",
        VehicleNumber: "SKLL79-ABJ",
        Status: "Pending",
    },
    {
        id: "12DFCDMNEZ",
        user: "Jane Lawrence",
        Email: "Jane Lawrence",
        Phone: "+2349023453223",
        DateOfBirth: "22 MAY 1993",
        Gender: "Male",
        Address: "no 43 Street gwags",
        Location: "Abuja",
        timeStamp: "22 April 2022",
        Company: "Kelvent Logistics",
        Document: "12km",
        VehicleType: "Motorcycle",
        VehicleMake: "BAJAJ",
        VehicleColor: "RED",
        VehicleYear: "2010",
        VehicleNumber: "SKLL79-ABJ",
        Status: "Pending",
    },
    {
        id: "12DFERCDEZ",
        user: "Jane Lawrence",
        Email: "Jane Lawrence",
        Phone: "+2349023453223",
        DateOfBirth: "22 MAY 1993",
        Gender: "Male",
        Address: "no 43 Street gwags",
        Location: "Abuja",
        timeStamp: "22 April 2022",
        Company: "MerryGo Logistics",
        Document: "12km",
        VehicleType: "Motorcycle",
        VehicleMake: "BAJAJ",
        VehicleColor: "RED",
        VehicleYear: "2010",
        VehicleNumber: "SKLL79-ABJ",
        Status: "Pending",
    },
    {
        id: "12DFOYCDEZ",
        user: "Jane Lawrence",
        Email: "Jane Lawrence",
        Phone: "+2349023453223",
        DateOfBirth: "22 MAY 1993",
        Gender: "Male",
        Address: "no43 Street gwags",
        Location: "Abuja",
        timeStamp: "22 April 2022",
        Company: "Kelvent Logistics",
        Document: "12km",
        VehicleType: "Motorcycle",
        VehicleMake: "BAJAJ",
        VehicleColor: "RED",
        VehicleYear: "2010",
        VehicleNumber: "SKLL79-ABJ",
        Status: "Pending",
    },
    {
        id: "12DFCDEPMDZ",
        user: "Jane Lawrence",
        Email: "Jane Lawrence",
        Phone: "+2349023453223",
        DateOfBirth: "22 MAY 1993",
        Gender: "Male",
        Address: "no 43 Street gwags",
        Location: "Abuja",
        timeStamp: "22 April 2022",
        Company: "Kelvent Logistics",
        Document: "no docs",
        VehicleType: "Motorcycle",
        VehicleMake: "BAJAJ",
        VehicleColor: "RED",
        VehicleYear: "2010",
        VehicleNumber: "234RFS",
        Status: "Pending",
    },
  ];

  export const earningsColumns = [
    { field: 'id', headerName: 'ID', width: 150 },
    {
        field: "CompanyName", headerName: "Company Name", width: 200, renderCell: (params)=>{
            return (
                <div className="cellWithImg">
                    <img className="cellImg" src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg" alt=" avatar "/>
                    {params.row.CompanyName}
                </div>
            )
        }
    },
    {
        field: "Email", headerName:"Email", width: 200,
    },
    {
        field: "Phone", headerName:"Company Phone Number", width: 150,
    },
    {
        field: "DateOfRegistration", headerName:"Date of Registration", width: 150,
    },
    {
        field: "Address", headerName:"Company Address", width: 150,
    },
    {
        field: "Status", headerName:"Status", width: 100,
        renderCell:(params)=>{
            return(
                <div className={`cellWithStatus ${params.row.Status}`}>
                    {params.row.Status}
                </div>
            )
        }
    },
    {
        field: "Document", headerName:"Documents", width: 150,
    },
    {
        field: "timeStamp", headerName:"Date Created", width: 150,
    },
];

export const companyRows = [
    {
        id: "12DFidCDEZ",
        CompanyName: "Kelvent Logistics",
        Phone: "+2349023453223",
        Email: "kelvent@gmail.com",
        DateOfRegistration: "02 March 2023",
        Address: "no 43 Street gwags",
        Document: "CAC DOC",
        timeStamp: "12 JAN. 2021",
        Status: "Pending",
    },
    {
        id: "12DFGHHCDEZ",
        CompanyName: "Kelvent Logistics",
        Phone: "+2349023453223",
        Email: "kelvent@gmail.com",
        DateOfRegistration: "02 March 2023",
        Address: "no 43 Street gwags",
        Document: "CAC DOC",
        timeStamp: "12 JAN. 2021",
        Status: "Pending",
    },
    {
        id: "12DFDFKSZ",
        CompanyName: "Kelvent Logistics",
        Phone: "+2349023453223",
        Email: "kelvent@gmail.com",
        DateOfRegistration: "02 March 2023",
        Address: "no 43 Street gwags",
        Document: "CAC DOC",
        timeStamp: "12 JAN. 2021",
        Status: "Pending",
    },
    {
        id: "12DFLPZCDEZ",
        CompanyName: "Kelvent Logistics",
        Phone: "+2349023453223",
        Email: "kelvent@gmail.com",
        DateOfRegistration: "02 March 2023",
        Address: "no 43 Street gwags",
        Document: "CAC DOC",
        timeStamp: "12 JAN. 2021",
        Status: "Pending",
    },
];
export const bookingRows = [
    {
        id: "12DFCDEZ",
        CustomerID: "12DFCmpoDEZ",
        CustomerName: "Jane Lawrence",
        CustomerPhone: "+2349023453223",
        DriverID: "AJSndjhhfihsqhhc",
        timeStamp: "02 March 2023",
        PickUp: "no 43 Street gwags",
        DropOff: "new york street, utako",
        distance: "12km",
        amount: "4500",
        method: "Cash on Delivery",
        Status: "Pending",
    },
    {
        id: "12DF01DEZ",
        CustomerID: "12DFCmpoaDEZ",
        CustomerName: "Jane Lawrence",
        CustomerPhone: "+2349023453223",
        DriverID: "AJSndjh234hfihsqhhc",
        timeStamp: "02 March 2023",
        PickUp: "no 43 Street gwags",
        DropOff: "new york street, utako",
        distance: "12km",
        amount: "4500",
        method: "Cash on Delivery",
        Status: "Pending",
    },
    {
        id: "12DFCD178EZ",
        CustomerID: "12DFCmMQDFDEZ",
        CustomerName: "Jane Lawrence",
        CustomerPhone: "+2349023453223",
        DriverID: "AJSndjhhfihsqhhc",
        timeStamp: "02 March 2023",
        PickUp: "no 43 Street gwags",
        DropOff: "new york street, utako",
        distance: "12km",
        amount: "4500",
        method: "Cash on Delivery",
        Status: "Pending",
    },
    {
        id: "12DFCD23OPEZ",
        CustomerID: "12DFCmpoARTDEZ",
        CustomerName: "Jane Lawrence",
        CustomerPhone: "+2349023453223",
        DriverID: "AJSndjhhfihsqhhc",
        timeStamp: "02 March 2023",
        PickUp: "no 43 Street gwags",
        DropOff: "new york street, utako",
        distance: "12km",
        amount: "4500",
        method: "Cash on Delivery",
        Status: "Pending",
    },
    {
        id: "12DFC765LDEZ",
        CustomerID: "12DFCmpoL1DEZ",
        CustomerName: "Jane Lawrence",
        CustomerPhone: "+2349023453223",
        DriverID: "AJSndjhhfihsqhhc",
        timeStamp: "02 March 2023",
        PickUp: "no 43 Street gwags",
        DropOff: "new york street, utako",
        distance: "12km",
        amount: "4500",
        method: "Cash on Delivery",
        Status: "Pending",
    },
    {
        id: "12DFCDS4DEZ",
        CustomerID: "12DFCmpo4SAQDEZ",
        CustomerName: "Jane Lawrence",
        CustomerPhone: "+2349023453223",
        DriverID: "AJSndjhhfihsqhhc",
        timeStamp: "02 March 2023",
        PickUp: "no 43 Street gwags",
        DropOff: "new york street, utako",
        distance: "12km",
        amount: "4500",
        method: "Cash on Delivery",
        Status: "Pending",
    },
];