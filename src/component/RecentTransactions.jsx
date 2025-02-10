import React, { useState, useEffect, useContext } from 'react';
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
import { getPoliticianByBioGuide } from '../service/politicianService'
import { PageContext } from '../context/PageContext';

const RecentTransactions = () => {
    const {setPolitician, setPage} = useContext(PageContext)
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
                Cell: ({ value, row }) => (
                    <div style={{ minHeight: 50 }} onClick={() => {
                        console.log(row)
                        getPoliticianByBioGuide(row.original.bioguideId).then((res)=>{
                            console.log(res)
                            setPolitician(res)
                            setPage("Politicians")
                        })
                        //setPolitician(row.original)
                    }}>
                        <img
                            src={`https://www.congress.gov/img/member/${value.toLowerCase()}_200.jpg`}
                            onError={event => {
                                event.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                event.onerror = null
                            }}
                            alt="Politician"
                            height={50} width={50} style={{ objectFit: "cover", borderRadius: '50%' }}
                        />
                    </div>
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
            <Paper elevation={3} sx={{ backgroundColor: "#333333",color:"#ffffff",padding: 2, marginTop: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Recent Transactions
                </Typography>
                <TableContainer sx={{color:"#ffffff"}} >
                    <Table {...getTableProps()}>
                        <TableHead>
                            {headerGroups.map(headerGroup => (
                                <TableRow {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <TableCell sx={{color:"#ffffff"}} {...column.getHeaderProps()}>
                                            {column.render('Header')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody {...getTableBodyProps()}>
                            {loading ? (
                                <TableRow>
                                    <TableCell sx={{color:"#ffffff"}} colSpan={columns.length} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                page.map(row => {
                                    prepareRow(row);
                                    return (
                                        <TableRow {...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <TableCell sx={{color:"#ffffff"}}  {...cell.getCellProps()}>
                                                    {cell.render('Cell')}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })
                            )}
                            {!loading && page.length === 0 && (
                                <TableRow>
                                    <TableCell sx={{color:"#ffffff"}} colSpan={columns.length} align="center">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination 
                    sx={{color:"#ffffff"}}
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
