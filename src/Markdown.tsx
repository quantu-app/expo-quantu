import React, { createElement, Fragment } from "react";
import { Button, Divider, Text } from "@ui-kitten/components";
import { lexer, Token } from "marked";
import { Image, Linking, View } from "react-native";
import WebView from "react-native-webview";

type MarkedToken = Token & {
  tokens?: MarkedToken[];
};

function parse(tokens: MarkedToken[]): JSX.Element {
  const out: JSX.Element[] = [];

  for (let i = 0, il = tokens.length; i < il; i++) {
    const token = tokens[i];
    if ("type" in token) {
      switch (token.type) {
        case "space": {
          continue;
        }
        case "hr": {
          out.push(<Divider key={i} />);
          continue;
        }
        case "heading": {
          out.push(
            <Text key={i} category={`h${token.depth}`}>
              {parseInline(token.tokens || [])}
            </Text>
          );
          continue;
        }
        case "code": {
          out.push(<Text key={i}>{token.text}</Text>);
          continue;
        }
        case "table": {
          // TODO: support tables
          continue;
        }
        case "blockquote": {
          out.push(parse(token.tokens || []));
          continue;
        }
        case "list": {
          // TODO: support list
          continue;
        }
        case "html": {
          out.push(<WebView key={i} source={{ html: token.text }} />);
          continue;
        }
        case "paragraph": {
          out.push(<Text key={i}>{parseInline(token.tokens || [])}</Text>);
          continue;
        }
        case "text": {
          const body = [];
          if (token.tokens) {
            body.push(parseInline(token.tokens));
          } else {
            body.push(<Text key={i}>{token.text}</Text>);
          }
          let subToken;
          while (
            i + 1 < il &&
            (subToken = tokens[i + 1]) &&
            "type" in subToken &&
            subToken.type === "text"
          ) {
            if (subToken.tokens) {
              body.push(parseInline(subToken.tokens));
            } else {
              body.push(<Text key={i}>{subToken.text}</Text>);
            }
            i += 1;
          }
          out.push(...body);
          continue;
        }
        default: {
          throw new Error(`Token with "${token.type}" type was not found.`);
        }
      }
    }
  }

  return createElement(Fragment, null, out);
}

function parseInline(tokens: MarkedToken[]): JSX.Element {
  const out: JSX.Element[] = [];

  for (let i = 0, il = tokens.length; i < il; i++) {
    const token = tokens[i];
    if ("type" in token) {
      switch (token.type) {
        case "escape": {
          out.push(<Text key={i}>{token.text}</Text>);
          break;
        }
        case "html": {
          out.push(<WebView key={i} source={{ html: token.text }} />);
          break;
        }
        case "link": {
          out.push(
            <Button
              key={i}
              appearance="ghost"
              onPress={() => Linking.openURL(token.href)}
            >
              {parseInline(token.tokens || []) as any}
            </Button>
          );
          break;
        }
        case "image": {
          out.push(
            <Image key={i} source={{ uri: token.href }}>
              {token.title}
            </Image>
          );
          break;
        }
        case "strong": {
          out.push(<Text key={i}>{token.text}</Text>);
          break;
        }
        case "em": {
          out.push(<Text key={i}>{token.text}</Text>);
          break;
        }
        case "codespan": {
          out.push(<Text key={i}>{token.text}</Text>);
          break;
        }
        case "br": {
          out.push(<View key={i} />);
          break;
        }
        case "del": {
          out.push(<Text key={i}>{token.text}</Text>);
          break;
        }
        case "text": {
          out.push(<Text key={i}>{token.text}</Text>);
          break;
        }
        default: {
          throw new Error(`Token with "${token.type}" type was not found.`);
        }
      }
    }
  }

  return createElement(Fragment, null, out);
}

export interface IMarkdownProps {
  children: string;
}

export function Markdown(props: IMarkdownProps): JSX.Element {
  return parse(lexer(props.children) as any);
}
