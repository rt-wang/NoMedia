import React, { useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, Modal, Dimensions, Animated, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import CommentSection from './CommentSection';

const { height } = Dimensions.get('window');

const MODAL_HEIGHT = height * 0.7;

const ThreadCommentModal = ({ isVisible, onClose, threadId }) => {
  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const [modalVisible, setModalVisible] = React.useState(isVisible);

  const animateModal = useCallback((toValue) => {
    return new Promise((resolve) => {
      Animated.spring(translateY, {
        toValue,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start(resolve);
    });
  }, [translateY]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = useCallback(
    async ({ nativeEvent }) => {
      if (nativeEvent.oldState === State.ACTIVE) {
        if (nativeEvent.translationY > 20) {
          await animateModal(MODAL_HEIGHT);
          onClose();
        } else {
          animateModal(0);
        }
      }
    },
    [onClose, animateModal]
  );

  const handleClose = useCallback(async () => {
    await animateModal(MODAL_HEIGHT);
    onClose();
  }, [animateModal, onClose]);

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      animateModal(0);
    } else {
      animateModal(MODAL_HEIGHT).then(() => {
        setModalVisible(false);
      });
    }
  }, [isVisible, animateModal]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
            >
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [{ translateY: translateY }],
                  },
                ]}
              >
                <View style={styles.handleContainer}>
                  <View style={styles.handle} />
                </View>
                <CommentSection
                  route={{ params: { postId: threadId } }}
                  navigation={{ push: () => {} }}
                  hideOriginalPost={true}
                  isModal={true}
                />
              </Animated.View>
            </PanGestureHandler>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: MODAL_HEIGHT,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#888',
    borderRadius: 2,
  },
});

export default ThreadCommentModal;