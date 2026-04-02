import axios from 'axios';
import {Google_API_KEY, Google_Base_Url} from '../../utils/api_content';
import {setNearbyPlaces} from '../../redux/Slices';

const FetchNearbyPlaces = async (location, dispatch, type = 'restaurant') => {
  let url = `${Google_Base_Url}place/nearbysearch/json?location=${location?.latitude},${location.longitude}&radius=100000&type=${type}&key=${Google_API_KEY}`;
  console.log('url of FetchNearbyPlaces:-', url);
  try {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      headers: {},
    };

    const result = await axios.request(config);
    console.log('res in FetchNearbyPlaces:-', result.data.results);
    dispatch(setNearbyPlaces(result.data.results || []));

    return result.data.results || [];
  } catch (error) {
    console.log('error in FetchNearbyPlaces', error);
    dispatch(setNearbyPlaces([]));
    return [];
  }
};

export default FetchNearbyPlaces;
