import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput as PaperInput,
  Button,
  TouchableRipple,
} from 'react-native-paper';
import Navbar from '../../components/Navbar/Navbar';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getData, setData} from '../../utils/storage';
import {Note} from '../../types/NoteType';

interface NewNoteScreenProps {}

const doneImagePath = require('../../assets/image/done.png');
const commentsImagePath = require('../../assets/image/comments.png');

interface NoteContextType {
  notes: Note[];
  addNote: (note: Note) => void;
  removeNote: (id: number) => void;
}

const NewNoteScreen: React.FC<NewNoteScreenProps> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [noteData, setNoteData] = useState<Note[]>([]);
  const [noteTitleValue, setNoteTitleValue] = useState('');
  const [noteBodyValue, setNoteBodyValue] = useState('');

  useEffect(() => {
    getData('noteData').then((notes: Note[]) => {
      if (notes) {
        setNoteData(notes);
      }
    });
  }, []);

  const addNewNote = (title: string, body: string) => {
    if (title && body) {
      const newId =
        noteData.length > 0
          ? Math.max(...noteData.map(note => note.id)) + 1
          : 1;
      const newNote: Note = {
        id: newId,
        userId: 1,
        title,
        body,
      };
      const newNotes = [...noteData, newNote];
      setNoteData(newNotes);
      setData('noteData', newNotes);
      navigation.goBack();
    } else {
      Alert.alert(
        'Note Details Require',
        'Please fill in both the title and body to add a new note.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <Navbar
        back={true}
        style={{backgroundColor: '#FFF'}}
        title="New Note"
        titleStyle={{color: '#000000'}}
        contentRight={
          <TouchableRipple
            onPress={() => {
              addNewNote(noteTitleValue, noteBodyValue);
            }}>
            <Image style={styles.btnDone} source={doneImagePath} />
          </TouchableRipple>
        }
      />
      <View style={styles.newNoteScreenContainer}>
        <View style={styles.newNotTitle}>
          <TextInput
            value={noteTitleValue}
            onChangeText={value => setNoteTitleValue(value)}
            placeholder="Title"
            style={styles.newNoteTitleInput}></TextInput>
        </View>
        <View style={styles.newNotBody}>
          <TextInput
            value={noteBodyValue}
            onChangeText={value => setNoteBodyValue(value)}
            placeholder="Enter text here"
            multiline
            style={styles.newNoteBodyInput}></TextInput>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  newNoteScreenContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 18,
  },
  newNotTitle: {
    borderTopWidth: 1,
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: 1,
    borderTopColor: '#E3E3E3',
    paddingVertical: 23,
  },
  newNoteTitleInput: {
    fontSize: 20,
    fontWeight: '600',
  },
  newNotBody: {
    borderTopWidth: 1,
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: 1,
    borderTopColor: '#E3E3E3',
    paddingVertical: 23,
    height: 200,
  },
  newNoteBodyInput: {
    fontSize: 16,
    lineHeight: 20,
  },
  btnDone: {
    width: 35,
    height: 35,
  },
});

export default NewNoteScreen;
