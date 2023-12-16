import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, TextInput, View, Image, ImageBackground, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import OTPTextInput from "react-native-otp-textinput"

import { UserContext } from '../../context/UserContext';

import { verifyOtp } from "../../api/auth"
import { ShipperByAcountId, ChangeShipperStatus } from "../../api/shipper"
import { GetOrder } from "../../api/order";
import { InteractRoute } from "../../api/route";

import locker from "../../assets/lock_white.png"
import userpng from "../../assets/user.png"
import Logo from "../../assets/logo.png"

import { OrderStatus } from "../../constrant/OrderStatus"
import { ShipperStatus } from "../../constrant/ShipperStatus"

import SpinnerLoading from "../../components/utils/SpinnerLoading";
import BackGround from "../../components/background/BackGound";
import TextSpaceLine from "../../components/utils/TextSpaceLine"


const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const VerifyOtp = ({ route, navigation }) => {

    const [otp, onChangeOtp] = useState("");
    const mail = route?.params?.mail
    const [loading, setLoading] = useState(false)
    const { updateUser, updateToken, token } = useContext(UserContext);


    const checkOtp = async () => {

        setLoading(true)
        const response = await verifyOtp(mail, otp);
        console.log(response.data);
        if (response?.status === 200) {
            getData(response.data)
            setLoading(false)
            navigation.navigate("BottomNav")
        } else {
            setLoading(false)
        }
    }

    const getData = async (data) => {
        updateToken(data?.accessToken)
        const response = await ShipperByAcountId(data?.id, data?.accessToken);
        const status = await checkOrderInprocess(response.data[0].id, data?.accessToken)
        // console.log(data.id);
        // console.log(response.data[0]);
        // console.log(status);
        if (status?.flag) {
            changeStatus(response.data[0], data?.accessToken)
            updateUser({ ...response.data[0], delivering: status.routeid})
        } else {
            updateUser({ ...response.data[0], delivering: null})
        }
    }

    const checkOrderInprocess = async (id, token) => {
        const req = await GetOrder({ shipperId: id }, token);
        const response = await InteractRoute({ shipperId: id }, token);
        let flag = false
        let routeid = undefined
        req.data.map((item) => {
            if (item.status === OrderStatus.INPROCESS) {
                flag = true
            }
        })
        response?.data?.map((item) => {
            if (item.status === RouteStatus.INPROGESS) {
                flag = true
                routeid= item.id
            }
        })
        return {flag: flag, routeid: routeid}
    }

    const changeStatus = async (user, token) => {
        const response = await ChangeShipperStatus(user.id, ShipperStatus.Delivering, token)
        updateUser({ ...user, status: ShipperStatus.Delivering })
    }

    return (
        <View style={styles.container}>
            <BackGround />
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={Logo}
                />
                <View>
                    <Text style={{ ...styles.name, fontSize: 35, fontWeight: "700" }}>Local Shipper</Text>
                    <Text style={styles.name}>Drive</Text>
                </View>
            </View>

            <TextSpaceLine content={mail} />

            <OTPTextInput
                inputCount={4}
                handleTextChange={onChangeOtp}
                tintColor="#72AFD3"
                containerStyle={{ marginBottom: 20 }}
                textInputStyle={styles.otpInput}
            />

            <Text style={styles.emailText}>Nhập số gửi tới email của bạn</Text>

            <View style={styles.signup}>
                <Text style={{ ...styles.text, fontSize: 13 }}>
                    Chưa nhận được mã
                </Text>
                <TouchableOpacity
                // onPress={handleSignIn}
                >
                    <Text style={{ ...styles.signupText, fontSize: 13 }}>
                        Gửi lại
                    </Text>
                </TouchableOpacity >
            </View>

            <TouchableOpacity
                onPress={() => { checkOtp() }}
            >
                <View
                    style={styles.button}
                >
                    <Text
                        style={styles.signin}
                    >
                        Gửi
                    </Text>
                </View>
            </TouchableOpacity >

            <View style={styles.signup}>
                <Text style={styles.text}>
                    Chưa có tài khoản Local Shipper?
                </Text>
                <TouchableOpacity
                // onPress={handleSignIn}
                >
                    <Text style={styles.signupText}>
                        Đăng kí ngay
                    </Text>
                </TouchableOpacity >
            </View>

            {loading && <SpinnerLoading />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        height: HEIGHT,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        flexDirection: "row",
        // flexWrap: "wrap"
        alignItems: "center",
        marginBottom: HEIGHT * 0.03
    },
    logo: {
        width: WIDTH * 0.3,
        height: WIDTH * 0.3,
        resizeMode: "contain",
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 30,
    },
    name: {
        fontWeight: "500",
        fontSize: 25,
        textAlign: "right",
        marginLeft: 10,
        // fontFamily: "Loubag"
        // marginVertical: HEIGHT * 0.05,
    },

    button: {
        position: "relative",
        width: WIDTH * 0.8,
        borderRadius: 15,
        backgroundColor: "#24AB70",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#72AFD3"
    },
    signin: {
        textTransform: "uppercase",
        fontSize: 18,
        fontWeight: "700",
        color: "white",
        paddingVertical: HEIGHT * 0.02,
    },
    signup: {
        marginVertical: HEIGHT * 0.05,
        width: WIDTH,
        justifyContent: "center",
        flexDirection: "row",
    },
    text: {
        opacity: 0.5,
        fontWeight: "500",
        fontSize: 15,
    },
    emailText: {
        opacity: 0.5,
        transform: [{ translateY: HEIGHT * 0.03 }]
    },
    signupText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#72AFD3",
        textDecorationLine: "underline",
        marginLeft: 5,
    },
    otpInput: {
        width: WIDTH * 0.15,
        height: WIDTH * 0.15,
        borderColor: '#72AFD3',
        color: '#72AFD3',
        borderWidth: 1,
        borderRadius: 50,
        padding: 10,
        marginHorizontal: 15,
    }
});

export default VerifyOtp