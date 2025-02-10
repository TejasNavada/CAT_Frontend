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
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { getPoliticiansBacktest } from '../service/politicianService';
import { PageContext } from '../context/PageContext';

const PoliticiansTable = () => {
    const {politician, setPolitician } = useContext(PageContext)
    const [data, setData] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [selectedBacktestPeriod, setSelectedBacktestPeriod] = useState('backtestAllTime'); // Track selected backtest period


    const fetchData = async (pageIndex, pageSize, period) => {
        setLoading(true);
        const response = await getPoliticiansBacktest(pageIndex, pageSize, period);
        console.log(response);
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
                        setPolitician(row.original)
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
            { Header: 'Party', accessor: 'party' },
            { Header: 'State', accessor: 'state' },
            { Header: 'Congress', accessor: 'congresses' },
            { 
                Header: (
                    <>
                        One Month <TrendingUpIcon sx={{ fontSize: 16, verticalAlign: 'middle', marginLeft: 1, color:"#b18fcf"}} />
                    </>
                ),
                accessor: 'backtestOneMonth',
                Cell: ({ value }) => (
                    <Typography color={value > 0 ? '#00ff00' : value < 0 ? '#ff0000' : '#ffffff'}>
                        {value !== null && value != null ? `${(value * 100).toFixed(2)}%` : ''}
                    </Typography>
                    
                ),
            },
            { 
                Header: (
                    <>
                        Six Months <TrendingUpIcon sx={{ fontSize: 16, verticalAlign: 'middle', marginLeft: 1, color:"#b18fcf"}} />
                    </>
                ),
                accessor: 'backtestSixMonth',
                Cell: ({ value }) => (
                    <Typography color={value > 0 ? '#00ff00' : value < 0 ? '#ff0000' : '#ffffff'}>
                        {value !== null && value !== undefined ? `${(value * 100).toFixed(2)}%` : ''}
                    </Typography>
                ),
            },
            { 
                Header: (
                    <>
                        One Year <TrendingUpIcon sx={{ fontSize: 16, verticalAlign: 'middle', marginLeft: 1, color:"#b18fcf"}} />
                    </>
                ),
                accessor: 'backtestOneYear',
                Cell: ({ value }) => (
                    <Typography color={value > 0 ? '#00ff00' : value < 0 ? '#ff0000' : '#ffffff'}>
                        {value !== null && value !== undefined ? `${(value * 100).toFixed(2)}%` : ''}
                    </Typography>
                ),
            },
            { 
                Header: (
                    <>
                        Five Years <TrendingUpIcon sx={{ fontSize: 16, verticalAlign: 'middle', marginLeft: 1, color:"#b18fcf"}} />
                    </>
                ),
                accessor: 'backtestFiveYear',
                Cell: ({ value }) => (
                    <Typography color={value > 0 ? '#00ff00' : value < 0 ? '#ff0000' : '#ffffff'}>
                        {value !== null && value !== undefined ? `${(value * 100).toFixed(2)}%` : ''}
                    </Typography>
                ), 
            
            },
            { 
                Header: (
                    <>
                        All Time <TrendingUpIcon sx={{ fontSize: 16, verticalAlign: 'middle', marginLeft: 1, color:"#b18fcf"}} />
                    </>
                ),
                accessor: 'backtestAllTime',
                Cell: ({ value }) => (
                    <Typography color={value > 0 ? '#00ff00' : value < 0 ? '#ff0000' : '#ffffff'}>
                        {value !== null && value !== undefined ? `${(value * 100).toFixed(2)}%` : ''}
                    </Typography>
                ),
            },
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
        fetchData(newPage, pageSize, selectedBacktestPeriod); // Fetch new data
    };

    const handleRowsPerPageChange = event => {
        const newPageSize = Number(event.target.value);
        setPageSize(newPageSize); // Update react-table's state
        gotoPage(0); // Reset to the first page
        fetchData(0, newPageSize, selectedBacktestPeriod); // Fetch new data for the updated page size
    };
    const handleBacktestPeriodChange = (event) => {
        setSelectedBacktestPeriod(event.target.value); // Update selected period
        fetchData(pageIndex, pageSize, event.target.value); // Fetch data for the selected period
    };

    return (
        <div className="Politicians" style={{margin:"auto",width:"75vw"}}>
            <Paper elevation={3} sx={{ backgroundColor: "#333333",color:"#ffffff",padding: 2, marginTop: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Politicians
                </Typography>
                <TableContainer sx={{color:"#ffffff"}}>
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
                                                <TableCell sx={{color:"#ffffff"}}{...cell.getCellProps()}>
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
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: 16 }}>
                    <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
                        <InputLabel id="backtest-period-label" sx={{ color: "#ffffff" }}>Backtest Period</InputLabel>
                        <Select
                            labelId="backtest-period-label"
                            id="backtest-period"
                            value={selectedBacktestPeriod}
                            onChange={handleBacktestPeriodChange}
                            label="Backtest Period"
                            sx={{ color: "#ffffff", borderColor: "#b18fcf", backgroundColor: "#333333", '& .MuiOutlinedInput-notchedOutline': { borderColor: '#b18fcf' } }}
                        >
                            <MenuItem value="backtestOneMonth">One Month</MenuItem>
                            <MenuItem value="backtestSixMonth">Six Months</MenuItem>
                            <MenuItem value="backtestOneYear">One Year</MenuItem>
                            <MenuItem value="backtestFiveYear">Five Years</MenuItem>
                            <MenuItem value="backtestAllTime">All Time</MenuItem>
                        </Select>
                    </FormControl>

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

                </div>
                {/* Dropdown for selecting backtest period */}
                
            </Paper>
        </div>
        
    );
};

export default PoliticiansTable;
