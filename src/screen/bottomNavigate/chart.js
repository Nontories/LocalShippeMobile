import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { LineChart, PieChart } from 'react-native-chart-kit';

import { UserContext } from '../../context/UserContext';

import { GetCancelRate, GetCompleteRate, GetRate } from "../../api/shipper";

import BackHeader from "../../components/header/BackHeader";
import SpaceLine from "../../components/utils/SpaceLine";
import SpinnerLoading from "../../components/utils/SpinnerLoading";
import { ShipperStatus } from "../../constrant/ShipperStatus";
import BackGroundOffline from "../../components/background/BackGroundOffline";

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            data: [0, 45, 28, 80, 99, 43],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        },
    ],
};

const Chart = ({ navigation }) => {

    const [loading, setLoading] = useState(true)
    const [rate, setRate] = useState({ rate: 0, cancel: 0, complete: 0 })
    const { user, token } = useContext(UserContext);

    useFocusEffect(
        React.useCallback(() => {
            loadData()
        }, [])
    );

    const loadData = async () => {
        try {
            setLoading(true)
            const { day, month, year } = getCurrentDateAndYear();
            const cancelReq = await GetCancelRate(user?.id, token)
            const completeReq = await GetCompleteRate(user?.id, token)
            const rateReq = await GetRate(user?.id, token)

            if (cancelReq?.status === 200 || completeReq?.status === 200 || rateReq?.status === 200) {
                setRate({ rate: rateReq?.data ? rateReq?.data[0]?.ratingValue : 0, cancel: cancelReq?.data ? cancelReq?.data : 0, complete: completeReq?.data ? completeReq?.data : 0 })
            } else {
                console.log("cancelReq ", cancelReq);
                console.log("completeReq ", completeReq);
            }

        } catch (error) {
            console.log('Error when load order list:', error.message);
        } finally {
            setLoading(false)
        }
    };

    const getCurrentDateAndYear = () => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        return {
            day,
            month,
            year
        };
    };

    return (
        <>
            <BackHeader content={"Thống Kê"} navigation={navigation} />
            {
                loading ?
                    <SpinnerLoading />
                    :
                    user?.status !== ShipperStatus.Offline ?
                        <ScrollView style={styles.container}>
                            <View style={styles.general}>
                                <View style={styles.generalContent}>
                                    <Text style={styles.rate}>
                                        Mức đánh giá
                                    </Text>
                                    <Text style={styles.rateValue}>
                                        {rate?.rate?.toFixed(2)}
                                    </Text>
                                </View>
                                <View style={styles.generalContent}>
                                    <Text style={styles.rate}>
                                        Tỉ lệ chấp nhận
                                    </Text>
                                    <Text style={styles.rateValue}>
                                        {rate?.complete?.toFixed()}%
                                    </Text>
                                </View>
                                <View style={styles.generalContent}>
                                    <Text style={styles.rate}>
                                        Tỉ lệ hủy đơn
                                    </Text>
                                    <Text style={styles.rateValue}>
                                        {rate?.cancel?.toFixed()}%
                                    </Text>
                                </View>
                            </View>

                            <SpaceLine />


                        </ScrollView>
                        :
                        <BackGroundOffline />
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: "#f5f5f5"
    },
    general: {
        width: WIDTH * 0.9,
        padding: 12,
        paddingVertical: 18,
        borderRadius: 10,
        marginHorizontal: WIDTH * 0.05,
        marginVertical: 10,
        backgroundColor: "#72AFD3",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    generalContent: {
        justifyContent: "center",
        alignItems: "center"
    },
    rate: {
        color: "white"
    },
    rateValue: {
        paddingVertical: 5,
        color: "white",
        fontSize: 20,
        fontWeight: "600"
    },
});

export default Chart