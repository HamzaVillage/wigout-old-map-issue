import {ApiCall} from '../../../utils/ApiCall';

export const GetWishList = async token => {
  try {
    const res = await ApiCall('GET', 'wishlist', '', token);
    console.log('res in GetWishList:-', res?.data);

    return res?.data || {success: false, message: 'No data returned'};
  } catch (err) {
    console.log('err in GetWishList:-', err);
    return {success: false, message: err?.message || 'Something went wrong'};
  }
};

export const AddWishList = async (token, data) => {
  try {
    const res = await ApiCall('POST', 'wishlist', data, token);
    console.log('res in AddWishList:-', res?.data);

    return res?.data || {success: false, message: 'No data returned'};
  } catch (err) {
    console.log('err in AddWishList:-', err);
    return {success: false, message: err?.message || 'Something went wrong'};
  }
};

export const RemoveWishList = async (token, data) => {
  try {
    const url = `wishlist?placeId=${data?.placeId}`; // Adding as Query Param for mobile compatibility
    console.log('RemoveWishList started with data:', url, JSON.stringify(data));

    // Some mobile network stacks ignore bodies on DELETE, so we use both URL and Data
    const res = await ApiCall('DELETE', url, data, token);

    // Check both standard response and axios error response
    const status = res?.status || res?.response?.status;
    const responseData = res?.data || res?.response?.data;

    console.log('res in RemoveWishList:-========', status, responseData);

    // If it's an error object returned from ApiCall, handle it
    if (res instanceof Error && !res.response) {
      console.error('Network Error in RemoveWishList:', res.message);
      return {success: false, message: res.message};
    }

    return res?.data || res;
  } catch (err) {
    console.log('Unexpected err in RemoveWishList:-', err);
    return {success: false, message: err?.message || 'Something went wrong'};
  }
};
