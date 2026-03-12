import axios from 'axios';
import {Google_API_KEY, Google_Base_Url} from '../../utils/api_content';

export default LatLngIntoAddress = async (lat, lng) => {
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${Google_Base_Url}geocode/json?latlng=${lat},${lng}&key=${Google_API_KEY}`,
      headers: {},
    };

    const res = await axios.request(config);
    console.log(
      'LatLngIntoAddress API response:',
      JSON.stringify(res?.data, null, 2),
    );

    return res?.data.results[0]?.formatted_address;
  } catch (error) {
    console.error(
      'Error in LatLngIntoAddress:',
      error?.response?.data || error.message || error,
    );
  }
};
