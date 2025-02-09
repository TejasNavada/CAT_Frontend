import React, { useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    CircularProgress,
    Typography,
} from '@mui/material';
import { getRecentTransactions } from '../service/transactionService';

const RecentTransactions = () => {
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);

    const fetchData = async (pageIndex, pageSize) => {
        setLoading(true);
        const response = await getRecentTransactions(pageIndex, pageSize);
        console.log(response)
        setData(response.content);
        setPageCount(response.totalPages);
        setTotalRows(response.totalElements); // Total rows for pagination
        setLoading(false);
    };

    const columns = React.useMemo(
        () => [
            {
                Header: 'Politician',
                accessor: 'bioguideId',
                Cell: ({ value }) => (
                    <img
                        src={`https://www.congress.gov/img/member/${value.toLowerCase()}_200.jpg`}
                        alt="Politician"
                        height={50} width={50} style={{objectFit:"cover", borderRadius: '50%'}}
                    />
                ),
            },
            { Header: 'First Name', accessor: 'firstName' },
            { Header: 'Last Name', accessor: 'lastName' },
            { Header: 'Transaction ID', accessor: 'transactionId' },
            { Header: 'Name', accessor: 'name' },
            { Header: 'Type', accessor: 'type' },
            //{ Header: 'Owner', accessor: 'owner' },
            { Header: 'Date', accessor: 'date' },
            { Header: 'Asset Type', accessor: 'assetType' },
            { Header: 'Description', accessor: 'description' },
            { Header: 'Amount', accessor: 'amount' },
        ],
        []
    );
    

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        state: { pageIndex, pageSize },
        setPageSize,
        gotoPage,
    } = useTable(
        {
            columns,
            data,
            manualPagination: true,
            pageCount,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        usePagination
    );

    // Fetch data when pageIndex or pageSize changes
    useEffect(() => {
        fetchData(pageIndex, pageSize);
    }, [pageIndex, pageSize]);

    const handlePageChange = (event, newPage) => {
        gotoPage(newPage); // Update react-table's state
        fetchData(newPage, pageSize); // Fetch new data
    };

    const handleRowsPerPageChange = event => {
        const newPageSize = Number(event.target.value);
        setPageSize(newPageSize); // Update react-table's state
        gotoPage(0); // Reset to the first page
        fetchData(0, newPageSize); // Fetch new data for the updated page size
    };

    return (
        <div className="Politicians" style={{margin:"auto",width:"75vw"}}>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Recent Transactions
                </Typography>
                <TableContainer>
                    <Table {...getTableProps()}>
                        <TableHead>
                            {headerGroups.map(headerGroup => (
                                <TableRow {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <TableCell {...column.getHeaderProps()}>
                                            {column.render('Header')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody {...getTableBodyProps()}>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                page.map(row => {
                                    prepareRow(row);
                                    return (
                                        <TableRow {...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <TableCell {...cell.getCellProps()}>
                                                    {cell.render('Cell')}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })
                            )}
                            {!loading && page.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                    rowsPerPageOptions={[10, 20, 30, 50]}
                    component="div"
                    count={totalRows} // Total number of rows
                    rowsPerPage={pageSize}
                    page={pageIndex}
                    onPageChange={handlePageChange} // Custom handler
                    onRowsPerPageChange={handleRowsPerPageChange} // Custom handler
                />
            </Paper>
        </div>
        
    );
};

export default RecentTransactions;
