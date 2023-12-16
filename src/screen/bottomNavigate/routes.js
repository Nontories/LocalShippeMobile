import React, { useState, useEffect, useContext, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Dimensions, ScrollView, FlatList, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker"
import { UserContext } from '../../context/UserContext';
import Toast from "react-native-toast-notifications";

import { InteractRoute } from "../../api/route"
import { InteractStore } from "../../api/store"
import { InteractOrder } from "../../api/shipper"

import { ShipperStatus } from "../../constrant/ShipperStatus";
import { District } from "../../constrant/District";

import { findObjectById } from "../../util/util"

import RouteHeader from "../../components/header/RouteHeader";
import RouteTab from "../../components/route/RouteTab";
import EditRouteTab from "../../components/route/EditRouteTab";
import SpinnerLoading from "../../components/utils/SpinnerLoading";
import BackGroundOffline from "../../components/background/BackGroundOffline";
import CustomToast from "../../components/utils/CustomToast";

import add from "../../assets/Add.png"
import { RouteStatus } from "../../constrant/RouteStatus";

// import RouteDetailModal from "../../components/route/RouteDetailModal";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const Routes = ({ navigation }) => {

    const [routes, setRoutes] = useState("")
    const [stores, setStores] = useState("")
    const [mode, setMode] = useState("default")
    const [loading, setLoading] = useState(true)
    const { user, token } = useContext(UserContext);

    useFocusEffect(
        React.useCallback(() => {
            routeData()
        }, [])
    );

    const routeData = async () => {
        const routeData = {
            shipperId: user?.id
        }

        try {
            setLoading(loading)
            const req = await InteractStore({}, token);
            const response = await InteractRoute(routeData, token);
            // console.log(req.status + " " + req.data);
            // console.log(req.data);
            setStores(req.data)
            setRoutes(response.data)

        } catch (error) {
            console.log('Error when load route list ' + error);
        } finally {
            setLoading(false)
        }
    }

    const renderItem = ({ item }) => {

        // console.log(item);
        const store = findObjectById(stores, item.storeId)
        return (
            <RouteTab
                routes={routes}
                setRoutes={setRoutes}
                data={item}
                store={store}
                navigation={navigation}
            />
        )
    }

    const renderEditRoute = ({ item }) => {
        const store = findObjectById(stores, item.storeId)
        return (
            <EditRouteTab
                routes={routes}
                setRoutes={setRoutes}
                data={item}
                store={store}
                navigation={navigation}
            />
        )
    }

    return (
        <View style={styles.container}>
            <RouteHeader content="Lộ Trình" navigation={navigation} routeData={() => { routeData() }} mode={mode} setMode={setMode} setLoading={setLoading}/>
            {loading ?
                <SpinnerLoading />
                :
                user?.status !== ShipperStatus.Offline ?
                    mode == "default" ?
                        < FlatList
                            style={styles.routeList}
                            data={routes}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem} />
                        :
                        <>
                            <Text style={styles.editText}>
                                Chọn lộ trình cần sửa
                            </Text>
                            < FlatList
                                style={styles.routeList}
                                data={routes.filter(item => item.status == RouteStatus.IDLE)}
                                keyExtractor={(item) => item.id}
                                renderItem={renderEditRoute} />
                        </>
                    :
                    <BackGroundOffline />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: "#f5f5f5",
    },
    noData: {
        width: WIDTH,
        textAlign: "center",
        marginVertical: HEIGHT * 0.1,
        fontSize: 25,
        fontWeight: "700"
    },
    routeList: {
        marginBottom: HEIGHT * 0.1,
        zIndex: 10,
    },

    addButton: {
        position: "absolute",
        right: 15,
        bottom: HEIGHT * 0.13,
        padding: 7,
        borderRadius: 50,
        backgroundColor: "#19779B"
    },
    addImage: {
        width: 30,
        height: 30,
    },

    layout: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        // backgroundColor: "rgba(0, 0, 0, 0.1)"
    },
    addRoute: {
        position: "absolute",
        width: WIDTH,
        height: HEIGHT * 0.84,
        bottom: 0,
        backgroundColor: "white",
        borderRadius: 15,
    },
    title: {
        width: WIDTH,
        paddingVertical: 15,
        textAlign: "center",
        textTransform: "uppercase",
        fontSize: 27,
        fontWeight: "700",
    },
    picker: {
        width: WIDTH * 0.9,
        marginHorizontal: WIDTH * 0.05,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: 15,
        elevation: 1
    },
    name: {
        textTransform: "capitalize",
        fontSize: 18,
        fontWeight: "700",
        paddingVertical: 8,
        marginLeft: WIDTH * 0.05,
    },
    input: {
        width: WIDTH * 0.9,
        marginHorizontal: WIDTH * 0.05,
        padding: 10,
        fontSize: 18,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: 15,
        elevation: 1,
    },
    create: {
        width: WIDTH,
        alignItems: "center",
        marginVertical: 30,
    },
    createButton: {
        width: WIDTH * 0.9,
        padding: 10,
        borderRadius: 15,
        backgroundColor: "#72AFD3",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "600",
        color: "white",
    },
    flexColumn: {
        flexDirection: "row",
        width: WIDTH * 0.9,
        justifyContent: "space-between",
        marginVertical: 15,
    },
    addOrder: {
        padding: 7,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: "#19779B"
    },
    editText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600"
    }

});

export default Routes