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
    useMediaQuery,
    useTheme,
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
    const theme = useTheme();
    const isXl = useMediaQuery('(min-width:1596px)');
    const isLg = useMediaQuery('(min-width:860px) and (max-width:1595px)');
    const isMd = useMediaQuery('(min-width:576px) and (max-width:860px)');
    const isSm = useMediaQuery('(max-width:575px)');

    const fetchData = async (pageIndex, pageSize) => {
        setLoading(true);
        const response = await getRecentTransactions(pageIndex, pageSize);
        console.log(response)
        setData(response.content);
        setPageCount(response.totalPages);
        setTotalRows(response.totalElements); // Total rows for pagination
        setLoading(false);
    };

    const allColumns = React.useMemo(
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
                            src={`https://www.congress.gov/img/member/${value?.toLowerCase()}_200.jpg`}
                            onError={event => {
                                event.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                event.onerror = null
                            }}
                            alt="Politician"
                            height={50} width={50} style={{ objectFit: "cover", borderRadius: '50%', margin: "auto", display: isSm||isMd?"block":""}}
                        />
                        {(isMd||isSm) &&(
                            <div style={{textAlign:"center"}}>{row.original.firstName+" "+row.original.lastName.charAt(0)+"."}</div>
                        )}
                    </div>
                    
                ),
                width: isXl ? 80 : isLg ? 60 : 60,
            },
            { Header: 'First Name', accessor: 'firstName',width: isXl ? 100 : isLg ? 60 : 60, },
            { Header: 'Last Name', accessor: 'lastName',width: isXl ? 100 : isLg ? 60 : 60, },
            { Header: 'Transaction ID', accessor: 'transactionId',width: isXl ? 100 : isLg ? 80 : 60, },
            { Header: 'Name', accessor: 'name',Cell: ({ value }) => ( <Typography sx={{fontSize:isXl ? 14 : isLg ? 14 : isMd ? 14 : 10}}>{value}</Typography>),width: isXl ? 200 : isLg ? 160 : 80, },
            { Header: 'Type', accessor: 'type',Cell: ({ value }) => ( <Typography sx={{fontSize:isXl ? 14 : isLg ? 14 : isMd ? 14 : 10}}>{value}</Typography>),width:isXl ? 50 : isLg ? 30 : 30, },
            //{ Header: 'Owner', accessor: 'owner' },
            { Header: 'Date', accessor: 'date', width: isXl ? 100 : isLg ? 60 : 60, },
            { Header: 'Asset Type', accessor: 'assetType', width: isXl ? 80 : isLg ? 60 : 40,  },
            { Header: 'Description', accessor: 'description',width: isXl ? 200 : isLg ? 160 : 120, },
            { Header: 'Amount', accessor: 'amount',Cell: ({ value }) => ( <Typography sx={{fontSize:isXl ? 14 : isLg ? 14 : isMd ? 14 : 10}}>{value}</Typography>),width: isXl ? 200 : isLg ? 100 : 50, },
        ],
        [isXl, isLg, isMd, isSm]
    );

    const columns = React.useMemo(() => {
            if (isXl) {
                return allColumns
            }
            if(isLg){
                return allColumns.filter(col =>
                    // keep only these high-priority accessors when small:
                    ["bioguideId","firstName","lastName", 'name','type','date',"amount"]
                    .includes(col.accessor)
                    );
            }
            if(isMd){
                return allColumns.filter(col =>
                    // keep only these high-priority accessors when small:
                    ["bioguideId", 'name','type','date',"amount"]
                    .includes(col.accessor)
                    );
            }
            if(isSm){
                return allColumns.filter(col =>
                    // keep only these high-priority accessors when small:
                    ["bioguideId", 'name','type',"amount"]
                    .includes(col.accessor)
                    );
            }
            return allColumns
        }, [isXl, isLg, isMd, allColumns]);
    

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
        <div className="Politicians" style={{margin:"auto",width:"100%", overflowX: "hidden"}}>
            <Paper elevation={3} sx={{ backgroundColor: "#333333",color:"#ffffff",padding: 2, marginTop: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Recent Transactions
                </Typography>
                <TableContainer sx={{color:"#ffffff"}} >
                    <Table {...getTableProps()}
                    sx={{
                           width: "100%",
                           tableLayout: "fixed",    // ← force equal column widths
                           
                         }}>
                        <TableHead>
                            {headerGroups.map(headerGroup => (
                                <TableRow {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <TableCell sx={{color:"#ffffff"}} {...column.getHeaderProps({
                                            style:{
                                                width: column.width,       // px from your column definition
                                                minWidth: column.minWidth,
                                                maxWidth: column.maxWidth,
                                                paddingInline:0
                                            }
                                        })}>
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
                                        <TableRow style={{cursor:"pointer"}}{...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <TableCell 
                                                    onClick={() => {
                                                        getPoliticianByBioGuide(row.original.bioguideId).then((res)=>{
                                                            console.log(res)
                                                            setPolitician(res)
                                                            setPage("Politicians")
                                                        })
                                                    }}
                                                    sx={{color:"#ffffff"}}  
                                                    {...cell.getCellProps({
                                                        style:{
                                                        width: cell.column.width,       // px from your column definition
                                                        minWidth: cell.column.minWidth,
                                                        maxWidth: cell.column.maxWidth,
                                                        paddingInline:0
                                                    }
                                                    })}>
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
