import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, TextInput, Text} from 'react-native';

import Navbar from '../../components/Navbar/Navbar';
import {
  ParamListBase,
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommentsType} from '../../types/CommentsType';
import {RootStackParamList} from '../../navigation/NavigationTypes';
import {checkIfAuth} from '../../utils/utils';
import {getCommentDataById} from '../../services/api/api/commentService';

interface ViewCommentScreenProps {}

const ViewCommentScreen: React.FC<ViewCommentScreenProps> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [isView, setIsView] = useState(false);
  const [commentBodyValue, setCommentBodyValue] = useState('');
  const [commentsData, setCommentsData] = useState<CommentsType>();

  const route = useRoute<RouteProp<RootStackParamList, 'EditComment'>>();
  const commentToEdit = route.params?.comment;
  let isUserAuth;
  useEffect(() => {
    const initializeViewComment = async () => {
      isUserAuth = await checkIfAuth();
      if (commentToEdit) {
        if (!!isUserAuth == false) {
          setCommentsData(commentToEdit);
        } else {
          const data = await getCommentDataById(commentToEdit?.id);
          setCommentsData(data);
        }
      }
    };

    initializeViewComment();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <Navbar
        back={true}
        style={{backgroundColor: '#FFF'}}
        title={'Comment'}
        titleStyle={{color: '#000000'}}
        contentRight={<View style={{width: 35}}></View>}
      />
      <View style={styles.ViewCommentScreenContainer}>
        <View style={styles.editNotBody}>
          <TextInput
            editable={isView ? false : true}
            value={commentsData?.body}
            placeholder="Enter text here"
            multiline
            style={styles.editNoteBodyInput}></TextInput>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ViewCommentScreenContainer: {
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
    height: '50%',
  },
  editNoteBodyInput: {
    fontSize: 16,
    lineHeight: 20,
  },
  btnDone: {
    width: 35,
    height: 35,
  },
});

export default ViewCommentScreen;
