import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import {colors} from '../constants/theme';

const TodoApp = () => {
  const schemaStr = {
    taskName: '',
    taskDesc: '',
    priority: '',
    createdDate: new Date(),
    subTask: '',
    taskComment: '',
  };
  const usersUrl = 'https://track-your-item-backend-server.onrender.com/app';
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState(schemaStr);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const res = await axios.get(`${usersUrl}`);
        setTodos(res.data);
        Keyboard.dismiss();
        isEmptyArray();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    };
    getAllData();
  }, []);

  const addTodo = async () => {
    try {
      const response = await axios.post(`${usersUrl}/add`, newTodo);
      if (response) {
        const res = await axios.get(`${usersUrl}`);
        setTodos(res.data);
      }
      setNewTodo(schemaStr);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async id => {
    const res = await axios.delete(`${usersUrl}/${id._id}`);
    if (res) {
      const res = await axios.get(`${usersUrl}`);
      setTodos(res.data);
    }
  };

  const handalTextField = (name, value) => {
    setNewTodo({...newTodo, [name]: value});
  };

  const isEmptyArray = () => {
    if (todos.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Todo List</Text>
        {isEmptyArray() && <Text style={styles.subHeading}>No Todos</Text>}
        <FlatList
          data={todos}
          keyExtractor={todo => todo._id.toString()}
          renderItem={({item}) => (
            <View style={styles.todoItem}>
              <Text style={styles.title}>Name: {item?.taskName}</Text>
              <Text style={styles.title}>Description: {item?.taskDesc}</Text>
              <Text style={styles.title}>Sub Task: {item?.subTask}</Text>
              <TouchableOpacity
                onPress={() => deleteTodo(item)}
                style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            name="taskName"
            placeholder="Task Name"
            value={newTodo.taskName}
            onChangeText={value => handalTextField('taskName', value)}
          />
          <TextInput
            style={styles.input}
            name="taskDesc"
            placeholder="Description"
            value={newTodo.taskDesc}
            onChangeText={value => handalTextField('taskDesc', value)}
          />
          <TextInput
            style={styles.input}
            name="subTask"
            placeholder="Add sub-task"
            value={newTodo.subTask}
            onChangeText={value => handalTextField('subTask', value)}
          />
          <TouchableOpacity onPress={addTodo} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Todo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
    padding: 20,
  },
  header: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  todoItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  title: {
    color: colors.black,
    marginBottom: 5,
  },
  formContainer: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
  },
  input: {
    backgroundColor: colors.white,
    marginVertical: 5,
    padding: 10,
    color: colors.black,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: colors.red,
    padding: 8,
    borderRadius: 3,
    marginTop: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  subHeading: {
    color: colors.white,
  },
});

export default TodoApp;
