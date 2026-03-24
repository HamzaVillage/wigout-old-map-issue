import {ApiCall} from '../../../utils/ApiCall';

export const GetWishList = async token => {
  try {
    const res = await ApiCall('GET', 'wishlist', '', token);
    console.log('res in GetWishList:-', res?.data);

    return res?.data;
  } catch (err) {
    console.log('err in GetWishList:-', err);
  }
};

export const AddWishList = async (token, data) => {
  try {
    const res = await ApiCall('POST', 'wishlist', data, token);
    console.log('res in AddWishList:-', res?.data);

    return res?.data;
  } catch (err) {
    console.log('err in AddWishList:-', err);
  }
};

export const RemoveWishList = async (token, data) => {
  try {
    const res = await ApiCall('DELETE', 'wishlist', data, token);
    console.log('res in RemoveWishList:-', res?.data);

    return res?.data;
  } catch (err) {
    console.log('err in RemoveWishList:-', err);
  }
};
