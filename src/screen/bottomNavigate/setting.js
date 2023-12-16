import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView } from "react-native";

import { UserContext } from '../../context/UserContext';

import { ChangeShipperStatus } from "../../api/shipper";

import { ShipperStatus } from "../../constrant/ShipperStatus";

import Header from "../../components/header/Header";
import SpaceLine from "../../components/utils/SpaceLine";
import SettingTab from "../../components/SettingTab";
import BackGround from "../../components/background/BackGound";

import cong from "../../assets/cong.jpg"
import changePass from "../../assets/changePass.png"
import changeInfor from "../../assets/changeInfor.png"
import paymentIcon from "../../assets/payment.png"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const Setting = ({ navigation }) => {

    const { user, updateUser, token } = useContext(UserContext);

    const changeStatus = (status) => {
        const data = { ...user, status: status }
        updateUser(data)
    }

    const handleStatus = async () => {
        if (user.status === ShipperStatus.Online) {
            const response = await ChangeShipperStatus(user.id, ShipperStatus.Offline, token)
            if (response.status === 200) {
                changeStatus(ShipperStatus.Offline)
                console.log("change to offline");
            } else {
                // console.log(response.status);
            }
        } else if (user.status === 2) {
            const response = await ChangeShipperStatus(user.id, 3, token)
            if (response.status === 200) {
                changeStatus(3)
                console.log("change to online");
            } else {
                console.log(response.status);
            }
        }
    }

    const handleLogout = async () => {
        const response = await ChangeShipperStatus(user.id, ShipperStatus.Offline, token)
        if (response.status !== 200) {
            console.log("Cập nhật status thất bại");
        }
        updateUser({})
        handleNavigate("LoginOtp")
    }

    const handleNavigate = (link) => {
        navigation.navigate(link)
    }

    return (
        <View style={styles.container}>
            <Header content={""} />

            <View style={styles.settingHeader}>
                <Image
                    source={cong}
                    style={styles.avt}
                />
                <View style={styles.infor}>
                    <Text style={styles.name}>{user?.account?.fullname}</Text>
                    <Text style={styles.inforText}>{user?.account?.phone}</Text>
                    <Text style={styles.inforText}>{user?.emailShipper}</Text>
                </View>
            </View>
            
            <SettingTab name={"Thay đổi mật khẩu"} img={changePass} action={() => {handleNavigate("Login")}}/>
            <SettingTab name={"Thanh toán"} img={paymentIcon} action={() => {handleNavigate("Transaction")}}/>
            <SettingTab name={"Đăng xuất"} img={changeInfor} action={() => {handleLogout()}}/>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: "#f5f5f5",
        alignItems: "center"
    },
    settingHeader: {
        width: WIDTH * 0.95,
        padding: 7,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: 15,
        margin: 5,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    infor: {
        width: WIDTH * 0.55,
        height: 100,
        justifyContent: "space-around",
    },
    avt: {
        width: 100,
        height: 100,
        resizeMode: "cover",
        borderRadius: 50,
    },
    name: {
        fontSize: 20,
        fontWeight: "600",
        textTransform: "uppercase"
    },
    inforText:{
        fontSize: 18,
    },
});

export default Setting