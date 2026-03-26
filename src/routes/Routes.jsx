import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Auth, {CreateProfileRoute} from './Auth';
import Main from './Main';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import SetLocation from '../screens/auth/AccountSetup/SetLocation';
import EnterAddressManually from '../screens/main/MapCommonScreens/EnterAddressManually';
import OnBoarding from '../screens/auth/OnBoarding';
import Splash from '../screens/auth/Splash';

const Stack = createStackNavigator();
const Routes = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const token = useSelector(state => state?.user?.token);
  const userData = useSelector(state => state?.user?.userData);
  const current_location = useSelector(state => state?.user?.current_location);
  
  // console.log('TOKEN in Routes:-', token);
  // console.log('userData:-', userData);
  // console.log('current_location:-', current_location);

  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {showSplash ? (
          <Stack.Screen name="Splash">
            {props => (
              <Splash
                {...props}
                onComplete={() => {
                  setShowSplash(false);
                  setShowOnboarding(true);
                }}
              />
            )}
          </Stack.Screen>
        ) : showOnboarding ? (
          <Stack.Screen name="OnBoarding">
            {props => (
              <OnBoarding
                {...props}
                onComplete={() => setShowOnboarding(false)}
              />
            )}
          </Stack.Screen>
        ) : token ? (
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
