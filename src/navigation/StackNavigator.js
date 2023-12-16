import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';

import BottomNavigator from './BottomNavigator';

// authen
import Login from '../screen/authen/login';
import LoginOtp from '../screen/authen/loginOtp';
import VerifyOtp from '../screen/authen/verifyOtp';
import Signup from "../screen/authen/signup";
import ForgotPassword from '../screen/authen/forgotPassword';
import ForgotOtp from '../screen/authen/forgotOtp';
import NewPassword from '../screen/authen/newPassword';

//bottom navigate
import Order from '../screen/bottomNavigate/order';
import Setting from '../screen/bottomNavigate/setting';
import OwnershipOrder from '../screen/bottomNavigate/ownershipOrder';
import Chart from '../screen/bottomNavigate/chart';
import Routes from '../screen/bottomNavigate/routes'

// orther
import OrderDetail from '../screen/orderDetail';
import MyMapView from "../screen/map";
import RouteDetail from '../components/route/RouteDetail';
import ShipProcedure from "../screen/shipProcedure";
import StoreInfor from "../screen/storeInfor";
import Transaction from "../screen/transaction";
import Transfer from "../screen/transfer";

const Stack = createStackNavigator();

const customTransitionConfig = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              opacity: current.progress,
            },
          };
        },
        transitionSpec: {
          open: customTransitionConfig,
          close: customTransitionConfig,
        },
      }}
    >
      <Stack.Screen name="LoginOtp" component={LoginOtp} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="BottomNav" component={BottomNavigator} />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="OrderDetail" component={OrderDetail} />
      <Stack.Screen name="MyOrder" component={OwnershipOrder} />
      <Stack.Screen name="Chart" component={Chart} />
      <Stack.Screen name="MyMapView" component={MyMapView} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ForgotOtp" component={ForgotOtp} />
      <Stack.Screen name="Routes" component={Routes} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
      <Stack.Screen name="RouteDetail" component={RouteDetail} />
      <Stack.Screen name="ShipProcedure" component={ShipProcedure} />
      <Stack.Screen name="StoreInfor" component={StoreInfor} />
      <Stack.Screen name="Transaction" component={Transaction} />
      <Stack.Screen name="Transfer" component={Transfer} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
