import React, { memo, ReactNode, ReactText } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Card, Text, Icon } from "@ui-kitten/components";
import { SMALL_WIDTH } from "./constants";

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: SMALL_WIDTH * 0.6,
  },
  header: {
    marginBottom: 16,
  },
  close: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});

export interface IModalSmallProps {
  title: ReactText;
  open: boolean;
  onClose(): void;
  children: ReactNode;
}

export const ModalSmall = memo((props: IModalSmallProps) => {
  return (
    <Modal
      style={styles.modal}
      visible={props.open}
      onBackdropPress={props.onClose}
      backdropStyle={styles.backdrop}
    >
      <Card disabled>
        <Text category="h2" style={styles.header}>
          {props.title}
        </Text>
        <Button
          style={styles.close}
          appearance="ghost"
          size="small"
          status="danger"
          onPress={props.onClose}
          accessoryLeft={(props) => <Icon {...props} name="close" />}
        />
        <View>{props.children}</View>
      </Card>
    </Modal>
  );
});
