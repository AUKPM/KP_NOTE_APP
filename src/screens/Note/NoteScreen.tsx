import React, {Fragment, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, SafeAreaView, Image} from 'react-native';
import {Text, TextInput, Button, TouchableRipple} from 'react-native-paper';
import Navbar from '../../components/Navbar/Navbar';
import {getData, setData} from '../../utils/storage';
import {NoteType} from '../../types/NoteType';
import {
  ParamListBase,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface NoteScreenProps {
  title?: string;
  description?: string;
  background?: React.CSSProperties;
}

const addImagePath = require('../../assets/image/add.png');

const NoteScreen: React.FC<NoteScreenProps> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [searchValue, setSearchValue] = useState('');
  const [noteData, setNoteData] = useState<NoteType[]>([]);

  const fetchNoteData = async () => {
    try {
      const storedData = await getData('noteData');
      if (storedData) {
        const noteData: NoteType[] = storedData;

        const sortedNotes = noteData.sort((a, b) => b.id - a.id);
        setNoteData(sortedNotes);
      }
    } catch (error) {
      console.error('Failed to fetch note data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchNoteData();
    }, []),
  );

  const userId = 1;

  //   const noteData = [
  //     {
  //       id: 1,
  //       userId: 1,
  //       title: 'Note 1',
  //       body: 'This is note 1 body.',
  //     },
  //     {
  //       id: 2,
  //       userId: 1,
  //       title: 'Note 2',
  //       body: 'This is note 2 body.',
  //     },
  //     {
  //       id: 3,
  //       userId: 1,
  //       title: 'Note 3',
  //       body: 'This is note 3 body.',
  //     },
  //     {
  //       id: 4,
  //       userId: 1,
  //       title: 'Note 4',
  //       body: 'This is note 4 body.',
  //     },
  //     {
  //       id: 5,
  //       userId: 1,
  //       title: 'Note 5',
  //       body: 'This is note 5 body.',
  //     },
  //     {
  //       id: 6,
  //       userId: 3,
  //       title: 'Note 6',
  //       body: 'This is note 6 body.',
  //     },
  //     {
  //       id: 7,
  //       userId: 4,
  //       title: 'Note 7',
  //       body: 'This is note 7 body.',
  //     },
  //     {
  //       id: 8,
  //       userId: 4,
  //       title: 'Note 8',
  //       body: 'This is note 8 body.',
  //     },
  //     {
  //       id: 9,
  //       userId: 5,
  //       title: 'Note 9',
  //       body: 'This is note 9 body.',
  //     },
  //     {
  //       id: 10,
  //       userId: 5,
  //       title: 'Note 10',
  //       body: 'This is note 10 body.',
  //     },
  //   ];

  const filterNotes = (notes: typeof noteData, search: string) => {
    return notes.filter(
      note =>
        (note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.body.toLowerCase().includes(search.toLowerCase())) &&
        note.userId === userId,
    );
  };

  const filteredNotes = filterNotes(noteData, searchValue);

  const handleEditNote = (note: NoteType) => {
    navigation.navigate('NewNote', {note});
  };

  return (
    <Fragment>
      <SafeAreaView
        style={{flex: 0, backgroundColor: '#2F4397'}}></SafeAreaView>
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <View style={styles.noteScreenContainer}>
          <Navbar
            title=""
            nextPage="NewNote"
            style={{backgroundColor: '#2F4397'}}
            contentRight={
              <TouchableRipple onPress={() => navigation.navigate('NewNote')}>
                <Image style={styles.btnAdd} source={addImagePath} />
              </TouchableRipple>
            }
          />
          <View style={styles.noteHeader}>
            <View style={styles.noteHeaderTitle}>
              <Text style={styles.noteHeaderTitleText}>
                My Notes
              </Text>
            </View>
            <View style={styles.noteHeaderSubTitle}>
              <Text style={styles.noteHeaderSubTitleText}>
                Monday, July 20, 2024 10:00 PM
              </Text>
            </View>
            <View style={styles.noteHeaderSearch}>
              <TextInput
                style={styles.noteHeaderSearchInput}
                outlineColor="#2F4397"
                activeOutlineColor="#2F4397"
                theme={{roundness: 50}}
                placeholder="Search"
                mode="outlined"
                value={searchValue}
                onChangeText={value => setSearchValue(value)}
              />
            </View>
          </View>

          <View style={styles.listContainer}>
            {filteredNotes.length > 0 ? (
              <ScrollView style={styles.listContainerScrollView}>
                {filteredNotes.map((note, index) => (
                  <TouchableRipple
                    style={styles.itemContainer}
                    key={note.id}
                    onPress={() => handleEditNote(note)}>
                    <View key={index}>
                      <View style={styles.itemTitle}>
                        <Text style={styles.itemTitleText}>{note.title}</Text>
                      </View>
                      <View style={styles.itemBody}>
                        <Text style={styles.itemBodyText}>{note.body}</Text>
                      </View>

                      {/* <View style={styles.itemFooter}>
                        <Text style={styles.itemFooterText}>UID : {note.userId}</Text>
                    </View> */}
                    </View>
                  </TouchableRipple>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No Data</Text>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  noteScreenContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
  },
  noteHeader: {
    padding: 18,
    backgroundColor: '#2F4397',
  },
  noteHeaderTitle: {
    marginBottom: 5,
  },
  noteHeaderTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  noteHeaderSubTitle: {
    marginBottom: 20,
  },
  noteHeaderSubTitleText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#D0D0D0',
  },
  noteHeaderSearch: {
    marginBottom: 2,
  },
  noteHeaderSearchInput: {
    height: 50,
    justifyContent: 'center',
  },
  listContainer: {
    flex: 1,
    padding: 18,
  },
  listContainerScrollView: {
    flex: 1,
  },
  itemContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E4E4E4',
    padding: 16,
    marginBottom: 16,
  },
  itemTitle: {
    marginBottom: 8,
  },
  itemTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2F4397',
  },
  itemBody: {
    // marginBottom: 8,
  },
  itemBodyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },
  itemFooter: {},
  itemFooterText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#ACACAC',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2F4397',
    textAlign: 'center',
  },
  btnAdd: {
    width: 35,
    height: 35,
  },
});

export default NoteScreen;
