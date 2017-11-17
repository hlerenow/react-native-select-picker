/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';



import SelectPicker from './SelectPicker';
import DatePicker from './DatePicker.js';


export default class App extends Component<{}> {

  constructor (props) {
    super(props);
    this.state = {
      date: {},
      picker: ''
    }
  }

  componentDidMount () {
    this.DatePicker.show();
  }

  valChange  = (item, index) => {
    console.log('值改变', item, index);
    this.setState({
      picker: item
    })
  }

  dateValChange = (year,month, day, hour, minute) => {
    console.log({year,month, day, hour, minute});
    var dateObj = {year,month, day, hour, minute};
    this.setState({
      date:dateObj
    });
  }

  render() {
    var {date, picker} = this.state;
    console.log(this.state, 111);
    var date = JSON.stringify(date);

    return (
      <View style={styles.container}>
        <Text>
          date: {date}
        </Text>
        <Text>
          picker: {picker}
        </Text>
        <TouchableOpacity style={{backgroundColor: 'orange', padding: 10}} onPress={() => this.DatePicker.show()}>
          <Text>open DatePicker</Text>
        </TouchableOpacity>
        <SelectPicker 
          onValueChange={this.valChange}
        />
        <DatePicker ref={(ref) => this.DatePicker = ref}
          ok= {this.dateValChange}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
