import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FamilyManagement = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ING</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
});

export default FamilyManagement;