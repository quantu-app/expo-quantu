import React, { memo, useCallback, useState } from "react";
import {
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from "@react-navigation/drawer";
import { DrawerHeaderProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { HomeScreen } from "./screens/Home/HomeScreen";
import { Loading } from "./Loading";
import {
  DEFAULT_SCREEN,
  HOME_SCREEN,
  DECKS_SCREEN,
  linking,
  ParamList,
  DECK_EDIT_SCREEN,
  QUESTION_EDIT_SCREEN,
} from "./navigationConfig";
import { useReduxStore } from "./state";
import { selectIsSignedIn, selectUser } from "./state/user/selectors";
import app from "../app.json";
import { RecordOf } from "immutable";
import { ICurrentUser } from "./state/user/definitions";
import {
  Button,
  Layout,
  Drawer,
  DrawerItem,
  Icon,
  IndexPath,
  TopNavigation,
  TopNavigationAction,
  OverflowMenu,
  MenuItem,
} from "@ui-kitten/components";
import { userSetSignInUpModal } from "./state/user/functions";
import { SignInUp } from "./SignInUp";
import { DecksScreen } from "./screens/Decks/DecksScreen";
import { DeckEditScreen } from "./screens/DeckEdit/DeckEditScreen";
import { QuestionEditScreen } from "./screens/QuestionEdit/QuestionEditScreen";

export const PERSISTENCE_KEY = "NAVIGATION_STATE";

export const { Navigator, Screen } = createDrawerNavigator<ParamList>();

export function Navigation() {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    if (!isReady) {
      (async () => {
        try {
          const initialUrl = await Linking.getInitialURL();

          if (Platform.OS !== "web" && initialUrl === null) {
            const savedStateString = await AsyncStorage.getItem(
                PERSISTENCE_KEY
              ),
              state = savedStateString
                ? JSON.parse(savedStateString)
                : undefined;

            if (state !== undefined) {
              setInitialState(state);
            }
          }
        } finally {
          setIsReady(true);
        }
      })();
    }
  }, [isReady]);

  if (!isReady) {
    return <Loading />;
  }

  return (
    <NavigationContainer
      linking={linking}
      fallback={<Loading />}
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <NavigationDrawer />
    </NavigationContainer>
  );
}

function NavigationDrawer() {
  const isSignedIn = useReduxStore(selectIsSignedIn),
    user = useReduxStore(selectUser);

  return (
    <Navigator
      initialRouteName={DEFAULT_SCREEN}
      screenOptions={{
        headerShown: true,
        header: (props) => (
          <Header {...props} user={user} isSignedIn={isSignedIn} />
        ),
      }}
      drawerType="front"
      drawerContent={(props) => (
        <DrawerContent {...props} isSignedIn={isSignedIn} />
      )}
      detachInactiveScreens
    >
      <Screen name={HOME_SCREEN} component={HomeScreen} />
      <Screen name={DECKS_SCREEN} component={DecksScreen} />
      <Screen name={DECK_EDIT_SCREEN} component={DeckEditScreen} />
      <Screen name={QUESTION_EDIT_SCREEN} component={QuestionEditScreen} />
    </Navigator>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS !== "web" ? StatusBar.currentHeight : 0,
    borderBottomColor: "rgb(228, 233, 242)",
    borderBottomWidth: 1,
  },
});

interface IDrawerHeaderProps extends DrawerHeaderProps {
  user: RecordOf<ICurrentUser>;
  isSignedIn: boolean;
}

const Header = memo(
  (props: IDrawerHeaderProps) => {
    return (
      <SafeAreaView>
        <Layout style={headerStyles.container}>
          <TopNavigation
            alignment="start"
            title={() => (
              <Button
                appearance="ghost"
                onPress={() =>
                  props.scene.descriptor.navigation.navigate(HOME_SCREEN)
                }
              >
                {`${app.displayName} v${app.expo.version}`}
              </Button>
            )}
            accessoryLeft={(accessoryProps) => (
              <>
                <TopNavigationAction
                  {...accessoryProps}
                  onPress={() =>
                    (props.scene.descriptor.navigation as any).openDrawer()
                  }
                  icon={(props) => <Icon {...props} name="menu-outline" />}
                />
                {props.scene.descriptor.navigation.canGoBack() && (
                  <TopNavigationAction
                    {...accessoryProps}
                    onPress={() => props.scene.descriptor.navigation.goBack()}
                    icon={(props) => (
                      <Icon {...props} name="arrow-back-outline" />
                    )}
                  />
                )}
              </>
            )}
            accessoryRight={
              props.isSignedIn
                ? () => (
                    <Account navigation={props.scene.descriptor.navigation} />
                  )
                : () => (
                    <TopNavigationAction
                      onPress={() => userSetSignInUpModal(true)}
                      accessibilityHint="Log in"
                      icon={(props) => (
                        <Icon {...props} name="log-in-outline" />
                      )}
                    />
                  )
            }
          />
          <SignInUp />
        </Layout>
      </SafeAreaView>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isSignedIn === nextProps.isSignedIn &&
      prevProps.user === nextProps.user
    );
  }
);

interface IAccountProps {
  navigation: NavigationProp<any>;
}

const Account = memo((props: IAccountProps) => {
  const [visible, setVisible] = useState(false),
    [selectedIndex, setSelectedIndex] = useState<IndexPath | undefined>();

  const onItemSelect = useCallback((index: IndexPath) => {
    setSelectedIndex(index);
    setVisible(false);

    if (index.row === 0) {
      props.navigation.navigate(DECKS_SCREEN);
    } else if (index.row === 1) {
      console.log("Sign Out");
    }
  }, []);

  return (
    <Layout level="1">
      <OverflowMenu
        anchor={() => (
          <TopNavigationAction
            accessibilityHint="Profile"
            onPress={() => setVisible(true)}
            icon={(props) => <Icon {...props} name="person-outline" />}
          />
        )}
        visible={visible}
        selectedIndex={selectedIndex}
        onSelect={onItemSelect}
        onBackdropPress={() => setVisible(false)}
      >
        <MenuItem title="Decks" />
        <MenuItem title="Sign out" />
      </OverflowMenu>
    </Layout>
  );
});

interface IDrawerContentProps
  extends DrawerContentComponentProps<DrawerContentOptions> {
  isSignedIn: boolean;
}

function mapStateIndexToListed(index: number) {
  switch (index) {
    default:
      return index;
  }
}

const DrawerContent = memo(
  (props: IDrawerContentProps) => {
    return (
      <DrawerContentScrollView {...props}>
        <Drawer
          selectedIndex={
            new IndexPath(mapStateIndexToListed(props.state.index))
          }
        >
          <DrawerItem
            accessoryLeft={(props) => <Icon {...props} name="home-outline" />}
            title={HOME_SCREEN}
            onPress={() => props.navigation.navigate(HOME_SCREEN)}
          />
          <DrawerItem
            accessoryLeft={(props) => <Icon {...props} name="menu-outline" />}
            title={DECKS_SCREEN}
            onPress={() => props.navigation.navigate(DECKS_SCREEN)}
          />
        </Drawer>
      </DrawerContentScrollView>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isSignedIn === nextProps.isSignedIn &&
      prevProps.state.index === nextProps.state.index
    );
  }
);
