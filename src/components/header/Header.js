import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Platform } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import Status from "../utils/Status";
import { OrderStatus } from "../../constrant/OrderStatus"

import icon from "../../assets/side_bar_icon.png"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const Header = (route) => {

    // const [sidebarVisible, setSidebarVisible] = useState(false);
    const navigation = route?.navigation

    // const toggleSidebar = () => {
    //     setSidebarVisible(!sidebarVisible);
    // };

    // const nagigate = (link, params) => {
    //     toggleSidebar()
    //     navigation.navigate(link, { filter: params })
    // }

    return (
        <View
            style={{
                paddingTop: Platform.OS === 'ios' ? 50 : 0,
                backgroundColor: Platform.OS === 'ios' ? "black" : "white",
                zIndex: 999,
            }}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.sideButton}
                // onPress={() => {
                //     toggleSidebar()
                // }}
                >
                    {/* <Image
                    // style={styles.locker}
                    source={icon}
                /> */}
                </TouchableOpacity>

                <View>
                    <Text style={styles.content}>
                        {route.content}
                    </Text>
                </View>

                <Status navigation={navigation}/>
            </View>


            {/* <Modal
                animationType="fate"
                transparent={true}
                visible={sidebarVisible}
                onRequestClose={() => {
                    toggleSidebar()
                }}
            >
                <View style={styles.sidebar}>
                    <View style={styles.sideSheet}>
                        <View style={styles.sideHeader}></View>
                        <TouchableOpacity
                            onPress={() => { nagigate("Order") }}
                        >
                            <Text style={styles.optionChoice}>Đơn Hàng Công khai</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { nagigate("My Order", OrderStatus.WAITING) }}
                        >
                            <Text style={styles.optionChoice}>Đơn Hàng Chờ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { nagigate("My Order", OrderStatus.INPROCESS) }}
                        >
                            <Text style={styles.optionChoice}>Đơn Hàng Đang Giao</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { nagigate("My Order", OrderStatus.ACCEPTED) }}
                        >
                            <Text style={styles.optionChoice}>Đơn Hàng Đã Nhận</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.outline}
                        onPress={() => { toggleSidebar() }}
                    >
                    </TouchableOpacity>
                </View>
            </Modal> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: WIDTH,
        height: HEIGHT * 0.1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5"
    },
    sideButton: {
        position: "absolute",
        height: HEIGHT * 0.08,
        width: WIDTH * 0.15,
        left: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        fontSize: 20,
    },
    sidebar: {
        position: "absolute",
        width: WIDTH,
        height: HEIGHT,
        flexDirection: "row"
    },
    sideSheet: {
        position: "absolute",
        width: WIDTH * 0.7,
        height: HEIGHT,
        left: 0,
        top: 0,
        backgroundColor: 'white',
    },
    outline: {
        position: "absolute",
        width: WIDTH * 0.3,
        height: HEIGHT,
        right: 0,
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    sideHeader: {
        width: WIDTH * 0.7,
        height: HEIGHT * 0.1,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.3)",
    },
    optionChoice: {
        width: WIDTH * 0.7,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.3)",
        fontSize: 18,
        paddingLeft: 15,
        paddingVertical: 10,
    }
});

export default Header