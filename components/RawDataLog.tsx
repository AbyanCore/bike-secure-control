import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface RawDataLogProps {
  logs: string[];
}

export const RawDataLog = ({ logs }: RawDataLogProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Raw Data Log</Text>
      <ScrollView style={styles.logContainer}>
        {logs.length === 0 ? (
          <Text style={styles.emptyText}>No logs available</Text>
        ) : (
          logs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logContainer: {
    height: 200,
  },
  logText: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 5,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#666',
  },
});