import React from "react";
import { View } from "react-native";
import { Text } from "@ui-kitten/components";
import { HOME_SCREEN, ParamList } from "../../navigationConfig";

export function Home(_props: ParamList[typeof HOME_SCREEN]) {
  return (
    <View>
      <Text category="h1">Hello, world!</Text>
    </View>
  );
}
