import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { getTaskByUser, updateTaskStatus } from "../services/app";  
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
                console.log('backend return===============:', data);// debug
                setTasks(data); // return json array
                } catch (error) {
                console.error("get user tasks failed", error);
            }
        }
        console.log('TaskList got foucus');//
        console.log('token now:', token);//
        if (token) fetchTasks();
    }, [token])
  )
  


  const renderStars = (count) => {
    return (
      <View style={{ flexDirection: "row" }}>
        {[...Array(count)].map((_, i) => (
          <Text key={i} style={{ color: "#F7AFA3", fontSize: 18 }}>
            ★
          </Text>
        ))}
      </View>
    );
  };

  const toggleDone = async (id) => {
    try {
      if (!token) return;
      
      // Find current task
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      // Toggle between For_Approval and Pending
      const newStatus = task.status === 'For_Approval' ? 'Pending' : 'For_Approval';
      
      const updated = await updateTaskStatus(id, newStatus, token);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: updated.status } : t)));
    } catch (error) {
      console.error('update status failed', error);
    }
  };

  const renderTask = ({ item }) => {
    // Map status to UI states
    const isChecked = item.status === 'For_Approval' || item.status === 'Completed';
    const isRejected = item.status === 'Rejected';
    const isPending = item.status === 'Pending' || !item.status;

    const showDetail = () => {
      console.log('长按触发，弹窗应该出现');// debug
      
      Alert.alert(
        'Task Details',
        `Description: ${item.description}\n`,
        [{ text: 'Close', style: 'cancel' }]
      );
    };

    return (
      <TouchableOpacity
        style={styles.taskBox}
        onPress={() => toggleDone(item.id)}
        onLongPress={showDetail}
        activeOpacity={0.7}
      >
        <View style={styles.checkCol}>
          {isRejected ? (
            <Text style={styles.failedBox}>✗</Text>
          ) : (
            <Text style={styles.checkedBox}>
              {isChecked ? "✓" : ""}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.time, isRejected && styles.failedText]}>
            {item.dueDate
              ? new Date(item.dueDate).toLocaleString([], {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : ''
            }
          </Text>
          <Text
            style={[
              styles.taskText,
              isChecked && styles.doneText,
              isRejected && styles.failedText,
            ]}
          >
            {item.title} {item.status ? `(${item.status})` : ''}
          </Text>
        </View>
        {renderStars(item.rewardValue || 0)}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Task</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={{ marginBottom: 20 }}
      />
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
  taskBox: { //per task
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  checkCol: { width: 18, alignItems: "center", marginRight: 8 },
  checkedBox: {  // ✓
    fontSize: 12,
    color: "#F7AFA3",
    borderWidth: 2,
    borderColor: "#F7AFA3",
    borderRadius: 6,
    width: 24,
    height: 24,
    textAlign: "center",
  },
  failedBox: {
    fontSize: 12, //x
    color: "#F7AFA3",
    borderWidth: 2,
    borderColor: "#F7AFA3",
    borderRadius: 6,
    width: 24,
    height: 24,
    textAlign: "center",
  },
  time: { fontSize: 10, color: "#888" },
  taskText: { fontSize: 14, color: "#333" },
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
