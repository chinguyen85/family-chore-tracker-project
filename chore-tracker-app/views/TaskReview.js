import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/authContext";
import { updateTaskStatus, deleteTask } from "../services/app";

//"uploads\\proofs\\proofImage-1761004989836.jpg"
// http://123.456:3000/uploads/proofs/proofImage-1761004989836.jpg

// const BASE_URL = "http://10.18.190.21:3000";
const BASE_URL = "http://192.168.0.126:3000";

const getImageUrl = (path) => {
  if (!path) return null;
  const rightPath = path.replace(/\\/g, "/"); // global
  return `${BASE_URL}/${rightPath}`;
};

const TaskReview = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { state } = useContext(AuthContext);
  const token = state.userToken;

  const task = route.params?.task; //return task or undefined

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No task data provided.</Text>
      </View>
    );
  }

  const handleChangeStatus = async (status) => {
    try {
      await updateTaskStatus(task.id, status, token);
      Alert.alert("Success", `Task marked as ${status}.`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update task status");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteTask(task.id, token);
            Alert.alert("Deleted", "Task has been deleted.", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            Alert.alert("Error", error.message || "Failed to delete task");
          }
        },
      },
    ]);
  };

  const renderStars = (count) => (
    <View style={{ flexDirection: "row" }}>
      {[...Array(count || 0)].map((_, i) => (
        <Text key={i} style={{ color: "#F7AFA3", fontSize: 18 }}>
          ★
        </Text>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Task Review</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.value}>{task.title}</Text>

        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{task.status}</Text>

        <Text style={styles.label}>Reward</Text>
        {renderStars(task.rewardValue)}

        <Text style={styles.label}>Due</Text>
        <Text style={styles.value}>
          {task.dueDate
            ? new Date(task.dueDate).toLocaleString([], {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}
        </Text>

        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{task.description}</Text>

        {task.proofImage ? (
          <>
            <Text style={styles.label}>Proof Image</Text>
            {console.log(getImageUrl(task.proofImage))}
            <Image
              source={{ uri: getImageUrl(task.proofImage) }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 8,
                marginVertical: 8,
              }}
              resizeMode="cover"
            />
          </>
        ) : null}

        {task.proofNotes ? (
          <>
            <Text style={styles.label}>Proof Notes</Text>
            <Text style={styles.value}>{task.proofNotes}</Text>
          </>
        ) : null}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => handleChangeStatus("Completed")}
        >
          <Text style={styles.btnText}>Mark Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => handleChangeStatus("Rejected")}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDelete} onPress={handleDelete}>
          <Text style={styles.btnDeleteText}>Delete Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F7AFA3",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: { color: "#999", marginTop: 10, fontSize: 12 },
  value: { color: "#333", fontSize: 14 },
  actions: { marginTop: 20 },
  btn: {
    backgroundColor: "#F7AFA3",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  btnDelete: {
    backgroundColor: "#ff6b6b",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  btnDeleteText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  errorText: { color: "#F00" },
});

export default TaskReview;
