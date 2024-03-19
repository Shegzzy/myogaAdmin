import ViewSupport from '../modal/ViewSupport';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
// import TablePagination from '@mui/material/TablePagination';

const SupportCard = (props) => {


    return (
        <div>
            {/* <p class="text-slate-400 hover:text-sky-400 text-left">{props.type}</p>
            <div class="text-center space-y-2 sm:text-left">
                <div class="space-y-0.5">
                    <p class="text-lg text-black font-semibold">
                        {props.ticket}
                    </p>
                    <p class="text-slate-500 font-medium">
                        {props.name}
                    </p>
                    <p class="text-slate-500 font-medium">
                        {props.status}
                    </p>
                </div>
            </div> */}
            <TableContainer component={Paper} className="table">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="tableCell">Rider Name</TableCell>
                            <TableCell className="tableCell">Email</TableCell>
                            <TableCell className="tableCell">Address</TableCell>
                            <TableCell className="tableCell">Location </TableCell>
                            <TableCell className="tableCell">Vehicle Number</TableCell>
                            <TableCell className="tableCell">Status</TableCell>
                            <TableCell className="tableCell">Date Joined</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        <TableRow>
                            <TableCell colSpan={10} align="center">
                                No data available.
                            </TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>
            <ViewSupport
                id={props.id}
                name={props.name}
                subject={props.subject}
                type={props.type}
                ticket={props.ticket}
                date={props.date}
                message={props.message}
                status={props.status}
                email={props.email} />
        </div >
    )
}

export default SupportCard