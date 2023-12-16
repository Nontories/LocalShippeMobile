import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, TextInput, View, Image, ImageBackground, TouchableOpacity, Dimensions } from "react-native";
import { AsyncStorage } from 'react-native';

import { UserContext } from '../../context/UserContext';

import { signIn } from "../../api/auth"
import { ShipperByAcountId, ChangeShipperStatus } from "../../api/shipper"
import { GetOrder } from "../../api/order";
import { InteractRoute } from "../../api/route";

import locker from "../../assets/Lock.png"
import userpng from "../../assets/user.png"
import Logo from "../../assets/logo.png"

import { OrderStatus } from "../../constrant/OrderStatus"
import { ShipperStatus } from "../../constrant/ShipperStatus"
import { RouteStatus } from "../../constrant/RouteStatus";

import SpinnerLoading from "../../components/utils/SpinnerLoading";
import CustomToast from "../../components/utils/CustomToast";
import BackGround from "../../components/background/BackGound";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const Login = ({ navigation }) => {

    const [user, onChangeUser] = useState("");
    const [password, onChangePassword] = useState("");
    const [loading, setLoading] = useState(false)
    const { updateUser, updateToken } = useContext(UserContext);
    const showToast = CustomToast();

    const handleSignIn = async () => {
        setLoading(true)
        const data = {
            email: user,
            password: password
        }

        const response = await signIn(data);

        // console.log(response?.data?.accessToken);

        if (response.status === 200) {
            if (response.data.role == "shipper") {
                showToast("Thông Báo", "Bạn không phải là shipper", "warning");
            } else {
                try {
                    // await AsyncStorage.setItem('userToken', response.data.accessToken);
                    await getData(response.data)
                    setLoading(false)
                    navigation.navigate("BottomNav")
                } catch (error) {
                    console.error('Error saving data: ', error);
                }
            }
        } else {
            showToast("Thông Báo", "Mail hoặc mật khẩu không chính xác", "error");
            setLoading(false)
        }
    }

    const getData = async (data) => {
        await updateToken(data?.accessToken)
        const response = await ShipperByAcountId(data?.id, data?.accessToken);
        const status = await checkOrderInprocess(response.data[0].id, data?.accessToken)
        // console.log(data.id);
        // console.log(response.data[0]);
        // console.log(status);
        if (status) {
            await changeStatus(response.data[0], data?.accessToken)
        } else {
            await updateUser({ ...response.data[0]})
        }
    }

    const checkOrderInprocess = async (id, token) => {
        const req = await GetOrder({ shipperId: id, status: OrderStatus.INPROCESS }, token);
        const response = await InteractRoute({ shipperId: id, status: RouteStatus.INPROGESS }, token);
        let flag = false
        req.data.map((item) => {
            if (item.status === OrderStatus.INPROCESS) {
                flag = true
            }
        })
        response?.data?.map((item) => {
            if (item.status === RouteStatus.INPROGESS) {
                flag = true
            }
        })
        return flag
    }

    const changeStatus = async (user, token) => {
        const response = await ChangeShipperStatus(user.id, ShipperStatus.Delivering, token)
        await updateUser({ ...user, status: ShipperStatus.Delivering})
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

            <View style={styles.inputBar}>
                <Image
                    style={styles.locker}
                    source={userpng}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeUser}
                    value={user}
                    placeholder="Nhập email của bạn"
                />
            </View>

            <View style={styles.inputBar}>
                <Image
                    style={styles.locker}
                    source={locker}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePassword}
                    value={password}
                    placeholder="Mật khẩu"
                    secureTextEntry={true}
                />
            </View>


            <TouchableOpacity
                onPress={handleSignIn}
            >
                <View
                    style={styles.button}
                >
                    <Text
                        style={styles.signin}
                    >
                        Đăng Nhập
                    </Text>
                </View>
            </TouchableOpacity >

            <View style={styles.signup}>
                <Text style={styles.text}>
                    Chưa có tài khoản Local Shipper?
                </Text>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("Signup") }}
                >
                    <Text style={styles.signupText}>
                        Đăng kí ngay
                    </Text>
                </TouchableOpacity >
            </View>

            <TouchableOpacity
                onPress={() => { navigation.navigate("ForgotPassword") }}
            >
                <Text style={styles.signupText}>
                    Quên mật khẩu?
                </Text>
            </TouchableOpacity >

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
        marginBottom: HEIGHT * 0.1
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
    inputBar: {
        borderWidth: 1,
        borderRadius: 30,
        borderColor: "rgba(0, 0, 0, 0.3)",
        marginBottom: HEIGHT * 0.04,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
    },
    input: {
        width: WIDTH * 0.6,
        height: HEIGHT * 0.06,
        marginHorizontal: WIDTH * 0.1,
        padding: 10,
        opacity: 0.5,
        fontSize: 18,
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
    locker: {
        position: "absolute",
        width: WIDTH * 0.053,
        height: WIDTH * 0.06,
        left: WIDTH * 0.05
    },
    signin: {
        textTransform: "uppercase",
        fontSize: 18,
        fontWeight: "700",
        color: "white",
        paddingVertical: HEIGHT * 0.02,
    },
    signup: {
        marginVertical: HEIGHT * 0.04,
        width: WIDTH,
        justifyContent: "center",
        flexDirection: "row",
    },
    text: {
        opacity: 0.5,
        marginRight: 5,
        fontWeight: "500",
        fontSize: 15,
    },
    signupText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#72AFD3",
        textDecorationLine: "underline"
    }
});

export default Login