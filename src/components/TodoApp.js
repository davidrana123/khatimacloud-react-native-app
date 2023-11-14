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
  Modal,
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
  const [editingTodo, setEditingTodo] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentEditTodo, setCurrentEditTodo] = useState(schemaStr);
  const [isAddModalVisible, setAddModalVisible] = useState(false);


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

  const editTodo = async (id, user) => {
    const response = await axios.put(`${usersUrl}/${id}`, user);
    console.log('response', response);
  };


  const openEditModal = todo => {
    setEditingTodo(todo);
    setCurrentEditTodo(todo); // Set the newTodo state to the selected todo for editing
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setEditingTodo(null);
    setModalVisible(false);
  };


  const saveEditedTodo = async () => {
    await editTodo(editingTodo._id, currentEditTodo);
    const res = await axios.get(`${usersUrl}`);
    setTodos(res.data);
    setModalVisible(false);
  };

  const handalTextField = (name, value) => {
    setNewTodo({...newTodo, [name]: value});
  };

  const handalTextFieldEdit = (name, value) => {
    setCurrentEditTodo({...currentEditTodo, [name]: value});
  };

  const isEmptyArray = () => {
    if (todos.length === 0) {
      return true;
    } else {
      return false;
    }
  };

    const openAddModal = () => {
    setAddModalVisible(true);
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
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
              <TouchableOpacity
              onPress={() => openEditModal(item)}
              style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Todo</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isAddModalVisible}
          onRequestClose={closeAddModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalContainer}>
              <Text style={styles.header}>Add New Todo</Text>
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  name="taskName"
                  placeholder="Task Name"
                  placeholderTextColor="black"
                  value={newTodo.taskName}
                  onChangeText={(value) => handalTextField('taskName', value)}
                />
                <TextInput
                  style={styles.input}
                  name="taskDesc"
                  placeholder="Description"
                  placeholderTextColor="black"
                  value={newTodo.taskDesc}
                  onChangeText={(value) => handalTextField('taskDesc', value)}
                />
                <TextInput
                  style={styles.input}
                  name="subTask"
                  placeholder="Add sub-task"
                  placeholderTextColor="black"
                  value={newTodo.subTask}
                  onChangeText={(value) => handalTextField('subTask', value)}
                />
                <TouchableOpacity
                  onPress={() => {
                    addTodo();
                    closeAddModal();
                  }}
                  style={styles.addButton}>
                  <Text style={styles.addButtonTextNew}>Add Todo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={closeAddModal}
                  style={styles.editButton}>
                  <Text style={styles.editButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>



      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeEditModal}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            name="taskName"
            placeholder="Task Name"
            placeholderTextColor="black"
            value={currentEditTodo.taskName}
            onChangeText={value => handalTextFieldEdit('taskName', value)}
          />
          <TextInput
            style={styles.input}
            name="taskDesc"
            placeholder="Description"
            placeholderTextColor="black"
            value={currentEditTodo.taskDesc}
            onChangeText={value => handalTextFieldEdit('taskDesc', value)}
          />
          <TextInput
            style={styles.input}
            name="subTask"
            placeholder="Add sub-task"
            placeholderTextColor="black"
            value={currentEditTodo.subTask}
            onChangeText={value => handalTextFieldEdit('subTask', value)}
          />
          <TouchableOpacity onPress={saveEditedTodo} style={styles.editButton}>
            <Text style={styles.editButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeEditModal} style={styles.editButton}>
            <Text style={styles.editButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    color: colors.black,
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  addButtonTextNew: {
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
  editButton: {
    backgroundColor: colors.orange, // Choose a color for your edit button
    padding: 8,
    borderRadius: 3,
    marginTop: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
    margin: 20,
    borderWidth: 2, // Add this line for the border
    borderColor: colors.black, // Add this line for the border color
  },
  cancelButton: {
    borderColor: colors.black,
    borderWidth: 2,
  },
});

export default TodoApp;
