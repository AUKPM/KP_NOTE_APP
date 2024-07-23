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
import {
  ParamListBase,
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getData, setData} from '../../utils/storage';
import {NoteType} from '../../types/NoteType';
import {CommentsType} from '../../types/CommentsType';
import {RootStackParamList} from '../../navigation/NavigationTypes';
import {
  createNote,
  deleteNoteById,
  getNoteDataById,
} from '../../services/api/api/noteService';
import {checkIfAuth} from '../../utils/utils';
import {
  createComment,
  deleteCommentById,
  getCommentByNoteId,
} from '../../services/api/api/commentService';

interface ViewNoteScreenProps {}

const doneImagePath = require('../../assets/image/done.png');
const deleteImagePath = require('../../assets/image/delete.png');
const commentsImagePath = require('../../assets/image/comments.png');
const sendImagePath = require('../../assets/image/send.png');

const ViewNoteScreen: React.FC<ViewNoteScreenProps> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [noteData, setNoteData] = useState<NoteType[]>([]);
  const [commentsData, setCommentsData] = useState<CommentsType[]>([]);
  const [noteTitleValue, setNoteTitleValue] = useState('');
  const [noteBodyValue, setNoteBodyValue] = useState('');
  const [isView, setIsView] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [isAuth, setIsAuth] = useState<Boolean>(false);
  const route = useRoute<RouteProp<RootStackParamList, 'NewNote'>>();
  const noteToEdit = route.params?.note;

  const fetchCommentsDataGuest = async () => {
    console.log('fetchCommentsDataGuest');
    try {
      const commentsData = await getData('commentsData');
      console.log('commentsData', commentsData);

      const existingComments = commentsData
        ? Array.isArray(commentsData)
          ? commentsData
          : JSON.parse(commentsData)
        : [];

      console.log('existingComments', existingComments);
      if (commentsData) {
        const newCommentsData: CommentsType[] = !Array.isArray(commentsData)
          ? JSON.parse(commentsData)
          : commentsData;
        const filteredComments = newCommentsData.filter(
          comment => comment.noteId === noteToEdit?.id,
        );
        const sortedComments = filteredComments.sort((a, b) => b.id - a.id);
        setCommentsData(sortedComments);
      }
    } catch (error) {
      console.error('Failed to fetch comments data:', error);
    }
  };

  const fetchCommentsData = async () => {
    if (noteToEdit) {
      try {
        const commentsData = await getCommentByNoteId(noteToEdit.id);
        if (commentsData) {
          const newCommentsData: CommentsType[] = !Array.isArray(commentsData)
            ? JSON.parse(commentsData)
            : commentsData;
          const filteredComments = newCommentsData.filter(
            comment => comment.noteId === noteToEdit?.id,
          );
          const sortedComments = filteredComments.sort((a, b) => b.id - a.id);
          setCommentsData(sortedComments);
        }
      } catch (error) {
        console.error('Failed to fetch comments data:', error);
      }
    }
  };

  useEffect(() => {
    const initializeComment = async () => {
      let isUserAuth = await checkIfAuth();
      if (noteToEdit) {
        if (!!isUserAuth == false) {
          fetchCommentsDataGuest();
        } else {
          fetchCommentsData();
        }
      }
    };
    initializeComment();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      let isUserAuth = await checkIfAuth();
      setIsAuth(!!isUserAuth);

      if (!!isUserAuth == false) {
        if (noteToEdit) {
          setIsView(true);
          setNoteTitleValue(noteToEdit.title);
          setNoteBodyValue(noteToEdit.body);
        }

        getData('noteData').then((notes: NoteType[]) => {
          if (notes) {
            if (Array.isArray(notes)) {
              setNoteData(notes);
            } else {
              setNoteData(JSON.parse(notes));
            }
          }
        });
      } else {
        if (noteToEdit) {
          let noteDataAuth = await getNoteDataById(noteToEdit?.id);

          setIsView(true);
          setNoteTitleValue(noteDataAuth.title);
          setNoteBodyValue(noteToEdit.body);
        }
      }
    };

    initialize();
  }, []);

  const addNewNote = async (title: string, body: string) => {
    if (title && body) {
      if (!isAuth) {
        const newId =
          noteData.length > 0
            ? Math.max(...noteData.map(note => note.id)) + 1
            : 1;
        const newNote: NoteType = {
          id: newId,
          userId: 1,
          title,
          body,
        };
        const newNotes = [...noteData, newNote];
        setNoteData(newNotes);
        await setData('noteData', newNotes);
        navigation.goBack();
      } else {
        const newNote = {
          title: title,
          body: body,
        };
        createNote(newNote)
          .then(response => {
            console.log('Note created successfully:', response);
            navigation.goBack();
          })
          .catch(error => {
            console.error('Error creating note:', error);
          });
      }
    } else {
      Alert.alert(
        'Note Details Require',
        'Please fill in both the title and body to add a new note.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    }
  };

  const saveEditNote = async () => {
    if (noteToEdit && noteTitleValue && noteBodyValue) {
      const index = noteData.findIndex(note => note.id === noteToEdit.id);

      if (index !== -1) {
        const updatedNote: NoteType = {
          ...noteData[index],
          title: noteTitleValue,
          body: noteBodyValue,
        };

        const updatedNotes = [
          ...noteData.slice(0, index),
          updatedNote,
          ...noteData.slice(index + 1),
        ];

        setNoteData(updatedNotes);
        await setData('noteData', updatedNotes);

        navigation.goBack();
      }
    } else {
      Alert.alert(
        'Note Details Require',
        'Please fill in both the title and body to add a new note.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    }
  };

  const handleButtonDone = (title: string, body: string) => {
    if (isView) {
      saveEditNote();
    } else {
      addNewNote(title, body);
    }
  };

  const addNewComment = async (body: string) => {
    if (noteToEdit && body) {
      let isUserAuth = await checkIfAuth();
      if (!!isUserAuth == false) {
        try {
          const currentCommentsData = await getData('commentsData');
          const existingComments = currentCommentsData
            ? Array.isArray(currentCommentsData)
              ? currentCommentsData
              : JSON.parse(currentCommentsData)
            : [];

          console.log(existingComments);

          const newId =
            existingComments.length > 0
              ? Math.max(
                  ...existingComments.map(
                    (comment: CommentsType) => comment.id,
                  ),
                ) + 1
              : 1;

          const newComment: CommentsType = {
            id: newId,
            userId: 1,
            noteId: noteToEdit?.id,
            body,
          };

          const updatedComments = [...existingComments, newComment];
          await setData('commentsData', updatedComments);

          const filteredCommentsByNoteId = updatedComments.filter(
            (comment: CommentsType) => comment.noteId === noteToEdit.id,
          );
          const sortedComments = filteredCommentsByNoteId.sort(
            (a, b) => b.id - a.id,
          );
          setCommentsData(sortedComments);
          setCommentValue('');
        } catch (error) {
          console.error('Failed to add new comment:', error);
        }
      } else {
        let newComment = {
          noteId: noteToEdit.id,
          body: body,
        };
        await createComment(newComment);
        setCommentValue('');
        await fetchCommentsData();
      }
    } else {
      Alert.alert(
        'Comment Details Require',
        'Please fill in text to add a new comment.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    }
  };

  const handleEditComment = (comment: CommentsType) => {
    navigation.navigate('EditComment', {comment});
  };

  const saveEditComment = async () => {
    if (noteToEdit && noteTitleValue && noteBodyValue) {
      const index = noteData.findIndex(note => note.id === noteToEdit.id);

      if (index !== -1) {
        const updatedNote: NoteType = {
          ...noteData[index],
          title: noteTitleValue,
          body: noteBodyValue,
        };

        const updatedNotes = [
          ...noteData.slice(0, index),
          updatedNote,
          ...noteData.slice(index + 1),
        ];

        setNoteData(updatedNotes);
        await setData('noteData', updatedNotes);

        navigation.goBack();
      }
    } else {
      Alert.alert(
        'Note Details Require',
        'Please fill in both the title and body to add a new note.',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    }
  };

  const handleCommentButtonDone = async (body: string) => {
    await addNewComment(body);
  };

  const handleCommentButtonDelete = (commentId: number) => {
    Alert.alert('Are you sure?', "You won't be able to revert this!", [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          let isUserAuth = await checkIfAuth();
          if (!!isUserAuth == false) {
            try {
              const currentCommentsData = await getData('commentsData');
              console.log('before del : ', currentCommentsData);
              const updatedComments = currentCommentsData.filter(
                (comment: CommentsType) =>
                  !(
                    comment.noteId === noteToEdit?.id &&
                    comment.id === commentId
                  ),
              );

              const filteredCommentsByNoteId = updatedComments.filter(
                (comment: CommentsType) => comment.noteId === noteToEdit?.id,
              );
              await setData('commentsData', updatedComments);

              const sortedComments = filteredCommentsByNoteId.sort(
                (a: CommentsType, b: CommentsType) => b.id - a.id,
              );
              setCommentsData(sortedComments);
            } catch (error) {
              console.error('Failed to delete comment:', error);
            }
          } else {
            if (noteToEdit) {
              await deleteCommentById(commentId);
              fetchCommentsData();
            }
          }
        },
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
    ]);
  };

  const handleDeleteButton = () => {
    if (noteToEdit) {
      Alert.alert('Are you sure?', "You won't be able to revert this!!", [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            let isUserAuth = await checkIfAuth();
            if (!!isUserAuth == false) {
              const updatedNotes = noteData.filter(
                note => note.id !== noteToEdit.id,
              );

              const updatedComments = commentsData.filter(
                comment => comment.noteId !== noteToEdit.id,
              );

              setNoteData(updatedNotes);
              setCommentsData(updatedComments);

              await setData('noteData', updatedNotes);
              await setData('commentsData', updatedComments);
              navigation.goBack();
            } else {
              if (noteToEdit) {
                await deleteNoteById(noteToEdit.id);
                navigation.goBack();
              }
            }
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('OK Pressed'),
        },
      ]);
    } else {
      Alert.alert('Error', 'Note to delete not found.', [
        {text: 'Cancel', onPress: () => console.log('OK Pressed')},
      ]);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <Navbar
        back={true}
        style={{backgroundColor: '#FFF'}}
        title={isView ? 'Note' : 'New Note'}
        titleStyle={{color: '#000000'}}
        contentRight={
          <TouchableRipple
            onPress={() => {
              handleButtonDone(noteTitleValue, noteBodyValue);
            }}>
            {!isView ? (
              <Image style={styles.btnDone} source={doneImagePath} />
            ) : (
              <View style={{width: 35}}></View>
            )}
          </TouchableRipple>
        }
      />
      <View style={styles.ViewNoteScreenContainer}>
        <View style={styles.editNotTitle}>
          <TextInput
            editable={isView ? false : true}
            value={noteTitleValue}
            onChangeText={value => setNoteTitleValue(value)}
            placeholder="Title"
            style={styles.editNoteTitleInput}></TextInput>
        </View>
        <View style={styles.editNotBody}>
          <TextInput
            editable={isView ? false : true}
            value={noteBodyValue}
            onChangeText={value => setNoteBodyValue(value)}
            placeholder="Enter text here"
            multiline
            style={styles.editNoteBodyInput}></TextInput>
        </View>

        {isView && (
          <View style={styles.commentContainer}>
            <View style={styles.commentTitleContainer}>
              <View style={styles.commentTitle}>
                <Image
                  source={commentsImagePath}
                  style={styles.commentTittleIcon}></Image>

                <Text style={styles.commentTitleText}>Comments</Text>
              </View>
            </View>
            <View style={styles.commentListContainer}>
              <ScrollView style={styles.listContainerScrollView}>
                {commentsData.length > 0
                  ? commentsData.map((comments, index) => (
                      <TouchableRipple
                        style={styles.commentItemContainer}
                        key={comments.id}
                        onPress={() => handleEditComment(comments)}>
                        <View
                          key={index}
                          style={styles.commentItemSubContainer}>
                          <View style={styles.commentItemTitle}>
                            <Text
                              numberOfLines={2}
                              style={styles.commentItemTitleText}>
                              {comments.body}
                            </Text>
                          </View>
                          <TouchableRipple
                            style={styles.commentItemDelete}
                            onPress={() => {
                              handleCommentButtonDelete(comments.id);
                            }}>
                            <Image
                              style={styles.commentItemDeleteIcon}
                              source={deleteImagePath}></Image>
                          </TouchableRipple>
                        </View>
                      </TouchableRipple>
                    ))
                  : ''}
              </ScrollView>
            </View>
            <View style={styles.addCommentContainer}>
              <TextInput
                value={commentValue}
                onChangeText={value => setCommentValue(value)}
                placeholder="Comment Here"
                style={styles.addCommentInput}></TextInput>
              <TouchableRipple
                style={styles.addCommentIconContainer}
                onPress={() => {
                  handleCommentButtonDone(commentValue);
                }}>
                <Image
                  style={styles.addCommentIcon}
                  source={sendImagePath}></Image>
              </TouchableRipple>
            </View>
            <View style={styles.deleteNoteContainer}>
              <Button
                style={styles.deleteNoteButton}
                mode="contained"
                onPress={() => {
                  handleDeleteButton();
                  console.log('Pressed');
                }}>
                <Text style={styles.deleteNoteButtonText}>DELETE NOTE</Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ViewNoteScreenContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 18,
  },
  editNotTitle: {
    borderTopWidth: 1,
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: 1,
    borderTopColor: '#E3E3E3',
    paddingVertical: 23,
  },
  editNoteTitleInput: {
    fontSize: 18,
    fontWeight: '600',
  },
  editNotBody: {
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: 1,
    paddingVertical: 23,
    height: '30%',
  },
  editNoteBodyInput: {
    fontSize: 16,
    lineHeight: 20,
  },
  btnDone: {
    width: 35,
    height: 35,
  },
  commentContainer: {
    flex: 1,
  },
  commentTitleContainer: {
    paddingVertical: 16,
  },
  commentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentTittleIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  commentTitleText: {
    fontSize: 20,
    fontWeight: '600',
  },
  commentListContainer: {},
  listContainerScrollView: {
    height: '35%',
    marginBottom: 16,
  },
  commentItemContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 5,
    marginBottom: 16,
  },
  commentItemSubContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  commentItemTitle: {
    flex: 1,
    position: 'relative',
    padding: 16,
    paddingRight: 10,
  },
  commentItemTitleText: {},
  commentItemDelete: {
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  commentItemDeleteIcon: {
    width: 16,
    height: 16,
  },
  addCommentContainer: {
    position: 'relative',
  },
  addCommentInput: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    paddingRight: 50,
  },
  addCommentIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 16,
    padding: 16,
  },
  addCommentIcon: {
    width: 18,
    height: 18,
  },
  deleteNoteContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  deleteNoteButton: {
    backgroundColor: '#D96666',
    paddingVertical: 5,
    borderRadius: 50,
    marginBottom: 16,
  },
  deleteNoteButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ViewNoteScreen;
