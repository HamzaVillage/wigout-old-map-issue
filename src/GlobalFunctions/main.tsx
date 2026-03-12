import axios from 'axios';
import {baseUrl, endPoints} from '../utils/api_content';

export const updateProfile = async ({
  id,
  fullName,
  nickName,
  image,
  gender,
  number,
  date,
}: any) => {
  try {
    let data = new FormData();
    data.append('userId', id);
    data.append('fullName', fullName);
    data.append('nickName', nickName);
    data.append('DOB', date);
    data.append('phone', number);
    data.append('gender', gender);

    // Only upload the image if it's a new local file
    if (
      image &&
      (image.startsWith('file://') ||
        image.startsWith('content://') ||
        image.startsWith('/'))
    ) {
      data.append('profileImage', {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any);
    }

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}${endPoints.createProfile}`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };

    const res = await axios.request(config);

    return res?.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};

export const getAllNotifications = async (token: string) => {
  try {
    const data = await axios.get(`${baseUrl}${endPoints.getAllNotifications}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data?.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};

export const notifyUserForNearbyReviewedPlaces = async (
  token: string,
  latitude: string,
  longitude: string,
) => {
  const data = {
    latitude: latitude,
    longitude: longitude,
  };
  try {
    const response = await axios.post(
      `${baseUrl}${endPoints.notifyUser}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('Notify API Response:-', response?.data);
    return response?.data;
  } catch (error) {
    console.log('Notify API Error:-', error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};
