import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, TextInput, View, Image, ImageBackground, TouchableOpacity, Dimensions } from "react-native";

import { UserContext } from '../../context/UserContext';

import { signUp } from "../../api/auth"

import locker from "../../assets/Lock.png"
import userpng from "../../assets/user.png"
import Logo from "../../assets/logo.png"
import nameInput from "../../assets/nameInput.png"
import mailInput from "../../assets/mailInput.png"
import phoneInput from "../../assets/phoneInput.png"


import SpinnerLoading from "../../components/utils/SpinnerLoading";
import BackGround from "../../components/background/BackGound";
import TextSpaceLine from "../../components/utils/TextSpaceLine"
import CustomToast from "../../components/utils/CustomToast";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const Signup = ({ navigation }) => {

    const [user, onChangeUser] = useState("");
    const [mail, onChangeMail] = useState("");
    const [phone, onChangePhone] = useState("");
    const [password, onChangePassword] = useState("");
    const [repass, onChangeRepass] = useState("");
    const [mailMalid, setMailMalid] = useState(false);
    const [loading, setLoading] = useState(false)
    const { updateUser, updateToken } = useContext(UserContext);
    const showToast = CustomToast();


    const handleSignUp = async () => {
        if (
            user !== "" ||
            mail !== "" ||
            phone !== "" ||
            password !== "" ||
            repass !== ""
        ) {
            // if (mailMalid) {
                if (password === repass) {
                    setLoading(true)
                    const data = {
                        fullName: user,
                        email: mail,
                        phone: phone,
                        password: password,
                        confirmPassword: repass,
                        roleId: 5
                    }
                    const response = await signUp(data)
                    if (response?.status === 200) {
                        showToast("Thông Báo", "Đăng ký thành công", "success");
                        navigation.navigate("Login")
                    } else {
                        console.log(response);
                        showToast("Thông Báo", `Đăng ký thất bại ${response?.data}`, "error");
                    }
                    setLoading(false)
                } else {
                    showToast("Thông Báo", "Mật khẩu không khớp", "warning");
                }
            // } else {
            //     showToast("Thông Báo", "Mail không hợp lệ", "warning");
            // }
        } else {
            showToast("Thông Báo", "Chưa điền hết thông tin", "warning");
        }
    }

    const checkMail = async (mail) => {
        const response = await checkMail(mail)
        if (response?.data === "undeliverable") {
            setMailMalid(false)
        } else {
            setMailMalid(true)
        }
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

            <TextSpaceLine content={"Đăng kí"} />

            <View style={styles.inputBar}>
                <Image
                    style={styles.locker}
                    source={nameInput}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeUser}
                    value={user}
                    placeholder="Họ và tên"
                />
            </View>

            <View style={styles.inputBar}>
                <Image
                    style={styles.locker}
                    source={mailInput}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeMail}
                    // onBlur={() => { checkMail(mail) }}
                    value={mail}
                    placeholder="Nhập email của bạn"
                />
            </View>

            <View style={styles.inputBar}>
                <Image
                    style={styles.locker}
                    source={phoneInput}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePhone}
                    value={phone}
                    placeholder="Số điện thoại"
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

            <View style={styles.inputBar}>
                <Image
                    style={styles.locker}
                    source={locker}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeRepass}
                    value={repass}
                    placeholder="Xác nhận mật khẩu"
                    secureTextEntry={true}
                />
            </View>


            <TouchableOpacity
                onPress={handleSignUp}
            >
                <View
                    style={styles.button}
                >
                    <Text
                        style={styles.signin}
                    >
                        Đăng Ký
                    </Text>
                </View>
            </TouchableOpacity >

            <View style={styles.signup}>
                <Text style={styles.text}>
                    Đã có tài khoản Local Shipper?
                </Text>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("Login") }}
                >
                    <Text style={styles.signupText}>
                        Quay về đăng nhập
                    </Text>
                </TouchableOpacity >
            </View>

            <TouchableOpacity
            // onPress={handleSignIn}
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
        marginBottom: 15,
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
        marginBottom: HEIGHT * 0.02,
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

export default Signup