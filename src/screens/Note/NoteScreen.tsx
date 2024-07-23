import React, {Fragment, useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {Text, TextInput, Button, TouchableRipple} from 'react-native-paper';
import Navbar from '../../components/Navbar/Navbar';
import {getData, setData} from '../../utils/storage';
import {NoteType, UserInfoType} from '../../types';
import {getUserInfo} from '../../services/api/api/userSerivce';
import {getNoteData} from '../../services/api/api/noteService';
import {
  ParamListBase,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {checkIfAuth, formatDate} from '../../utils/utils';
import Loading from '../../components/Loading/Loading';
import {useMainContext} from '../../contexts/MainContext';

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
  const [noteDataAuth, setNoteDataAuth] = useState<NoteType[]>([]);
  const [isAuth, setIsAuth] = useState<Boolean>(false);
  const [filteredNotes, setFilteredNotes] = useState<NoteType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const {menuVisible, toggleMenu, hideMenu} = useMainContext();

  let isUserAuth;

  //GUEST
  const fetchNoteDataGuest = async () => {
    try {
      setIsLoading(true);
      const data = await getData('noteData');
      if (data) {
        const noteData: NoteType[] = data;

        const sortedNotes = noteData.sort((a, b) => b.id - a.id);
        setNoteData(sortedNotes);
        setFilteredNotes(filterNotes(sortedNotes, searchValue, 1));
      }
    } catch (error) {
      console.error('Failed to fetch note data guest:', error);
    }
  };

  const fetchNoteData = async () => {
    try {
      setIsLoading(true);
      const data = await getNoteData();
      const userInfo = await getData('userInfo');
      if (userInfo) {
        const userId = userInfo.id;
        if (data) {
          const noteData: NoteType[] = data;

          const sortedNotes = noteData.sort((a, b) => b.id - a.id);
          setNoteData(sortedNotes);
        }
        setNoteDataAuth(data);
        setFilteredNotes(filterNotes(data, searchValue, userId));
      }
    } catch (error) {
      console.error('Error fetch note data :', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      isUserAuth = await checkIfAuth();
      setIsAuth(!!isUserAuth);

      if (!!isUserAuth === true) {
        await fetchNoteData();
      } else {
        await fetchNoteDataGuest();
      }
      setIsLoading(false);
    };

    initialize();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      isUserAuth = await checkIfAuth();
      const userInfo = await getData('userInfo');
      if (userInfo) {
        const userId = userInfo ? userInfo.id : 1;
        setIsAuth(!!isUserAuth);
        if (!!isUserAuth === false) {
          setFilteredNotes(filterNotes(noteData, searchValue, 1));
        } else {
          setFilteredNotes(filterNotes(noteDataAuth, searchValue, userId));
        }
      }
    };
    initialize();
  }, [searchValue]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('asdas');
      const initializeCallback = async () => {
        isUserAuth = await checkIfAuth();
        if (!!isUserAuth === true) {
          await fetchNoteData();
        } else {
          await fetchNoteDataGuest();
        }
        setIsLoading(false);
      };
      initializeCallback();
    }, []),
  );

  const filterNotes = (notes: NoteType[], search: string, userId: number) => {
    return notes.filter(
      note =>
        (note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.body.toLowerCase().includes(search.toLowerCase())) &&
        note.userId === userId,
    );
  };

  const handleEditNote = (note: NoteType) => {
    navigation.navigate('NewNote', {note});
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedDate = formatDate(currentDate);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Fragment>
      <SafeAreaView
        style={{flex: 0, backgroundColor: '#2F4397'}}></SafeAreaView>
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <TouchableWithoutFeedback
          onPress={() => {
            hideMenu();
          }}>
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
                <Text style={styles.noteHeaderTitleText}>My Notes</Text>
              </View>
              <View style={styles.noteHeaderSubTitle}>
                <Text style={styles.noteHeaderSubTitleText}>
                  {formattedDate}
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
                          <Text numberOfLines={1} style={styles.itemTitleText}>
                            {note.title}
                          </Text>
                        </View>
                        <View style={styles.itemBody}>
                          <Text numberOfLines={2} style={styles.itemBodyText}>
                            {note.body}
                          </Text>
                        </View>

                        {/* <View style={styles.itemFooter}>
                          <Text style={styles.itemFooterText}>
                            UID : {note.userId}
                          </Text>
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
        </TouchableWithoutFeedback>
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
    marginTop: 10,
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
