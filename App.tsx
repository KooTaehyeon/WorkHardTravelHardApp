import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TextInputProps,
  ScrollView,
  Alert,
  Button,
  Platform,
} from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './colors';
import ToDoCard from './components/ToDoCard';
const StorageKey = '@toDos';
const StorageType = '@type';
export default function App() {
  const [working, setWorking] = useState<boolean>(true);
  const [text, setText] = useState<string>('');
  const inputRef = useRef<TextInput | null>(null);
  const [toDos, setToDos] = useState<any>({});

  const travel = async () => {
    const json = JSON.stringify(false);
    await AsyncStorage.setItem(StorageType, json);
    setWorking(false);
  };
  const work = async () => {
    const json = JSON.stringify(true);
    await AsyncStorage.setItem(StorageType, json);

    setWorking(true);
  };
  const onChangeText = (payload: string) => {
    // 인풋 이벤트
    setText(payload);
  };
  const saveToDos = async (save: {}) => {
    const json = JSON.stringify(save);
    await AsyncStorage.setItem(StorageKey, json);
  };
  const loadToDos = async () => {
    try {
      const storage = await AsyncStorage.getItem(StorageKey);
      return storage != null ? setToDos(JSON.parse(storage)) : null;
    } catch (e) {
      console.log(e, 'err');
    }
  };
  const loadType = async () => {
    try {
      const storage = await AsyncStorage.getItem(StorageType);
      if (storage === 'true') setWorking(true);
      if (storage === 'false') setWorking(false);
    } catch (e) {
      console.log(e, 'err1');
    }
  };
  useEffect(() => {
    loadToDos();
    loadType();
  }, []);
  const addToDo = async () => {
    // todo
    if (text === '') return;
    const newToDo = { ...toDos, [Date.now()]: { text, work: working } };
    setToDos(newToDo);
    await saveToDos(newToDo);
    setText('');
    inputRef.current?.clear();
  };
  console.log(toDos);
  const deleteToDo = (id: string) => {
    if (Platform.OS === 'web') {
      const ok = confirm('do tou want to delete this To Do');
      if (ok) {
        const newToDos = { ...toDos };
        delete newToDos[id];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else {
      Alert.alert('Delete To Do?', 'Are you sure', [
        {
          text: 'Cancel(취소)',
        },
        {
          text: "I'm Sure(삭제)",
          style: 'destructive',
          onPress: async () => {
            const newToDos = { ...toDos };
            delete newToDos[id];
            setToDos(newToDos);
            await saveToDos(newToDos);
          },
        },
      ]);
    }

    return;
  };
  const delStorage = async () => {
    await AsyncStorage.removeItem(StorageKey);
    await AsyncStorage.removeItem(StorageType);
    setToDos({});
  };
  const checkToDo = async (
    row: {
      text: string;
      work: boolean;
    },
    bool: boolean,
    id: string
  ) => {
    // setIsCheck(!isCheck);
    console.log();

    const newToDo = {
      ...toDos,
      [id]: { text: row.text, work: row.work, check: bool },
    };
    setToDos(newToDo);
    await saveToDos(newToDo);
  };

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? 'white' : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? 'white' : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          ref={inputRef}
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          // autoCapitalize='sentences' 대소문자 설정
          returnKeyType={'done'} // 전송버튼
          // keyboardType={'email-address'} 폰 패드 입력방식
          style={styles.input}
          placeholder={working ? 'Add a To Do' : 'Where do you want to go?'}
        />
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) => {
          return toDos[key].work === working ? (
            <ToDoCard
              key={key}
              id={key}
              delete={deleteToDo}
              toDos={toDos}
              setToDos={setToDos}
              checkOn={checkToDo}
            />
          ) : // <View style={styles.toDo} key={key}>
          //   <Text style={styles.toDoText}>{toDos[key].text}</Text>
          //   <TouchableOpacity onPress={() => deleteToDo(key)}>
          //     <Fontisto name='trash' size={18} color={'grey'} />
          //   </TouchableOpacity>
          // </View>
          null;
        })}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity onPress={delStorage}>
          <Text style={{ ...styles.btn }}>todo 삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  footer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 0.3,
  },
  btnText: {
    fontSize: 38,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
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
  btn: {
    backgroundColor: theme.grey,
    color: '#ffffff',
    // width: 80,
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    fontSize: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
});
