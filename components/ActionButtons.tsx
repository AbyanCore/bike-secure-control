import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ActionButton = {
    name: string;
    icon: string;
    color: string;
    handle: () => void;
  };

export const ActionButtons = ({actions} : {actions: ActionButton[]}) => {

  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, { backgroundColor: action.color }]}
          onPress={action.handle}
        >
          <Ionicons name={action.icon as any} size={24} color="#fff" />
          <Text style={styles.buttonText}>{action.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    marginTop: 5,
    fontWeight: 'bold',
  },
});