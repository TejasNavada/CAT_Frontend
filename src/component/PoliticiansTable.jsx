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
    useTheme,
    useMediaQuery,
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
    const theme = useTheme();
    const isXl = useMediaQuery('(min-width:1596px)');
    const isLg = useMediaQuery('(min-width:772px) and (max-width:1595px)');
    const isMd = useMediaQuery('(min-width:576px) and (max-width:771px)');
    const isSm = useMediaQuery('(max-width:575px)');
    console.log(isXl,isLg,isMd,isSm)


    const fetchData = async (pageIndex, pageSize, period) => {
        setLoading(true);
        const response = await getPoliticiansBacktest(pageIndex, pageSize, period);
        console.log(response);
        setData(response.content);
        setPageCount(response.totalPages);
        setTotalRows(response.totalElements); // Total rows for pagination
        setLoading(false);
    };

    const allColumns  = React.useMemo(
        () => [
            {
                Header: 'Politician',
                accessor: 'bioguideId',
                Cell: ({ value, row }) => (
                    <div style={{ minHeight: 50, cursor: 'pointer',  }} onClick={() => {
                        setPolitician(row.original)
                    }}>
                        <img
                            src={`https://www.congress.gov/img/member/${value.toLowerCase()}_200.jpg`}
                            
                            onError={event => {
                                event.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                event.onerror = null
                            }}
                            alt="Politician"
                            height={50} width={50} style={{ objectFit: "cover", borderRadius: '50%', margin: "auto", display: isSm?"block":""}}
                        />
                        {isSm &&(
                            <div style={{textAlign:"center"}}>{row.original.firstName+" "+row.original.lastName.charAt(0)+"."}</div>
                        )}
                    </div>
                ),
                width: isXl ? 80 : isLg ? 60 : 60,
            },
            { Header: 'First Name', accessor: 'firstName',width: isXl ? 100 : isLg ? 80 : 60, },
            { Header: 'Last Name', accessor: 'lastName',width: isXl ? 100 : isLg ? 80 : 60, },
            { Header: 'Party', accessor: 'party',width: isXl ? 100 : isLg ? 80 : 60, },
            { Header: 'State', accessor: 'state',width: isXl ? 100 : isLg ? 80 : 60, },
            { Header: 'Congress', accessor: 'congresses' ,width: isXl ? 100 : isLg ? 80 : 60,},
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
                width: isXl ? 120 : isLg ? 100 : 80,
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
                width: isXl ? 120 : isLg ? 100 : 80,
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
                width: isXl ? 120 : isLg ? 100 : 80,
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
                width: isXl ? 120 : isLg ? 100 : 80,
            
            },
            { 
                Header: (
                    <>
                        All Time <TrendingUpIcon sx={{ fontSize: 16, verticalAlign: 'middle', marginLeft: 1, color:"#b18fcf"}} />
                    </>
                ),
                accessor: 'backtestAllTime',
                Cell: ({ value }) => (
                    <Typography color={value > 0 ? '#00ff00' : value < 0 ? '#ff0000' : '#ffffff'}
                    sx={{
                            fontSize:isXl ? 16 : isLg ? 16 : isMd ? 16 : 10
                        }}
                    >
                        {value !== null && value !== undefined ? `${(value * 100).toFixed(2)}%` : ''}
                    </Typography>
                ),
                width: isXl ? 120 : isLg ? 100 : isMd ? 80 : 60,
            },
            { 
                Header: (
                    <>
                         Portfolio Value ($)
                    </>
                ),
                accessor: 'backtestTotal',
                Cell: ({ value }) => {
                    if (value == null) return '';
                    // full 2-decimals:
                    const full = `$${value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`;
                    // compact, single decimal, e.g. "1.4M", "36.5K"
                    const compact = `$${new Intl.NumberFormat(undefined, {
                        notation: 'compact',
                        maximumFractionDigits: 2
                    }).format(value)}`;

                    // pick based on width:
                    const text = isSm ? compact 
                                : isMd ? compact   // small screens: compact
                                : isLg ? compact   // medium: still compact
                                : full;            // large: full

                    return (
                        <Typography
                        sx={{
                            fontSize:isXl ? 16 : isLg ? 16 : isMd ? 16 : 10
                        }}
                        noWrap
                        color={value >= 0 ? '#00ff00' : '#ff0000'}
                        >
                        {text}
                        </Typography>
                    );
                    },

                width: isXl ? 200 : isLg ? 150 : isMd ? 120 : 80,
            },
        ],[isXl, isLg, isMd, isSm]);

    const columns = React.useMemo(() => {
        if (isXl) {
            return allColumns
        }
        if(isLg){
            return allColumns.filter(col =>
                // keep only these high-priority accessors when small:
                ["bioguideId","firstName","lastName", 'backtestOneMonth','backtestOneYear','backtestAllTime',"backtestTotal"]
                .includes(col.accessor)
                );
        }
        if(isMd){
            return allColumns.filter(col =>
                // keep only these high-priority accessors when small:
                ["bioguideId","firstName","lastName",'backtestAllTime',"backtestTotal"]
                .includes(col.accessor)
                );
        }
        if(isSm){
            return allColumns.filter(col =>
                // keep only these high-priority accessors when small:
                ["bioguideId",'backtestAllTime',"backtestTotal"]
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
        <div className="Politicians" style={{margin:"auto",width:"100%", overflowX: "hidden"}}>
            <Paper elevation={3} sx={{ backgroundColor: "#333333",color:"#ffffff",padding: 2, marginTop: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Politicians
                </Typography>
                <TableContainer sx={{color:"#ffffff", maxWidth: "100%"}}>
                    <Table 
                        {...getTableProps()}
                        sx={{
                           width: "100%",
                           tableLayout: "fixed",    // ← force equal column widths
                           
                         }}
                        >
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
                                    <TableCell colSpan={columns.length} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                page.map(row => {
                                    prepareRow(row);
                                    console.log(row)
                                    return (
                                        <TableRow  style={{cursor:"pointer"}}{...row.getRowProps()}>
                                            {row.cells.map(cell => (
                                                <TableCell 
                                                onClick={() =>setPolitician(row.original)}
                                                sx={{
                                                    color:"#ffffff",
                                                    px:  0,    // 16px, 8px, 4px horizontal padding
                                                    //whiteSpace: 'nowrap',
                                                    //overflow: 'wrap',
                                                    //textOverflow: 'ellipsis',
                                                }}
                                                {...cell.getCellProps({
                                                    style:{
                                                        width: cell.column.width,       // px from your column definition
                                                        minWidth: cell.column.minWidth,
                                                        maxWidth: cell.column.maxWidth,
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
                            <MenuItem value="backtestTotal">Value ($)</MenuItem>
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
