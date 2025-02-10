import axios from 'axios'
const politicanUrl = process.env.REACT_APP_HOST_API + "/politician"


export const getPoliticians = async () => {
	
    try {
        let response = await axios.get(politicanUrl +"/")
        return response.data
    } catch (error) {
        console.log(error)
    }
	
}
export const getPoliticianByBioGuide = async (bioguide) => {
	
    try {
        let response = await axios.get(politicanUrl +"/bioguide/"+bioguide)
        return response.data
    } catch (error) {
        console.log(error)
    }
	
}



export const getPoliticiansBacktest = async (pageIndex, pageSize,sort="backtestAllTime") => {
	
    try {
        let response = await axios.get(politicanUrl +"/backtest?page="+pageIndex+"&size="+pageSize+"&sortBy="+sort)
        return response.data
    } catch (error) {
        console.log(error)
    }
	
}