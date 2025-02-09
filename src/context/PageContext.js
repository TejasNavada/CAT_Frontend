import React, { useContext, useEffect, useState } from "react";
import { getAssetsByBioguideId } from "../service/assetService";
import {  getTransactionsByBioguideId } from "../service/transactionService";
import {  getStocksTraded, getStocksTradedByBioguideId } from "../service/stockService";


export const PageContext = React.createContext();

export const PageProvider = ({ children}) => {
    const [page,setPage] = useState("Politicians")
    const [politician,setPolitician] = useState(null)
    const [assets,setAssets] = useState([])
    const [transactions,setTransactions] = useState([])
    const [stocks,setStocks] = useState([])
    const [politicianStocks,setPoliticianStocks] = useState([])
    const [reload, setReload] = React.useState(false);
    const [value, setValue] = React.useState('Assets');
    const [slide, setSlide] = React.useState(false);
    const [backtestTickers, setBacktestTickers] = useState([]);
    useEffect(()=>{
        setReload(false)
        if(politician){
            getAssetsByBioguideId(politician.bioguideId).then((response)=>setAssets(response))
            getTransactionsByBioguideId(politician.bioguideId).then((response)=>setTransactions(response))
            getStocksTradedByBioguideId(politician.bioguideId).then((response)=>setPoliticianStocks(response))
            setTimeout(() => setReload(true), 300);
        }
    },[politician])

    useEffect(()=>{
        if(page == "Stocks"){
            getStocksTraded().then((response)=>{
                console.log(response)
                setStocks(response)
            })
            
        }
    },[page])

    useEffect(()=>{
        setSlide(false)
        if(value){
            setTimeout(() => {setSlide(true);}, 1000);
    
        }
      },[value])

    return (
        <PageContext.Provider value={{ page,setPage,politician,setPolitician,reload, setReload, value, setValue, slide, setSlide,assets,setAssets,transactions,setTransactions,stocks,setStocks, politicianStocks,setPoliticianStocks,backtestTickers, setBacktestTickers }}>
            {children}
        </PageContext.Provider>
    );
};
