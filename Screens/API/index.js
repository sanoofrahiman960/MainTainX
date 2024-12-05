import {getErrorMsg} from './APiproblems';
import {refreshToken} from './Endpoints/Common';
import * as asyncCache from '../Utility/asynCache';
import SInfo from 'react-native-sensitive-info';
import {apiClient} from './apiClient';
import {getData} from '../Utility/asynCache';
// import store from '../redux/store';
// import { logOut } from '../redux/studentInfo/infoActions';

const getRequest = async (endPoint, payload) => {
  console.log('payload', endPoint, payload);

  const response = await apiClient.get(endPoint, payload);
  if (response.ok) {
    return response;
  } else {
    if (response?.status === 401) {
      const res = await CheckRefreshToken();
      if (res) {
        const secondResponse = await apiClient.get(endPoint, payload);
        return secondResponse;
      }
    }
    const error = getErrorMsg(response);
    console.log('error', error);
    return error;
  }
};

const postRequest = async (endPoint, payload) => {
  /* eg
  resp = postRequest(`${CommonEndPoints.NotificationTest}/${type}`, {
      fcmToken: fcmToken,
    });
    */
  console.log('payload', endPoint, payload);
  const response = await apiClient.post(endPoint, payload);
  if (response.ok) {
    return response;
  } else {
    if (response?.status === 401) {
      const res = await CheckRefreshToken();
      if (res) {
        const secondResponse = await apiClient.post(endPoint, payload);
        return secondResponse;
      }
    }
    const error = getErrorMsg(response);
    console.log('error', error);
    return error;
  }
};

const putRequest = async (endPoint, payload) => {
  console.log('payload', endPoint, payload);
  const response = await apiClient.put(endPoint, payload);
  if (response.ok) {
    return response;
  } else {
    if (response?.status === 401) {
      const res = await CheckRefreshToken();
      if (res) {
        const secondResponse = await apiClient.put(endPoint, payload);
        return secondResponse;
      }
    }
    const error = getErrorMsg(response);
    console.log('error', error);
    return error;
  }
};

const patchRequest = async (endPoint, payload) => {
  const response = await apiClient.patch(endPoint, payload);
  if (response.ok) {
    return response;
  } else {
    if (response?.status === 401) {
      const res = await CheckRefreshToken();
      if (res?.ok) {
        const secondResponse = await apiClient.patch(endPoint, payload);
        return secondResponse;
      }
    }
    console.log(response);
    const error = getErrorMsg(response);
    return error;
  }
};

const deleteRequest = async (endPoint, payload) => {
  const response = await apiClient.delete(endPoint, payload);
  if (response.ok) {
    return response;
  } else {
    if (response?.status === 401) {
      const res = await CheckRefreshToken();
      if (res) {
        const secondResponse = await apiClient.delete(endPoint, payload);
        return secondResponse;
      }
    }
    console.log(response);
    const error = getErrorMsg(response);
    return error;
  }
};

const customRequest = async (requestType, endPoint, payload, headers = {}) => {
  /*
  Author : Nayan  Nandakumar
  Date: 12-10-2024
  This is used for creating a custom request and also custom headers
  :parameters
  requestType - any request type like 'GET','POST' etc and it should be catiptailsed
  endPoint - url end pointerEvents
  payload - the payload we want
  headers - custom headers and it should be in a dict
  eg:
  const response = await customRequest(
        'PUT',
        CommonEndPoints.ProfilePicUpdate,
        formData,
        {
          'Content-Type': 'multipart/form-data',
        },
*/
  const AccessToken = await getData('AUTHENTICATION_ACCESS_TOKEN');
  headers.Authorization = `JWT ${AccessToken}`;
  const response = await apiClient.any({
    method: requestType,
    url: endPoint,
    data: payload,
    headers: headers,
  });
  if (response.ok) {
    return response;
  } else {
    if (response?.status === 401) {
      const res = await CheckRefreshToken();
      if (res) {
        const secondResponse = await apiClient.delete(endPoint, payload);
        return secondResponse;
      }
    }
    console.log(response);
    const error = getErrorMsg(response);
    return error;
  }
};

const CheckRefreshToken = async () => {
  // const token = await asyncCache.getData('AUTHENTICATION_ACCESS_TOKEN');
  const refreToken = await SInfo.getItem('AUTHENTICATION_REFRESH_TOKEN', {
    sharedPreferencesName: 'mySharedPrefs',
    keychainService: 'myKeychain',
  });
  const AccessToken = await getData('AUTHENTICATION_ACCESS_TOKEN');
  if (refreToken) {
    const response = await apiClient.post('/accounts/api/token/refresh/', {
      refresh: refreToken,
      access: AccessToken,
    });
    if (response?.ok) {
      await asyncCache.storeData(
        'AUTHENTICATION_ACCESS_TOKEN',
        response?.data?.access,
      );
      apiClient.setHeaders({
        Authorization: `JWT ${response?.data?.access}`,
      });
      if (response?.data?.refresh) {
        await SInfo.setItem(
          'AUTHENTICATION_REFRESH_TOKEN',
          response?.data?.refresh,
          {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          },
        );
      }
      return response?.data?.access;
    } else {
      if (response?.status === 401) {
        LogoutUser();
      }
    }
  } else {
    return null;
  }
};

export const deleteRefreshToken = async () => {
  return SInfo.deleteItem('AUTHENTICATION_REFRESH_TOKEN', {
    sharedPreferencesName: 'mySharedPrefs',
    keychainService: 'myKeychain',
  });
};

const LogoutUser = async () => {
  store.dispatch(logOut());
};

export {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
  LogoutUser,
  putRequest,
  customRequest,
};
