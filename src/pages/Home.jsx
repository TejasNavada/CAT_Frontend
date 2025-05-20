import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContext } from '../context/PageContext'
import Politicians from '../component/Politicians'
import RecentTransactions from '../component/RecentTransactions'
import Stocks from '../component/Stocks'

const Home = React.memo(() => {
    const {page} = React.useContext(PageContext)


  return (
        <div style={{backgroundColor:"#262626", minHeight:"100vh"}}>
            <div style={{height:"6vh"}}></div>
            {page=="Politicians" && (
                <Politicians/>
            )}
            {page == "Transactions"&&(
                <div style={{marginTop:"10em",margin:"auto",width:"80vw"}}>
                    
                    <RecentTransactions/>
                </div>
            )}

            {page == "Stocks"&&(
                <Stocks/>
            )}
                      
        </div>
    
    
  )
})

export default Home
