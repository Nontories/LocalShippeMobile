import React, { useState, useEffect, useCallback, useContext } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, Dimensions, Text, TextInput, Image } from "react-native";
// import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import searchIcon from "../../assets/search.png"

import Filter from "../filter";

import { filteredOrders } from "../../util/util"
import { OrderStatus } from "../../constrant/OrderStatus";

const WIDTH = Dimensions.get("window").width

const SearchBar = (route) => {

    const [search, onChangeSearch] = useState("");
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const filterArray = route.filterArray
    const filterValue = route.filterValue
    const defaultFilterArray = route.searchArray
    const orders = route.orders

    useFocusEffect(
        useCallback(() => {
            setIsDropdownVisible(false)
        }, [])
    );

    useEffect(() => {
        setIsDropdownVisible(false)
    }, [filterValue])

    useEffect(() => {
        if (search === "") {
            route.setSearchArray(defaultFilterArray)
        } else {
            let newArray = filteredOrders(defaultFilterArray, search)
            route.setSearchArray(newArray)
        }
    }, [search])

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const hanldSearch = (text) => {
        onChangeSearch(text)
    }

    const checkWaitingOrder = (array, targetStatus) => {
        const count = array.reduce((accumulator, currentObject) => {
            if (currentObject.status === targetStatus) {
                return accumulator + 1;
            } else {
                return accumulator;
            }
        }, 0);
        return count;
    }

    // const Ring = ({ delay }) => {
    //     const ring = useSharedValue(0);
    //     useAnimatedStyle(() => {
    //         return {
    //             opacity: 0.8 - ring.value,
    //             transform: [
    //                 {
    //                     scale: interpolate(ring.value, [0, 1], [0, 4]),
    //                 },
    //             ]
    //         }
    //     })

    //     useEffect(() => {
    //         ring.value = withDelay(
    //             delay,
    //             withRepeat(
    //                 withTiming(1, {
    //                     duration: 4000,
    //                 }),
    //                 -1
    //             )
    //         )
    //     }, [])
    //     return <Animated.View style={styles.ring} />
    // }

    return (
        <View style={styles.search}>
            <View style={styles.inputView}>
                <Image
                    style={styles.icon}
                    source={searchIcon}
                    resizeMode="contain"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={hanldSearch}
                    value={search}
                    placeholder="Tìm Kiếm..."
                // editable={false}
                />
            </View>
            <View style={styles.filterContainer}>
                <Filter dropdown={isDropdownVisible} setDropdown={toggleDropdown} setFilterValue={route.setFilterValue} content={filterArray} />
                {checkWaitingOrder(orders, OrderStatus.WAITING) > 0 &&
                    <>
                        <View style={styles.redDot} />
                        {/* <Ring delay={0}/> */}
                    </>
                }
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    search: {
        width: WIDTH * 0.9,
        marginHorizontal: WIDTH * 0.05,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible"
    },
    inputView: {
        width: WIDTH * 0.65,
        height: (25 + 10 * 2),
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "rgba(0, 0, 0, 0.25)"
    },
    input: {
        width: WIDTH * 0.5,
        padding: 5
    },
    icon: {
        width: WIDTH * 0.1,
    },
    filterContainer: {
        position: "relative",
        // width: WIDTH * 0.13,
        // height: WIDTH * 0.13,
        // overflow: "hidden"
        // borderWidth: 1,
        marginLeft: 5
    },
    redDot: {
        position: "absolute",
        width: 12,
        height: 12,
        borderRadius: 50,
        backgroundColor: 'red',
        top: -5,
        right: -5,
        borderColor: 'red',
    },
    ring: {
        position: "absolute",
        width: 12,
        height: 12,
        borderRadius: 50,
        backgroundColor: 'red',
        top: -5,
        right: -5,
        borderColor: 'red',
    }
});

export default SearchBar