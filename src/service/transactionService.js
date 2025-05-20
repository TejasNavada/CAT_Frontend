import axios from 'axios'
const transactionUrl = process.env.REACT_APP_HOST_API + "/transaction"

export const getRecentTransactions = async (pageIndex, pageSize) => {
	
    try {
        let response = await axios.get(transactionUrl +"/recent?page="+pageIndex+"&size="+pageSize)
        return response.data
    } catch (error) {
        console.log(error)
    }
	
}

export const getTransactionsByBioguideId = async (bioguideId) => {
	
    try {
        let response = await axios.get(transactionUrl +"/"+bioguideId)
        return response.data
    } catch (error) {
        console.log(error)
    }
	
}

export const getTransactionsByBioguideIdAndTicker = async (bioguideId,ticker) => {
	
    try {
        let response = await axios.get(transactionUrl +"/stocks/"+bioguideId+"/"+ticker)
        return response.data
    } catch (error) {
        console.log(error)
    }
	
}
export const getTransactionsByBioguideIdAndTickers = async (bioguideId,tickers) => {
    console.log(bioguideId, tickers)
    if(tickers == null|| tickers == [] ){
        return [];
    }
	
    try {
        let response = await axios.post(transactionUrl +"/stocks/"+bioguideId,tickers)
        console.log(response)
        return response.data
    } catch (error) {
        console.log(error)
    }
	
}
export const getTransactionsByTicker = async (ticker) => {
	
    try {
        let response = await axios.get(transactionUrl +"/stocks/"+ticker)
        return response.data
    } catch (error) {
        console.log(error)
    }
	
}


