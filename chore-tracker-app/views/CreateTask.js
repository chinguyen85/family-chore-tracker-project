import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../components/authContext';
import { postTask, getFamilyMembers } from '../services/app';

const CreateTask = ({ navigation }) => {
  const { state } = useContext(AuthContext);
  const token = state.userToken;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rewardValue, setRewardValue] = useState(0);
  // stroe different tasks
  const [selectedMemberIds, setSelectedMemberIds] = useState([]); 
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await getFamilyMembers(token);
        console.log('Family members response:', response); // debug
         
        setFamilyMembers(response.data || []);
      } catch (error) {
        console.error('Get family members failed', error); // debug
        setFamilyMembers([]);
      }
    }
    if (token) fetchMembers();
  }, [token]);

 

  const handleStarPress = (value) => { //press 3 stars
    setRewardValue(value);  //rewardValue = 3;
  };

  // checkbox: if it already has memberId, remove it; if not, add;
  const toggleMemberSelection = (memberId) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') { //ios is different
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    if (rewardValue === 0) {
      Alert.alert('Error', 'Please select a reward value');
      return;
    }
    if (selectedMemberIds.length === 0) {
      Alert.alert('Error', 'Please assign the task to at least one member');
      return;
    }

    try {
      //for loop every memberId in member array, post one by one
      for (const memberId of selectedMemberIds) {
      const taskObj = {
        title: title.trim(),
        description: description.trim(),
        rewardValue: rewardValue,
        dueDate: dueDate.toISOString(),
        assignTo: memberId
      };
      await postTask(taskObj, token);
    }

      Alert.alert('Success', 'Task created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() } // if success, go back to dashboard
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create task');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formCard}>
        <View style={styles.handle} />

        {/* Title Input */}
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#fff"
          value={title}
          onChangeText={setTitle}
        />

        {/* Description Input */}
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          placeholderTextColor="#fff"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
        />

        {/* Assign To - Checkbox List */}
        <View style={styles.assignContainer}>
          <Text style={styles.assignLabel}>Assign To</Text>
          {familyMembers.map((member) => {

            {/* check if selectedMemberIds has the user's id */}
           const isSelected = selectedMemberIds.includes(member.id);
            return (
              <TouchableOpacity
                key={member.id}
                style={styles.memberItem}
                onPress={() => toggleMemberSelection(member.id)}
              >
                <View style={styles.checkbox}>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>} 
                </View>
                <Text style={styles.memberName}>{member.fullName}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Reward Value Stars */}
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardLabel}>Reward Value</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                <Text style={styles.star}>{star <= rewardValue ? '★' : '☆'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Due Date Picker */}
        <TouchableOpacity style={styles.dateButton} onPress={toggleDatePicker}>
          <Text style={styles.dateButtonText}>
            {dueDate ? `Due Date: ${dueDate.toLocaleDateString()} ${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Due Date'}
          </Text>
          <Text style={styles.icon}>📅</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="datetime"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Add Task Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>ADD TASK</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formCard: {
    margin: 16,
    padding: 24,
    backgroundColor: '#F7AFA3',
    borderRadius: 16,
  },
  handle: {
    width: 140,
    height: 4,
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 14,
    color: '#fff',
  },
  textArea: {
    height: 160,
    textAlignVertical: 'top',
  },
  assignContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  assignLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  memberName: {
    color: '#fff',
    fontSize: 13,
  },
  rewardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  rewardLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  star: {
    fontSize: 36,
    color: '#FFD700',
  },
  dateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  icon: {
    fontSize: 25,
  },
  submitButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#F7AFA3',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateTask;