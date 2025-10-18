import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { getTaskByUser } from "../services/app";  
import { AuthContext } from "../components/authContext"; 

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const { state } = useContext(AuthContext);
  const token = state.userToken;

  useFocusEffect(
    useCallback (() => {
        async function fetchTasks() {
            try{
                const data = await getTaskByUser(token); 
                console.log('后端返回===========:', data);
                setTasks(data); // return json array
                } catch (error) {
                console.error("get user tasks failed", error);
            }
        }
        console.log('TaskList页面获得焦点');
        console.log('当前token:', token);
        if (token) fetchTasks();
    }, [token])
  )
  


  const renderStars = (count) => (
    <View style={{ flexDirection: "row" }}>
      {[...Array(3)].map((_, i) => (
        <Text
          key={i}
          style={{ color: i < count ? "#F7AFA3" : "#ccc", fontSize: 18 }}
        >
          ★
        </Text>
      ))}
    </View>
  );

  const toggleDone = (id) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done, failed: false } : task
      )
    );
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity
      style={styles.taskBox}
      onPress={() => toggleDone(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.checkCol}>
        {item.failed ? (
          <Text style={styles.failedBox}>✗</Text>
        ) : (
          <Text style={item.done ? styles.checkedBox : styles.uncheckedBox}>
            {item.done ? "✓" : ""}
          </Text>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.time, item.failed && styles.failedText]}>
          {item.time}
        </Text>
        <Text
          style={[
            styles.taskText,
            item.done && styles.doneText,
            item.failed && styles.failedText,
          ]}
        >
          {item.title}
        </Text>
      </View>
      {renderStars(item.stars)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Task</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginBottom: 20 }}
      />
      <TouchableOpacity style={styles.doneBtn}>
        <Text style={styles.doneBtnText}>DONE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
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
  checkCol: { width: 32, alignItems: "center", marginRight: 8 },
  checkedBox: {
    fontSize: 22,
    color: "#F7AFA3",
    borderWidth: 2,
    borderColor: "#F7AFA3",
    borderRadius: 6,
    width: 24,
    height: 24,
    textAlign: "center",
  },
  uncheckedBox: {
    fontSize: 22,
    color: "#ccc",
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 6,
    width: 24,
    height: 24,
    textAlign: "center",
  },
  failedBox: {
    fontSize: 22,
    color: "#F7AFA3",
    borderWidth: 2,
    borderColor: "#F7AFA3",
    borderRadius: 6,
    width: 24,
    height: 24,
    textAlign: "center",
  },
  time: { fontSize: 14, color: "#888" },
  taskText: { fontSize: 18, color: "#333" },
  doneText: { textDecorationLine: "line-through", color: "#aaa" },
  failedText: { textDecorationLine: "line-through", color: "#F7AFA3" },
  doneBtn: {
    backgroundColor: "#F7AFA3",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  doneBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
