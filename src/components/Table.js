import { useTable, useSortBy } from "react-table";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export default function RTable(props) {
//   const data = React.useMemo(
//     () => [
//       {
//         col1: "Hello",
//         col2: "World",
//         col3: "Hello",
//       },
//       {
//         col1: "react-table",
//         col2: "rocks",
//         col3: "Hello",
//       },
//       {
//         col1: "whatever",
//         col2: "you want",
//         col3: "Hello",
//       },
//     ],
//     []
//   );
    const data = props.data;

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Column 1",
//         accessor: "col1", // accessor is the "key" in the data
//       },
//       {
//         Header: "Column 2",
//         accessor: "col2",
//       },
//       {
//         Header: "Column 3",
//         accessor: "col3",
//       },
//     ],
//     []
//   );

    const columns = props.columns;

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <Table className="table table-stripped " {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableCell {...column.getHeaderProps( column.getSortByToggleProps() )}>
                {column.render("Header")}
                <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
