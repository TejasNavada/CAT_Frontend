import * as React from 'react';
import Search from './Search';
import { styled, alpha } from '@mui/material/styles';
import { Button, AppBar, Box, Toolbar, IconButton, Typography, InputBase } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import GavelIcon from '@mui/icons-material/Gavel';
import { PageContext } from '../context/PageContext';


const Search1 = styled('div')(({ theme }) => ({
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
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

const NavBar = () => {
    const {setPage,setPolitician} = React.useContext(PageContext)




  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar  position="fixed">
        <Toolbar sx={{backgroundColor:"#304040"}} >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
          >
            <GavelIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            CAT
          </Typography>
          <div
            variant="h6"
            noWrap
            component="div"
            style={{ flexGrow: 1, display: "flex" }}
          >
            <Button
                variant="h6"
                noWrap
                component="div"
                onClick={()=>{
                  setPolitician(null)
                  setPage("Politicians")
                }}
            >
                Politicians
            </Button>
            <Button
                variant="h6"
                noWrap
                component="div"
                sx={{paddingLeft:"3em"}}
                onClick={()=>setPage("Transactions")}
            >
                Transactions
            </Button>
            <Button
                variant="h6"
                noWrap
                component="div"
                sx={{paddingLeft:"3em"}}
                onClick={()=>setPage("Stocks")}
            >
                Stocks
            </Button>
          </div>
          <div style={{flexGrow: 1}}>
            <Search/>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavBar