import React, { memo, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Modal, Text, Button, Icon, Card } from "@ui-kitten/components";
import { SMALL_WIDTH } from "./constants";
import { useReduxStore } from "./state";
import { userSetSignInUpModal } from "./state/user/functions";
import { selectIsSignInUpModalOpen } from "./state/user/selectors";

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: SMALL_WIDTH * 0.5,
  },
  header: {
    marginBottom: 16,
  },
  close: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  google: { backgroundColor: "#ea4335", borderColor: "transparent" },
  github: { backgroundColor: "#24292e", borderColor: "transparent" },
});

export const SignInUp = memo(() => {
  const isSignInUpModalOpen = useReduxStore(selectIsSignInUpModalOpen);

  return (
    <Modal
      style={styles.modal}
      visible={isSignInUpModalOpen}
      onBackdropPress={() => userSetSignInUpModal(false)}
      backdropStyle={styles.backdrop}
    >
      <Card disabled>
        <SignIn />
      </Card>
    </Modal>
  );
});

function SignIn() {
  const [loading] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <Text category="h3">Sign in with</Text>
      </View>
      <Button
        style={styles.close}
        appearance="ghost"
        onPress={() => userSetSignInUpModal(false)}
        accessoryLeft={(props) => <Icon {...props} name="close" />}
      />
      <View>
        <Button
          style={styles.google}
          accessoryLeft={(props) => <Icon {...props} name="google" />}
          appearance="filled"
          disabled={loading}
        >
          Google
        </Button>
        {Platform.OS === "web" && (
          <Button
            style={styles.github}
            accessoryLeft={(props) => <Icon {...props} name="github" />}
            appearance="filled"
            disabled={loading}
          >
            Github
          </Button>
        )}
      </View>
    </>
  );
}
