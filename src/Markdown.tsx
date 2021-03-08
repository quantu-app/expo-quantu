import marked from "marked";
import React from "react";
import { Platform } from "react-native";
import WebView from "react-native-webview";

export interface IMarkdownProps {
  children: string;
}

export function Markdown(props: IMarkdownProps) {
  if (Platform.OS === "web") {
    return <div dangerouslySetInnerHTML={{ __html: marked(props.children) }} />;
  } else {
    return (
      <WebView source={{ html: marked(props.children) }} style={{ flex: 1 }} />
    );
  }
}
