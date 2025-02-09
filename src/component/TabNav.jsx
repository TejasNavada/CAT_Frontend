
import { useState, useEffect, useContext} from 'react';
import * as React from 'react';
import { PageContext } from '../context/PageContext';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
  
const TabNav = () => {
    const {politician, setPolitician, reload, setReloa, value, setValue, slide, setSlide } = useContext(PageContext)

    
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    return (
        <BottomNavigation showLabels sx={{  backgroundColor:"#403129"}} value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Assets"
          value="Assets"
          color='#FFFFFF'
          sx={{color:'#BFB6AE'}}
          icon={<AccountBalanceIcon  />}
        />
        <BottomNavigationAction
          label="Transactions"
          value="Transactions"
          sx={{color:'#BFB6AE'}}
          icon={<PointOfSaleIcon />}
        />
        <BottomNavigationAction
          label="Nearby"
          value="nearby"
          sx={{color:'#BFB6AE'}}
          icon={<LocationOnIcon />}
        />
        <BottomNavigationAction sx={{color:'#BFB6AE'}}label="Folder" value="folder" icon={<FolderIcon />} />
      </BottomNavigation>
    )
  }

  
export default TabNav