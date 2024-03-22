import "./userTable.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDocs, where, query, collection, getDoc, doc } from "firebase/firestore";
import { db } from "./../../firebase";
import { format } from "date-fns";
import TablePagination from '@mui/material/TablePagination';


const UserTable = (props) => {
  const [data, setData] = useState([]);
  const userID = props.id;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchBooking();
  }, [userID]);

  // fetching all users bookings
  const fetchBooking = async () => {
    try {
      const booking = [];
      const driverMap = new Map();

      const q = query(
        collection(db, "Bookings"),
        where("Customer ID", "==", userID)
      );

      const docSnap = await getDocs(q);
      // docSnap.forEach((doc) => {
      //   booking.push({ id: doc.id, ...doc.data() });
      // });

      // Fetch driver and user IDs
      docSnap.forEach((doc) => {
        const { "Driver ID": driverID } = doc.data();
        driverMap.set(driverID, "");
      });

      // Populate driver names
      await Promise.all(Array.from(driverMap.keys()).map(async (driverID) => {
        try {
          const driverDoc = await getDoc(doc(db, "Drivers", driverID));
          if (driverDoc.exists()) {
            const driverName = driverDoc.data().FullName;
            driverMap.set(driverID, driverName);
          } else {
            console.log(`Driver with ID ${driverID} does not exist.`);
            driverMap.delete(driverID);
          }
        } catch (error) {
          console.error(`Error fetching driver with ID ${driverID}: ${error}`);
        }
      }));





      docSnap.forEach((docs) => {
        const { "Driver ID": driverID, ...rest } = docs.data();
        const driverName = driverMap.get(driverID);

        booking.push({
          id: docs.id,
          ...docs.data(),
          "Driver Name": driverName
        });
      });

      booking.sort(
        (a, b) => new Date(b["Date Created"]) - new Date(a["Date Created"])
      );

      setData(booking);
    } catch (error) {
      alert("Error", error.message);
    }
  };

  return (
    <div>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Booking Number</TableCell>
              <TableCell className="tableCell">Customer</TableCell>
              <TableCell className="tableCell">Phone</TableCell>
              <TableCell className="tableCell">Rider</TableCell>
              <TableCell className="tableCell">Pick Up</TableCell>
              <TableCell className="tableCell">Drop Off</TableCell>
              <TableCell className="tableCell">Distance</TableCell>
              <TableCell className="tableCell">Amount</TableCell>
              <TableCell className="tableCell">Payment Method</TableCell>
              <TableCell className="tableCell">Status</TableCell>
              <TableCell className="tableCell">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length !== 0 ? (data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell className="tableCell">
                  {row["Booking Number"]}
                </TableCell>
                <TableCell className="tableCell">
                  {row["Customer Name"]}
                </TableCell>
                <TableCell className="tableCell">
                  {row["Customer Phone"]}
                </TableCell>
                <TableCell className="tableCell">
                  <Link to={`/drivers/${row["Driver ID"]}`}>
                    {row["Driver Name"]}
                  </Link>
                </TableCell>
                <TableCell className="tableCell">
                  {row["PickUp Address"]}
                </TableCell>
                <TableCell className="tableCell">
                  {row["DropOff Address"]}
                </TableCell>
                <TableCell className="tableCell">{row.Distance}</TableCell>
                <TableCell className="tableCell">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })
                    .format(row.Amount)
                    .replace(".00", "")}
                </TableCell>
                <TableCell className="tableCell">
                  {row["Payment Method"]}
                </TableCell>
                <TableCell className="tableCell">
                  <span className={`status ${row.Status}`}>{row.Status}</span>
                </TableCell>
                <TableCell className="tableCell">{format(new Date(row["Date Created"]), "dd/MM/yyyy")}</TableCell>
              </TableRow>
            ))) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default UserTable;
