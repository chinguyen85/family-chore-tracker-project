import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { AuthContext } from "../components/authContext";
import { getAllTasks, updateTaskStatus } from "../services/app";

const FamilyTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const { state } = useContext(AuthContext);
  const token = state.userToken;

  // Modal for pass or reject a task
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleLongPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  }

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

  const handleStatusChange = async (status) => {
    try {
      await updateTaskStatus(selectedTask.id, status, token);
      setModalVisible(false);
      // get all tasks again
      const data = await getAllTasks(token);
      setTasks(data);
    } catch (error) {
      Alert.alert('error', error.message || 'update task status failed');
    }
  };

  const renderTask = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.taskBox}
        onLongPress={() => handleLongPress(item)}
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
      <Modal visible={modalVisible} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {selectedTask && (
              <>
                <Text style={styles.modalTitle}>Task Details</Text>
                <Text style={styles.modalDesc}>{selectedTask.description}</Text>
                {selectedTask.proofImage && (
                  <Text style={styles.modalDesc}>Image{selectedTask.proofImage}</Text>
                )}
                {selectedTask.proofNotes && (
                  <Text style={styles.modalDesc}>Note: {selectedTask.proofNotes}</Text>
                )}
                <View style={styles.modalButtonRow}>
                  <TouchableOpacity onPress={() => handleStatusChange('Completed')} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Complete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleStatusChange('Rejected')} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  // new modal 
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099', // for cover
  },
  modalBox: {
    backgroundColor: "#eee",
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    color: "#2c2c2cff",
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  modalDesc: {
    color: "#666",
    marginBottom: 8,
  },
  modalButton: {
    backgroundColor: '#f9ab9eff',
    padding: 5,
    marginBottom: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtonRow: {
    marginTop: 20,
  },
});

export default FamilyTaskList;
