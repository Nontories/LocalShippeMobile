import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, Modal } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import { UserContext } from '../context/UserContext';

import { InteractOrder } from "../api/shipper"

import { OrderStatus, OrderStatusText } from "../constrant/OrderStatus"

import { getKeyByValue } from "../util/util"

import BackHeader from "../components/header/BackHeader";
import SpaceLine from "../components/utils/SpaceLine";
import ComfirmModal from "../components/utils/ComfirmModal";

import locationIcon from "../assets/Location.png"
import close from "../assets/close.png"

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const RouteDetail = ({ route, navigation }) => {
    return (
        <ScrollView style={styles.container}>
            <Text>
                route Detail
            </Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    
});

export default RouteDetail