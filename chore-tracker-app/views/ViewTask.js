import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { AuthContext } from "../components/authContext";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAllTasks } from "../services/app";

const FamilyTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const { state } = useContext(AuthContext);
  const token = state.userToken;
  const navigation = useNavigation();

  // Fetch on focus so returning from TaskReview refreshes the list
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function fetchTasks() {
        try {
          const data = await getAllTasks(token);
          console.log('Backend return=====:', data);// debug
          if (isActive) setTasks(data);
        } catch (error) {
          console.error("get family tasks failed", error);
        }
      }
      if (token) fetchTasks();
      return () => { isActive = false; };
    }, [token])
  );

  // No status change in this view; handled elsewhere if needed

  const renderTask = ({ item }) => {
    const showDetail = () => {
      Alert.alert(
              'Task Details',
              `${item.description}\n`,
              [{ text: 'Close', style: 'cancel' }]
            );
    };

    const goToReview = () => {
      navigation.navigate('TaskReview', { task: item });
    };

    return (
      <TouchableOpacity
        style={styles.taskBox}
        onPress={goToReview}
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
        <View style={{ justifyContent: "center", flexDirection: "row" }}>
          {[...Array(item.rewardValue || 0)].map((_, i) => (
            <Text key={i} style={{ color: "#F7AFA3", fontSize: 18 }}>
              ★
            </Text>
          ))}
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
