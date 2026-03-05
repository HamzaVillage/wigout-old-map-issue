import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Auth, {CreateProfileRoute} from './Auth';
import Main from './Main';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import SetLocation from '../screens/auth/AccountSetup/SetLocation';
import EnterAddressManually from '../screens/main/MapCommonScreens/EnterAddressManually';

const Stack = createStackNavigator();
const Routes = () => {
  const token = useSelector(state => state?.user?.token);
  const userData = useSelector(state => state?.user?.userData);
  const current_location = useSelector(state => state?.user?.current_location);
  // console.log('TOKEN in Routes:-', token);
  // console.log('userData:-', userData);
  // console.log('current_location:-', current_location);

  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {token ? (
          <>
            {current_location?.latitude && userData?.isCreated == true ? (
              <Stack.Screen name="Main" component={Main} />
            ) : !current_location?.latitude && userData?.isCreated == true ? (
              <Stack.Screen name="SetLocation" component={SetLocation} />
            ) : (
              <Stack.Screen
                name="CreateProfileRoute"
                component={CreateProfileRoute}
              />
            )}
          </>
        ) : (
          <Stack.Screen name="Auth" component={Auth} />
        )}
        <Stack.Screen
          name="EnterAddressManually"
          component={EnterAddressManually}
        />
      </Stack.Navigator>
      <Toast />
    </>
  );
};

export default Routes;
