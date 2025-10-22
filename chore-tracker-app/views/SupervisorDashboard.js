import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/authContext";
import { getFamilyMembers } from "../services/app";

const ParentHome = () => {
  const navigation = useNavigation();
  const { state } = useContext(AuthContext);
  const token = state.userToken;
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const result = await getFamilyMembers(token);
        const filteredMembers = (result.data || []).filter(
          (m) => m.role !== "Supervisor"
        );
        setMembers(filteredMembers);
      } catch (error) {
        console.error("Failed to fetch family members:", error);
      }
    };
    if (token) fetchMembers();
  }, [token]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.header}>Family Members</Text>
        {members.map((item, index) => (
          <Text key={index} style={styles.memberName}>
            {item.fullName}
          </Text>
        ))}
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("CreateTask")}
        >
          <Text style={styles.btnText}>Create Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("FamilyTaskList")}
        >
          <Text style={styles.btnText}>All Family Tasks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  topSection: { alignItems: "center", paddingTop: 100 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F7AFA3",
    marginBottom: 12,
  },
  memberName: {
    fontSize: 16,
    color: "#333",
    padding: 8,
    backgroundColor: "#fafafa",
    marginBottom: 6,
    borderRadius: 6,
    width: 200,
  },
  bottomSection: { alignItems: "center", marginTop: 200 },
  btn: {
    backgroundColor: "#F7AFA3",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    width: 200,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default ParentHome;
