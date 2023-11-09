/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView} from 'react-native';

import HomePage from './Home';
import TodoAPP from './TodoApp';

function App(): JSX.Element {
  return (
    <SafeAreaView>
      {/* <HomePage /> */}
      <TodoAPP />
    </SafeAreaView>
  );
}

export default App;
