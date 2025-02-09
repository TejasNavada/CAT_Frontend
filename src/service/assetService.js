import axios from 'axios'
const assetUrl = process.env.REACT_APP_HOST_API + "/asset"


export const getAssetsByBioguideId = async (bioguideId) => {
	
    try {
        let response = await axios.get(assetUrl +"/"+bioguideId)
        return response.data
    } catch (error) {
        console.log(error)
    }
	
}
