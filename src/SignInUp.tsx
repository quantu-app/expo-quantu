import React, { memo, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Modal,
  Button,
  Icon,
  Card,
  Input,
  Text,
  Spinner,
} from "@ui-kitten/components";
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
  signIn: {
    marginTop: 32,
  },
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
  const [loading, setLoading] = useState(false),
    [usernameOrEmail, setUsernameOrEmail] = useState(""),
    [password, setPassword] = useState(""),
    [showPassword, setShowPassword] = useState(false);

  const onSignIn = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, [usernameOrEmail, password]);

  return (
    <>
      <Text category="h2" style={styles.header}>
        Sign in
      </Text>
      <Button
        style={styles.close}
        appearance="ghost"
        size="small"
        status="danger"
        onPress={() => userSetSignInUpModal(false)}
        accessoryLeft={(props) => <Icon {...props} name="close" />}
      />
      <View>
        <Input
          label="Username or Email"
          value={usernameOrEmail}
          onChangeText={setUsernameOrEmail}
        />
        <Input
          label="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          accessoryRight={(props) => (
            <EyeButton
              {...props}
              showPassword={showPassword}
              onPress={() => setShowPassword((showPassword) => !showPassword)}
            />
          )}
        />
        <Button
          style={styles.signIn}
          accessoryRight={loading ? () => <Spinner size="small" /> : undefined}
          appearance="filled"
          disabled={loading}
          onPress={onSignIn}
        >
          Sign in
        </Button>
      </View>
    </>
  );
}

interface IEyeButtonProps {
  showPassword: boolean;
  onPress(): void;
}

function EyeButton(props: IEyeButtonProps) {
  return (
    <Button
      {...props}
      appearance="ghost"
      size="small"
      accessoryRight={(accessoryProps) => (
        <Icon
          {...accessoryProps}
          name={props.showPassword ? "eye-off-outline" : "eye-outline"}
        />
      )}
    />
  );
}
