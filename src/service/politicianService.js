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
