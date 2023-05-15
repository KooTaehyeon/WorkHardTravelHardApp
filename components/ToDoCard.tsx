import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { theme } from '../colors';
import { Fontisto } from '@expo/vector-icons';
const ToDoCard = (props: any) => {
  const [edit, setEdit] = useState(false);
  const [editText, setEditText] = useState(props.toDos[props.id].text);
  const editTodo = () => {
    setEdit(!edit);
    console.log('실행');
  };
  const onChangeText = (payload: string) => {
    // 인풋 이벤트
    setEditText(payload);
  };
  const onSubmitEditing = () => {
    setEdit(!edit);
    const newToDo = {
      ...props.toDos,
      [props.id]: {
        text: editText,
        work: props.toDos[props.id].work,
        check: props.toDos[props.id]?.check,
      },
    };
    props.setToDos(newToDo);
  };
  const [isCheck, setIsCheck] = useState<boolean>(false); //체크박스

  useEffect(() => {
    // 체크박스 확인 유무
    if (props.toDos[props.id]?.check) {
      setIsCheck(props.toDos[props.id].check);
    }
  }, []);
  useEffect(() => {
    props.checkOn(props.toDos[props.id], isCheck, props.id);
  }, [isCheck]);
  return (
    <View style={styles.toDo}>
      <Checkbox
        value={isCheck}
        onValueChange={setIsCheck}
        // style={styles.checkbox}
      />
      <Text
        style={{
          ...styles.toDoText,
          display: !edit ? 'flex' : 'none',
          textDecorationLine: props.toDos[props.id]?.check
            ? 'line-through'
            : 'none',
        }}
        onPress={editTodo}
      >
        {props.toDos[props.id].text}
      </Text>
      <TextInput
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={'done'} // 전송버튼
        style={{ ...styles.input, display: !edit ? 'none' : 'flex' }}
        defaultValue={editText}
      />
      <TouchableOpacity onPress={() => props.delete(props.id)}>
        <Fontisto name='trash' size={18} color={'grey'} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 0.9,
    marginVertical: 20,
    fontSize: 14,
  },
  toDo: {
    flex: 1,
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toDoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
export default ToDoCard;
