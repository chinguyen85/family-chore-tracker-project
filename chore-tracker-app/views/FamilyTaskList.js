import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { AuthContext } from "../components/authContext";
import { getAllTasks } from "../services/app";

const FamilyTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const { state } = useContext(AuthContext);
  const token = state.userToken;

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getAllTasks(token);
        setTasks(data);
      } catch (error) {
        console.error("get family tasks failed", error);
      }
    }
    if (token) fetchTasks();
  }, [token]);

  const renderTask = ({ item }) => {
    const showDetail = () => {
      Alert.alert("Task Details", `Description: ${item.description}\n`, [
        { text: "Close", style: "cancel" },
      ]);
    };

    return (
      <TouchableOpacity
        style={styles.taskBox}
        onLongPress={showDetail}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.time}>
            {item.dueDate
              ? new Date(item.dueDate).toLocaleString([], {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Text>
          <Text style={styles.taskText}>
            {item.title} {item.status ? `(${item.status})` : ""}
          </Text>
          <Text style={styles.desc}>{item.description}</Text>
        </View>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ color: "#F7AFA3", fontSize: 18 }}>
            {"★".repeat(Math.max(0, Math.min(5, item.rewardValue || 0)))}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Family Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F7AFA3",
    marginBottom: 16,
  },
  taskBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  time: { fontSize: 10, color: "#888" },
  taskText: { fontSize: 14, color: "#333" },
  desc: { fontSize: 14, color: "#666", marginBottom: 4 },
});

export default FamilyTaskList;
