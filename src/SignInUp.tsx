import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Icon, Input, Spinner } from "@ui-kitten/components";
import { useReduxStore } from "./state";
import { userSetSignInUpModal } from "./state/user/functions";
import { selectIsSignInUpModalOpen } from "./state/user/selectors";
import { ModalSmall } from "./Modal";

const styles = StyleSheet.create({
  signIn: {
    marginTop: 32,
  },
});

export function SignInUp() {
  const isSignInUpModalOpen = useReduxStore(selectIsSignInUpModalOpen),
    [loading, setLoading] = useState(false),
    [usernameOrEmail, setUsernameOrEmail] = useState(""),
    [password, setPassword] = useState(""),
    [showPassword, setShowPassword] = useState(false);

  const onSignIn = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, [usernameOrEmail, password]);

  return (
    <ModalSmall
      title="Sign in"
      open={isSignInUpModalOpen}
      onClose={() => userSetSignInUpModal(false)}
    >
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
    </ModalSmall>
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
