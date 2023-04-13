import * as React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import { Colors } from "../constants/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: Colors.blue700
    }
  },
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "white",
    borderStyle: "solid"
  }
});

// export function ShowTableUser({ currentPosts, searchTerm }) {
//   let navigate = useNavigate();
//   const classes = useStyles();
//   return (
//     <TableContainer component={Paper} sx={{ width: "100%" }}>
//       <Table aria-label="simple table">
//         <TableHead className={classes.root}>
//           <TableRow>
//             <TableCell
//               sx={{ fontWeight: "bold" }}
//               className={classes.tableRightBorder}
//             >
//               Username
//             </TableCell>
//             <TableCell
//               sx={{ fontWeight: "bold" }}
//               className={classes.tableRightBorder}
//             >
//               Tipe User
//             </TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Cabang</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {currentPosts
//             .filter((val) => {
//               if (searchTerm === "") {
//                 return val;
//               } else if (
//                 val.username.toUpperCase().includes(searchTerm.toUpperCase()) ||
//                 val.tipeUser.toUpperCase().includes(searchTerm.toUpperCase()) ||
//                 val.cabang.id
//                   .toUpperCase()
//                   .includes(searchTerm.toUpperCase()) ||
//                 val.cabang.namaCabang
//                   .toUpperCase()
//                   .includes(searchTerm.toUpperCase())
//               ) {
//                 return val;
//               }
//             })
//             .map((user, index) => (
//               <TableRow
//                 key={user.id}
//                 sx={{
//                   "&:last-child td, &:last-child th": { border: 0 },
//                   "&:hover": { bgcolor: Colors.grey300 },
//                   cursor: "pointer"
//                 }}
//                 onClick={() => {
//                   navigate(`/daftarUser/${user.id}`);
//                 }}
//               >
//                 <TableCell component="th" scope="row">
//                   {user.username}
//                 </TableCell>
//                 <TableCell>{user.tipeUser}</TableCell>
//                 <TableCell>
//                   {user.cabang.id} - {user.cabang.namaCabang}
//                 </TableCell>
//               </TableRow>
//             ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }
