


import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';

const ParentHome = () => {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("CreateTask")}> 
				<Text style={styles.btnText}>创建任务</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("FamilyTaskList")}> 
				<Text style={styles.btnText}>查看所有任务</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
	btn: { backgroundColor: "#F7AFA3", borderRadius: 8, padding: 16, alignItems: "center", marginBottom: 16, width: 200 },
	btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default ParentHome;