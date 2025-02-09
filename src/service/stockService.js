import axios from 'axios'
const stockUrl = process.env.REACT_APP_HOST_API + "/stock"

export const getStockHistory = async (ticker) => {
	
    try {
        const token = ""; // No trailing =
        const response = await axios.post(
            `${stockUrl}/${ticker}`,
            token, // Send as raw string
            {
                headers: {
                    'Content-Type': 'text/plain' // Explicit content type
                }
            }
        );
        return response.data;
    } catch (error) {
        console.log(error)
    }
	
}

export const getStockBacktest = async (bioguideId,tickers) => {
    if(tickers == null|| tickers.length==0 ){
        return [];
    }
        
	
    try {
        const token = ""; // No trailing =
        const response = await axios.post(
            `${stockUrl}/backtest/${bioguideId}`,
            {
                token: token,
                tickers: tickers
            },
        );
        return response.data;
    } catch (error) {
        console.log(error)
    }
	
}

export const getStocksTradedByBioguideId = async (bioguideId) => {
	
    try {
        let response = await axios.get(stockUrl +"/traded/"+bioguideId)
        return response.data
    } catch (error) {
        console.log(error)
    }
	
}


export const getStocksTraded = async () => {
	
    try {
        let response = await axios.get(stockUrl +"/traded")
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
	
}
