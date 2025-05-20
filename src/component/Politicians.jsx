import React, { useState, useEffect, useContext, useRef, useLayoutEffect, useMemo } from 'react'
import Search from './Search'
import { PageContext } from '../context/PageContext'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {  FormControlLabel, Slide, Switch, Typography, InputBase, Checkbox, Button } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Zoom from '@mui/material/Zoom';
import TabNav from './TabNav';
import InsightsIcon from '@mui/icons-material/Insights';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import { VariableSizeList } from 'react-window';
import { getStockBacktest, getStockHistory } from '../service/stockService';
import { timeParse } from "d3-time-format";
import { tsv } from "d3-request";
import { scaleTime } from "d3-scale";
import { format } from "d3-format";
import StockChart from './StockChart';
import { getTransactionsByBioguideIdAndTicker, getTransactionsByBioguideIdAndTickers } from '../service/transactionService';
import Backtest from './Backtest';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PoliticiansTable from './PoliticiansTable';

const uncheckedIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
var parseDate = timeParse("%Y-%m-%d");

const Politicians = ({send}) => {
 
  const {politician, setPolitician, reload, slide, assets, transactions,politicianStocks } = useContext(PageContext)
  
  const containerRef = React.useRef(null);
  const [direction, setDirection] = React.useState("right");
  const [value, setValue] = React.useState(0);
  const [stockHistory, setStockHistory] = useState([])
  const [backtest, setBacktest] = useState([])
  const [stockTrades, setStockTrades] = useState([])
  const [stock, setStock] = useState(null);
  const [backtestTickers, setBacktestTickers] = useState([]);
  const [backtestTrades, setBacktestTrades] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const scrollOffsetRef = React.useRef(0);

  useEffect(()=>{
    setBacktestTickers([])
    setBacktestTrades([])
    setBacktest([])
    setStockTrades([])
    setStock(null)
    setStockHistory([])
  },[politician])

  useEffect(() => {
    console.log("Component Re-rendered");
    console.log(backtestTickers)
  });
  
  useEffect(()=>{
    if(stock){
      getStockHistory(stock).then((response)=>{
        response.forEach((d, i) => {
          d.date = new Date(parseDate(d.date).getTime());
          d.adjClose = +d.adjClose;
        });
        console.log(response)
        setStockHistory(response)
        
      })
      getTransactionsByBioguideIdAndTicker(politician.bioguideId,stock).then((response)=>{
        console.log(response)
        setStockTrades(response)
      })
    }
  },[stock])

  const assetCodes = {
    "4K": "401K and Other Non-Federal Retirement Accounts",
    "5C": "529 College Savings Plan",
    "5F": "529 Portfolio",
    "5P": "529 Prepaid Tuition Plan",
    "AB": "Asset-Backed Securities",
    "BA": "Bank Accounts, Money Market Accounts and CDs",
    "BK": "Brokerage Accounts",
    "CO": "Collectibles",
    "CS": "Corporate Securities (Bonds and Notes)",
    "CT": "Cryptocurrency",
    "DB": "Defined Benefit Pension",
    "DO": "Debts Owed to the Filer",
    "DS": "Delaware Statutory Trust",
    "EF": "Exchange Traded Funds (ETF)",
    "EQ": "Excepted/Qualified Blind Trust",
    "ET": "Exchange Traded Notes",
    "FA": "Farms",
    "FE": "Foreign Exchange Position (Currency)",
    "FN": "Fixed Annuity",
    "FU": "Futures",
    "GS": "Government Securities and Agency Debt",
    "HE": "Hedge Funds & Private Equity Funds (EIF)",
    "HN": "Hedge Funds & Private Equity Funds (non-EIF)",
    "IC": "Investment Club",
    "IH": "IRA (Held in Cash)",
    "IP": "Intellectual Property & Royalties",
    "IR": "IRA",
    "MA": "Managed Accounts (e.g., SMA and UMA)",
    "MF": "Mutual Funds",
    "MO": "Mineral/Oil/Solar Energy Rights",
    "OI": "Ownership Interest (Holding Investments)",
    "OL": "Ownership Interest (Engaged in a Trade or Business)",
    "OP": "Options",
    "OT": "Other",
    "PE": "Pensions",
    "PM": "Precious Metals",
    "PS": "Stock (Not Publicly Traded)",
    "RE": "Real Estate Invest. Trust (REIT)",
    "RP": "Real Property",
    "RS": "Restricted Stock Units (RSUs)",
    "SA": "Stock Appreciation Right",
    "ST": "Stocks (including ADRs)",
    "TR": "Trust",
    "VA": "Variable Annuity",
    "VI": "Variable Insurance",
    "WU": "Whole/Universal Insurance"
  };
  
  const assetColumns = [
    { field: 'name', headerName: 'Name', width:300 },
    { field: 'description', headerName: 'Description',width:200 },
    { field: 'owner', headerName: 'Owner', width:70 },
    { field: 'value', headerName: 'Value', width:200},
    { 
      field: 'type',
      headerName: 'Type', 
      valueGetter: (value, row) => `${assetCodes[row.type]} `,
      width:150
    },
    { field: 'incomeType', headerName: 'Income Type', width:100 },
    { field: 'income', headerName: 'Income', width:200 },
    
  ];

  const transactionColumns = [
    { field: 'name', headerName: 'Name', width:300 },
    { field: 'description', headerName: 'Description',width:200 },
    { field: 'owner', headerName: 'Owner', width:70 },
    { field: 'type', headerName: 'Sell/Purchase', width:70 },
    { field: 'date', headerName: 'Date', width:200},
    { 
      field: 'assetType',
      headerName: 'Type', 
      valueGetter: (value, row) => `${assetCodes[row.assetType]} `,
      width:150
    },
    { field: 'amount', headerName: 'Amount', width:200 },
    
  ];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  
  const paginationModel = { page: 0, pageSize: 5 };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#333333',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

  const StyledInput = styled(InputBase)(({ theme }) => ({
    padding: 10,
    width: '100%',
    borderBottom: `1px solid ${'#30363d'}`,
    '& input': {
      borderRadius: 4,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      border: `1px solid ${'#30363d'}`,
      padding: 8,
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      fontSize: 14,
      '&:focus': {
        boxShadow: `0px 0px 0px 3px ${'rgba(3, 102, 214, 0.3)'}`,
        borderColor: '#0366d6',
        ...theme.applyStyles('dark', {
          boxShadow: `0px 0px 0px 3px ${'rgb(12, 45, 107)'}`,
          borderColor: '#388bfd',
        }),
      },
      ...theme.applyStyles('dark', {
        backgroundColor: '#0d1117',
        border: `1px solid ${'#eaecef'}`,
      }),
    },
    ...theme.applyStyles('dark', {
      borderBottom: `1px solid ${'#eaecef'}`,
    }),
  }));
  const LISTBOX_PADDING = 8; // px

  function renderRow(props) {
    const { data, index, style } = props;
    const option = data[index][1];
    const matches = data[index][2]
    const parts = data[index][3]
    const selected = data[index][4]
    //console.log(data[index])
    const inlineStyle = {
      ...style,
      top: style.top + LISTBOX_PADDING,
    };
  
  
    const { key, ...optionProps } = data[index][0];
  
    return (
      <div component="li" {...optionProps}  style={{display:"flex", backgroundColor:"#262626", alignItems:"center", borderBottom: "1px solid #eaecef",...inlineStyle}}>
        {selected!=null &&(
          <Checkbox
            icon={uncheckedIcon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
            onClick={(e) => e.stopPropagation()} 
          />
        )}
        {option!="All" && (
          <img 
            height={36} 
            width={36} 
            style={{objectFit:"cover"}} 
            src={"https://raw.githubusercontent.com/davidepalazzo/ticker-logos/refs/heads/main/ticker_icons/"+ option+".png"}
            onError={(e) => {
              e.target.src = ""; 
            }}
          ></img>
        )}
        
        <div style={{paddingLeft:"1vw"}}>
          <Typography sx={{margin:0,}} color='#fff'    >
              <div>
                {parts.map((part, index) => (
                  <span
                    style={{
                      fontWeight: part.highlight ? 700 : 400,
                      color: part.highlight ? "#8C837B" : '#fff'
                    }}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            
          </Typography>
        </div>
        
      </div>
      
    );
  }
  
  const OuterElementContext = React.createContext({});
  
  const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
  });
  
  function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (ref.current != null) {
        ref.current.resetAfterIndex(0, true);
      }
    }, [data]);
    return ref;
  }
  
  // Adapter for react-window
  const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = [];
    children.forEach((item) => {
      itemData.push(item);
      itemData.push(...(item.children || []));
    });
  
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
      noSsr: true,
    });
    const itemCount = itemData.length;
    const itemSize = smUp ? 72 : 72;
  
    const getChildSize = (child) => {
      if (child.hasOwnProperty('group')) {
        return 48;
      }
  
      return itemSize;
    };
  
    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize;
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };
  
    const gridRef = useResetCache(itemCount);
    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            style={{backgroundColor:"#262626", scrollbarColor:"#333333"}}
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={(index) => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}
            onScroll={(props)=>{
              scrollOffsetRef.current = props.scrollOffset
            }}
            initialScrollOffset={scrollOffsetRef.current}
            
            
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  });
  
  ListboxComponent.propTypes = {
    children: PropTypes.node,
  };
  


  const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
      boxSizing: 'border-box',
      padding: 0,
      margin: 0,
      '& ul': {
        padding: 0,
        margin: 0,
      },
    },
  });
      const icon = (
        <Paper sx={{ m: 1, width: 100, height: 100 }} elevation={4}>
          <svg>
            <Box
              component="polygon"
              points="0,100 50,00, 100,100"
              sx={(theme) => ({
                fill: theme.palette.common.white,
                stroke: theme.palette.divider,
                strokeWidth: 1,
              })}
            />
          </svg>
        </Paper>
      );
  return (
    <div className="Politicians" style={{marginTop:"10em",margin:"auto",width:"80vw"}}>
      {!politician && (
        <div>
          <div style={{paddingTop:"100px",margin:"auto", width:"33vw", minWidth:200}}>
            <Search type={"politiciansTable"}/>
          </div>
          <PoliticiansTable/>
        </div>
        
      )}
      {politician && (
               
        <div style={{paddingTop:"100px",margin:"auto",}}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <Zoom in={reload}>
                <Item>
                <img style={{objectFit:"cover", borderRadius:"50%",border:"1px solid #304040", boxShadow: "0px 0px 0px 3px #304040"}} src={"https://www.congress.gov/img/member/"+ politician.bioguideId.toLowerCase()+"_200.jpg"}></img>
                <Typography sx={{paddingY:"2vh"}} variant='h4' color='#BFB6AE'>
                  {politician.firstName + " " + politician.lastName}
                </Typography>
                <Typography  variant='h7' color='#BFB6AE'>
                  Party: {politician.party}
                </Typography>
                <br></br>
                <Typography  variant='h7' color='#BFB6AE'>
                  State: {politician.state}
                </Typography>
                </Item>
              </Zoom>
              
            </Grid>
            {/* <Grid size={8}>
              <Zoom in={reload}>
                <Item>size=8</Item>
              </Zoom>
            </Grid> */}
            <Grid size={12}>
              <Zoom in={reload}>
                <Item>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs variant='fullWidth'centered sx={{  backgroundColor:"#304040"}} value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab sx={{color:'#BFB6AE'}} icon={<AccountBalanceIcon />} label="Assets" {...a11yProps(0)} />
                        <Tab sx={{color:'#BFB6AE'}} icon={<PointOfSaleIcon />} label="Transactions" {...a11yProps(1)} />
                        <Tab sx={{color:'#BFB6AE'}} icon={<InsightsIcon />} label="Trades" {...a11yProps(2)} />
                        <Tab sx={{color:'#BFB6AE'}} icon={<InsightsIcon />} label="Backtest" {...a11yProps(3)} />
                      </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                    <Paper sx={{ backgroundColor: '#304040'  }}>
                      <DataGrid
                        rows={assets}
                        columns={assetColumns}
                        getRowId={(row) => row.assetId}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5]}
                        sx={{
                          border: 0,
                          backgroundColor: "#304040", // Row background
                          color: "#fff", // Text color for rows
                          '& .MuiDataGrid-columnHeader': {
                            backgroundColor: "#3d5151", // Header background
                            color: "#fff", // Header text color
                          },
                          '& .MuiDataGrid-filler': {
                            backgroundColor: "#3d5151", // Header background
                            color: "#fff", // Header text color
                          },
                          '& .MuiButtonBase-root': {
                            color: "#fff", // Footer text color
                          },
                          '& .MuiDataGrid-virtualScrollerRenderZone': {
                            backgroundColor: "#304040", // Header background
                            color: "#fff", // Header text color
                          },
                          '& .MuiDataGrid-footerContainer': {
                            backgroundColor: "#304040", // Footer background
                            color: "#fff", // Footer text color
                          },
                          '& .MuiTablePagination-displayedRows': {
                            backgroundColor: "#304040", // Footer background
                            color: "#fff", // Footer text color
                          },
                          '& .MuiTablePagination-actions': {
                            backgroundColor: "#304040", // Footer background
                            color: "#fff", // Footer text color
                          },
                          '& .MuiTablePagination-toolbar': {
                            backgroundColor: "#304040", // Footer background
                            color: "#fff", // Footer text color
                          },
                          '& .MuiSvgIcon-root': {
                            color: "#fff", // Footer text color
                          },
                        }}
                      />
                    </Paper>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                    <Paper sx={{ backgroundColor: '#304040'  }}>
                      <DataGrid
                        rows={transactions}
                        columns={transactionColumns}
                        getRowId={(row) => row.transactionId}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5,10,100]}
                        sx={{
                          border: 0,
                          backgroundColor: "#304040", // Row background
                          color: "#fff", // Text color for rows
                          '& .MuiDataGrid-columnHeader': {
                            backgroundColor: "#3d5151", // Header background
                            color: "#fff", // Header text color
                          },
                          '& .MuiDataGrid-filler': {
                            backgroundColor: "#3d5151", // Header background
                            color: "#fff", // Header text color
                          },
                          '& .MuiButtonBase-root': {
                            color: "#fff", // Footer text color
                          },
                          '& .MuiDataGrid-virtualScrollerRenderZone': {
                            backgroundColor: "#304040", // Header background
                            color: "#fff", // Header text color
                          },
                          '& .MuiDataGrid-footerContainer': {
                            backgroundColor: "#304040", // Footer background
                            color: "#fff", // Footer text color
                          },
                          '& .MuiTablePagination-displayedRows': {
                            backgroundColor: "#304040", // Footer background
                            color: "#fff", // Footer text color
                          },
                          '& .MuiTablePagination-actions': {
                            backgroundColor: "#304040", // Footer background
                            color: "#fff", // Footer text color
                          },
                          '& .MuiTablePagination-toolbar': {
                            backgroundColor: "#304040", // Footer background
                            color: "#fff", // Footer text color
                          },
                          '& .MuiSvgIcon-root': {
                            color: "#fff", // Footer text color
                          },
                        }}
                      />
                    </Paper>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                    <Autocomplete
                      disableListWrap
                      options={politicianStocks}
                      autoHighlight
                      value={stock}
                            onChange={(event, newValue, reason) => {
                              if (
                                event.type === 'keydown' &&
                                (event.key === 'Backspace' || event.key === 'Delete') &&
                                reason === 'removeOption'
                              ) {
                                return;
                              }
                              setStock(newValue);
                            }}

                      sx={{ paddingLeft: "3em" ,}}
                      renderOption={(props, option, { inputValue }) => {
                        const { key, ...optionProps } = props;
                        const matches = match(option, inputValue, { insideWords: true });
                        const parts = parse(option, matches);
                        return [props,option,matches,parts]
                      }}
                      //renderOption={(props, option) => [props, option]}
                      renderInput={(params) => (
                        <StyledInput
                          ref={params.InputProps.ref}
                          inputProps={params.inputProps}
                          autoFocus
                          placeholder="Search"
                          startAdornment={<SearchIcon sx={{paddingRight:"1vw"}}/>}
                        />
                      )}
                      slots={{
                        popper: StyledPopper,
                      }}
                      slotProps={{
                        listbox: {
                          component: ListboxComponent,
                        },
                      }}
                    />
                    
                    {stockHistory && stockHistory.length>0 &&(
                      <StockChart data={stockHistory} stockName={stock} transactions={stockTrades} startHeight={250} efficientOrPretty={false}/>
                    )}
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                      <div style={{display:"flex", width:"100%"}}>
                        <Autocomplete
                          style={{width:"100%"}}
                          options={ ["All", ...politicianStocks]}
                          multiple
                          clearOnBlur={false}
                          disableCloseOnSelect = {true}
                          value = {backtestTickers}
                          //onFocus={}
                          onChange={(event, newValue, reason) => {
                            console.log(reason)
                            console.log(event)
                            if (
                              event.type === 'keydown' &&
                              (event.key === 'Backspace' || event.key === 'Delete') &&
                              reason === 'removeOption'
                            ) {
                              return;
                            }
                            console.log(newValue)
                            if (newValue.includes("All")) {
                              
                              if(reason == 'removeOption'){
                                setBacktestTickers(newValue.filter((option) => option !== "All"));
                              }
                              else{
                                setBacktestTickers(["All", ...politicianStocks]);
                              }
                            } else {
                              if(backtestTickers.includes("All")){
                                setBacktestTickers([])
                              }
                              // If "All" is not selected and all other options are selected, add "All"
                              else if (newValue.length === politicianStocks.length) {
                                setBacktestTickers(["All", ...politicianStocks]);
                                console.log(newValue.length === politicianStocks.length - 1)
                              } else {
                                setBacktestTickers(newValue);
                              }
                            }
                            //setBacktestTickers([...newValue]);
                          }}

                          sx={{ paddingLeft: "3em" ,}}
                          renderOption={(props, option, { inputValue, selected }) => {
                            const { key, ...optionProps } = props;
                            const matches = match(option, inputValue, { insideWords: true });
                            const parts = parse(option, matches);
                            return [props,option,matches,parts,selected]
                          }}
                          //renderOption={(props, option) => [props, option]}
                          renderInput={(params) => (
                            <StyledInput
                              ref={params.InputProps.ref}
                              inputProps={params.inputProps}
                              autoFocus={open}
                              open={open}
                              onFocus={() => setOpen(true)}
                              onBlur={() => setOpen(false)}
                              placeholder="Search"
                              startAdornment={<SearchIcon sx={{paddingRight:"1vw"}}/>}
                            />
                          )}
                          slots={{
                            popper: StyledPopper,
                          }}
                          slotProps={{
                            listbox: {
                              component: ListboxComponent,
                            },
                          }}
                          openOnFocus
                          // onOpen={() => setOpen(true)}
                          // onClose={(event, reason) => {
                          //   if (reason !== 'select-option') {
                          //     setOpen(false);
                          //   }
                          // }}
                        />
                        <Button
                        color='success'
                        variant='contained'
                        sx={{height:"4vh",marginY:"auto"}}
                        disabled={open}
                        loading={loading}
                        loadingPosition="end"
                        onClick={()=>{
                          setLoading(true)
                          getTransactionsByBioguideIdAndTickers(politician.bioguideId,backtestTickers.filter((option) => option !== "All")).then((response)=>{
                            console.log(response)
                            setBacktestTrades(response)
                          })
                          getStockBacktest(politician.bioguideId,backtestTickers.filter((option) => option !== "All")).then((response)=>{
                            response.forEach((d, i) => {
                              d.date = new Date(parseDate(d.date).getTime());
                              d.total = +d.total;
                              d.cash = +d.cash;
                            });
                            setBacktest(response)
                            setLoading(false)
                          })
                        }}
                        >Go</Button>
                      </div>
                      
                      
                      {backtest && backtest.length>0 &&(
                        <Backtest portfolio={backtest} stockName={stock} transactions={backtestTrades} startHeight={250} efficientOrPretty={false}/>
                      )}
                    </CustomTabPanel>
                  </Box>
                  
                </Item>
              </Zoom>
              
            </Grid>
            {/* <Grid size={4}>
            <Zoom in={reload}>
              <Item>size=4</Item>
            </Zoom>
              
            </Grid>
            <Grid size={8}>
              <Zoom in={reload}>
                <Item>size=8</Item>
              </Zoom>
            </Grid> */}
          </Grid> 
          
          
        </div>
      )}
      
    </div>
  )
}

export default Politicians