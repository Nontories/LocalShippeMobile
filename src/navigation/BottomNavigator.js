import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Text, Image, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();

const HEIGHT = Dimensions.get("window").height

// bottomNavigate
import Order from "../screen/bottomNavigate/order"
import Setting from "../screen/bottomNavigate/setting";
import Chart from "../screen/bottomNavigate/chart";
import OwnershipOrder from "../screen/bottomNavigate/ownershipOrder";
import Routes from "../screen/bottomNavigate/routes";

// other

import OrderDetail from "../screen/orderDetail";
// import MyMapView from "../screen/map";
import RouteDetail from "../components/route/RouteDetail";
import ShipProcedure from "../screen/shipProcedure";
import StoreInfor from "../screen/storeInfor";
import Transaction from "../screen/transaction";
import Transfer from "../screen/transfer";

// import VerifyOtp from "../screen/verifyOtp";


const BottomNavigator = () => {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          // height: HEIGHT * 0.07,
          elevation: 20,
          borderColor: "black",
          backgroundColor: "#edf6f9",
          alignItems: "center"
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#19779B",
        tabBarIcon: ({ color }) => {
          let iconName;

          switch (route.name) {
            case "Order":
              iconName = "list-alt";
              break;
            case "My Order":
              iconName = "schedule"
              break;
            case "Chart":
              iconName = "bar-chart";
              break;
            case "Setting":
              iconName = "person";
              break;
            case "Routes":
              iconName = "delivery-dining";
              break;
            default:
              iconName = "default-icon";
              break;
          }
          return <Icon name={iconName} color={color} size={28} />;
        },
        tabBarLabel: ({ focused }) => {
          let label;
          switch (route.name) {
            case "Order":
              label = "Đơn Hàng";
              break;
            case "Chart":
              label = "Thống Kê";
              break;
            case "Setting":
              label = "Cài Đặt";
              break;
            case "Routes":
              label = "Lô Trình";
              break;
            default:
              label = "Mặc Định";
              break;
          }
          return <Text style={{ color: focused ? "#19779B" : "#7B8D93" }}>{label}</Text>;
        }
      })
      }
    >
      <Tab.Screen name="Order" component={Order} />
      {/* <Tab.Screen name="My Order" component={OwnershipOrder} /> */}
      <Tab.Screen name="Routes" component={Routes} />
      <Tab.Screen name="Chart" component={Chart} />
      <Tab.Screen name="Setting" component={Setting} />

      <Tab.Screen name="OrderDetail" component={OrderDetail} options={{ tabBarButton: () => null }} />
      {/* <Tab.Screen name="MyMapView" component={MyMapView} options={{ tabBarButton: () => null }} /> */}
      <Tab.Screen name="RouteDetail" component={RouteDetail} options={{ tabBarButton: () => null }} />
      <Tab.Screen name="ShipProcedure" component={ShipProcedure} options={{ tabBarButton: () => null }} />
      <Tab.Screen name="StoreInfor" component={StoreInfor} options={{ tabBarButton: () => null }} />
      <Tab.Screen name="Transaction" component={Transaction} options={{ tabBarButton: () => null }} />
      <Tab.Screen name="Transfer" component={Transfer} options={{ tabBarButton: () => null }} />
    </Tab.Navigator >
  );
};

export default BottomNavigator;
