
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { ToastProvider } from 'react-native-toast-notifications'
import { NavigationContainer } from "@react-navigation/native";

import { UserProvider } from "./src/context/UserContext"
import StackNavigator from "./src/navigation/StackNavigator";


export default function App() {
  return (
    <SafeAreaView style={{
      flex: 1,
    }}>
      <ToastProvider
      >
        < UserProvider >
          <NavigationContainer>
            <StackNavigator >

            </StackNavigator>
          </NavigationContainer>
        </UserProvider >
      </ToastProvider>

    </SafeAreaView>


  );
}
