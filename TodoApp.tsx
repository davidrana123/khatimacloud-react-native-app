import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, FlatList} from 'react-native';
import axios from 'axios';

const TodoApp = () => {
  const schemaStr = {
    taskName: '',
    taskDesc: '',
    priority: '',
    createdDate: new Date(),
    subTask: '',
    taskComment: '',
  }
  const usersUrl = 'http://192.168.1.9:8080/app';
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState(schemaStr);
  const [demoData, setDemoData] = useState({
    cat: 'i am app',
    desc: 'from react native',
  });

  console.log('newTodo',newTodo)

  useEffect(() => {
    const getAllData = async () => {
      try {
        const res = await axios.get(`${usersUrl}`);
        console.log('res',res.data)
        setTodos(res.data);
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
      setNewTodo({cat: '', desc: ''});
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

  return (
    <View>
      <Text>Todo List</Text>
      <FlatList
  data={todos}
  keyExtractor={todo => todo._id.toString()} // Use toString() to ensure it's a string
  renderItem={({ item }) => (
    <View>
      <Text>Name:- {item?.taskName}</Text>
      <Text>Description:- {item?.taskDesc}</Text>
      <Text>Sub Task:- {item?.subTask}</Text>
      <Button title="Delete" onPress={() => deleteTodo(item)} />
    </View>
  )}
/>
      <TextInput
        name="taskName"
        placeholder="Task Name"
        value={newTodo.cat}
        onChangeText={value => handalTextField('taskName', value)}
      />
      <TextInput
        name="taskDesc"
        placeholder="Description"
        value={newTodo.cat}
        onChangeText={value => handalTextField('taskDesc', value)}
      />
      <TextInput
        name="subTask"
        placeholder="Add sub-task"
        value={newTodo.cat}
        onChangeText={value => handalTextField('subTask', value)}
      />
      <Button title="Add Todo" onPress={addTodo} />
    </View>
  );
};

export default TodoApp;
