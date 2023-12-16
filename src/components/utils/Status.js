import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from "react-native";

import { ChangeShipperStatus } from "../../api/shipper";

import { ShipperStatus, ShipperStatusText } from "../../constrant/ShipperStatus"

import { UserContext } from '../../context/UserContext';

import statusArrow from "../../assets/status_arrow.png"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const Status = ({navigation}) => {

    const { user, updateUser, token } = useContext(UserContext);
    const [status, setStatus] = useState(user?.status)
    const [toggle, setToggle] = useState(false)

    useEffect(() => {
        setStatus(user?.status)
    }, [user?.status]);

    const handleToggle = () => {
        setToggle(true)
        setTimeout(() => {
            setToggle(false)
        }, 3000);
    }

    const color = (status) => {
        switch (status) {
            case ShipperStatus.Online:
                return "#80D828"

            case ShipperStatus.Offline:
                return "#DE0404"

            case ShipperStatus.Delivering:
                return "#EBFF00"
            default:
                break;
        }
    }

    const getStatus = (status) => {
        switch (status) {
            case ShipperStatus.Offline:
                return ShipperStatusText.Offline

            case ShipperStatus.Online:
                return ShipperStatusText.Online

            case ShipperStatus.Delivering:
                return ShipperStatusText.Delivering
            default:
                break;
        }
    }

    const changeStatus = (status) => {
        const data = { ...user, status: status }
        updateUser(data)
    }

    const handleStatus = async () => {
        if (user.status === ShipperStatus.Online) {
            const response = await ChangeShipperStatus(user.id, ShipperStatus.Offline, token)
            if (response.status === 200) {
                changeStatus(ShipperStatus.Offline)
                navigation?.navigate("Order")
            } else {
                // console.log(response.status);
            }
        } else if (user.status === ShipperStatus.Offline) {
            const response = await ChangeShipperStatus(user.id, ShipperStatus.Online, token)
            if (response.status === 200) {
                changeStatus(ShipperStatus.Online)
                console.log("change to online");
            } else {
                console.log(response.status);
            }
        }
    }

    return (
        <View style={[styles.container, !toggle && styles.deactive]}>
            {toggle ?
                <>
                    <View style={styles.statusBar}>
                        <View style={{ ...styles.dot, backgroundColor: color(status) }} />
                        <Text style={styles.statusName}>
                            {getStatus(status)}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.statusButton,
                            user.status !== ShipperStatus.Offline && styles.activeColor
                        ]}
                        onPress={() => {
                            handleStatus()
                        }}
                        disabled={user.status === ShipperStatus.Delivering}
                    >
                        <View style={user.status !== ShipperStatus.Offline ? styles.online : styles.offline}>
                            <View style={styles.statusCircle} />
                        </View>
                    </TouchableOpacity>
                </>
                :
                <TouchableOpacity
                    style={styles.hiddenStatusBar}
                    onPress={() => { handleToggle() }}
                >
                    <View style={{ ...styles.dot, backgroundColor: color(status) }} />
                    <Image
                        source={statusArrow}
                    />
                </TouchableOpacity>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: WIDTH * 0.8,
        right: WIDTH * 0.05,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: "#f5f5f5",
    },
    statusBar: {
        backgroundColor: "rgba(194, 201, 205, 0.25)",
        padding: 4,
        paddingHorizontal: 8,
        borderRadius: 15,
        marginRight: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    hiddenStatusBar: {
        backgroundColor: "rgba(194, 201, 205, 0.25)",
        padding: 4,
        paddingHorizontal: 8,
        borderRadius: 15,
        marginRight: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    dot: {
        width: WIDTH * 0.045,
        height: WIDTH * 0.045,
        borderRadius: 20,
    },
    statusName: {
        fontWeight: "400",
        fontSize: 13,
        textShadowColor: 'black',
        textShadowRadius: 1,
        marginLeft: 5,
    },
    statusButton: {
        position: "relative",
        width: WIDTH * 0.1,
        height: WIDTH * 0.05,
        // borderWidth: 1,
        borderRadius: 25,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.15)"
    },
    statusCircle: {
        width: WIDTH * 0.05,
        height: WIDTH * 0.05,
        borderWidth: 1,
        borderRadius: 25,
        borderColor: "rgba(0, 0, 0, 0.5)",
        backgroundColor: "white",
    },
    offline: {
        position: "absolute",
        left: 0,
    },
    online: {
        position: "absolute",
        right: 0,
    },
    activeColor: {
        backgroundColor: ("#8be78b")
    },
    deactive: {
        width: WIDTH * 0.15,
    }

});

export default Status