
import { useState, useEffect, useContext} from 'react';
import * as React from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Button, AppBar, Box, Toolbar, IconButton, Typography, InputBase } from '@mui/material';
import PropTypes from 'prop-types';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import { VariableSizeList } from 'react-window';
import { getPoliticians } from '../service/politicianService';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import SearchIcon from '@mui/icons-material/Search';
import { PageContext } from '../context/PageContext';
const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  flexGrow: 1,
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: '5%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
    //console.log(data[index])
    const inlineStyle = {
      ...style,
      top: style.top + LISTBOX_PADDING,
    };
  
  
    const { key, ...optionProps } = data[index][0];
  
    return (
      <div component="li" {...optionProps} style={{display:"flex", backgroundColor:"#262626", alignItems:"center", borderBottom: "1px solid #eaecef",}}>
        <img height={36} width={36} style={{objectFit:"cover"}} src={"https://www.congress.gov/img/member/"+ option.bioguideId.toLowerCase()+"_200.jpg"}></img>
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
          <Typography variant='caption' sx={{margin:0}} color='rgb(180, 180, 180)'>
            <span>
            {option.party + "-" + option.state+ " "+option.congresses}
            </span>
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
            style={{backgroundColor:"#262626",overflow:"clip"}}
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
  
  const Search = ({list,type}) => {
    const[filter, setFilter] = useState("")
    const[politicians,setPoliticians] = useState([])
    const {politician, setPolitician, filterContext, setFilterContext} = useContext(PageContext)
    const[filteredPoliticians, setFilteredPoliticians] = useState([])

    useEffect(()=>{
      getPoliticians().then((poli)=>{
        console.log(poli)
        setPoliticians(poli)
      })
    }, [])

    useEffect(()=>{
      if(type == "politiciansTable"){
        setFilterContext(filter)
      }
    }, [type,filter])
    

    return (
      <Autocomplete
        disableListWrap
        options={politicians}
        autoHighlight
        freeSolo
        inputValue={filter}              // 4) drive the input text
        onInputChange={(e, newText, reason) => {
          // we only want to respond to typing,
          // not option-selection events
          if (reason === 'input') {
            setFilter(newText);
          }
        }}
        value={politician}
              onChange={(event, newValue, reason) => {
                if (
                  event.type === 'keydown' &&
                  (event.key === 'Backspace' || event.key === 'Delete') &&
                  reason === 'removeOption'
                ) {
                  return;
                }
                setPolitician(newValue);
              }}

        getOptionLabel={(option) => option.firstName + " " + option.lastName}
        renderOption={(props, option, { inputValue }) => {
          const { key, ...optionProps } = props;
          const matches = match(option.lastName + ", " + option.firstName, inputValue, { insideWords: true });
          const parts = parse(option.lastName + ", " + option.firstName, matches);
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
    )
  }

  
export default Search