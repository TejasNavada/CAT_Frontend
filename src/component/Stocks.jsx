import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react'
import Search from './Search'
import { PageContext } from '../context/PageContext'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {  FormControlLabel, Slide, Switch, Typography, InputBase } from '@mui/material';
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
import { getStockHistory, getStocksTraded } from '../service/stockService';
import { timeParse } from "d3-time-format";
import { tsv } from "d3-request";
import { scaleTime } from "d3-scale";
import { format } from "d3-format";
import StockChart from './StockChart';
import { getTransactionsByBioguideIdAndTicker, getTransactionsByTicker } from '../service/transactionService';


var parseDate = timeParse("%Y-%m-%d");

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
    //console.log(data[index])
    const inlineStyle = {
      ...style,
      top: style.top + LISTBOX_PADDING,
    };
  
  
    const { key, ...optionProps } = data[index][0];
  
    return (
      <div component="li" {...optionProps}  style={{display:"flex", backgroundColor:"#262626", alignItems:"center", borderBottom: "1px solid #eaecef",...inlineStyle}}>
        <img 
          height={36} 
          width={36} 
          style={{objectFit:"cover"}} 
          src={"https://raw.githubusercontent.com/davidepalazzo/ticker-logos/refs/heads/main/ticker_icons/"+ option+".png"}
          onError={(e) => {
            e.target.src = ""; 
          }}
          ></img>
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


const Stocks = ({  }) => {
    const {politician, setPolitician, reload, slide, assets, transactions,stocks } = useContext(PageContext)
    
    const containerRef = React.useRef(null);
    const [direction, setDirection] = React.useState("right");
    const [value, setValue] = React.useState(0);
    const [stockHistory, setStockHistory] = useState([])
    const [stockTrades, setStockTrades] = useState([])
    const [stock, setStock] = useState(null);

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
            getTransactionsByTicker(stock).then((response)=>{
            console.log(response)
            setStockTrades(response)
            })
        }
    },[stock])
  return (
    <div className="Stocks" style={{marginTop:"10em",margin:"auto",width:"75vw"}}>
        <div style={{paddingTop:"100px",marginTop:"10em",margin:"auto",width:"33vw"}}>
            <Autocomplete
                disableListWrap
                options={stocks}
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
        </div>
        

        {stockHistory && stockHistory.length>0 &&(
            <StockChart data={stockHistory} stockName={stock} transactions={stockTrades}startHeight={250} efficientOrPretty={false}/>
        )}
    </div>
  );
};

export default Stocks;