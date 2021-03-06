import React, { useMemo, useState } from "react";
import { View } from "react-native";
import {
  Text,
  Icon,
  List,
  Button,
  ListItem,
  Input,
  Divider,
} from "@ui-kitten/components";
import { decksAllForCreator, decksDelete } from "../../state/decks/functions";
import { useReduxStore } from "../../state";
import { selectUser } from "../../state/user/selectors";
import { selectDecks } from "../../state/decks/selectors";
import { RecordOf } from "immutable";
import { IDeck } from "../../state/decks/definitions";
import { NavigationProp, useNavigation } from "@react-navigation/core";
import { DECK_EDIT_SCREEN } from "../../navigationConfig";
import { ModalSmall } from "../../Modal";

export function Decks() {
  const user = useReduxStore(selectUser),
    decks = useReduxStore(selectDecks),
    navigation = useNavigation(),
    [search, setSearch] = useState(""),
    [deleteId, setDeleteId] = useState(-1),
    [filteredDecks, setFilteredDecks] = useState<RecordOf<IDeck>[]>([]);

  useMemo(
    () =>
      setFilteredDecks(
        decks
          .filter((deck) =>
            deck.name.toLowerCase().includes(search.toLowerCase())
          )
          .toArray()
      ),
    [decks, search]
  );

  useMemo(() => decksAllForCreator(user.id), [user.id]);

  return (
    <View>
      <Input
        accessoryLeft={(props) => <Icon {...props} name="search-outline" />}
        accessoryRight={(props) => (
          <Button
            {...props}
            appearance="ghost"
            size="small"
            onPress={() => setSearch("")}
            accessoryRight={(props) => <Icon {...props} name="close" />}
          />
        )}
        value={search}
        onChangeText={setSearch}
      />
      <List
        data={filteredDecks}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <DeckItem
            deck={item}
            navigation={navigation}
            setDeleteId={setDeleteId}
          />
        )}
      />
      <DeleteModal
        deck={
          deleteId !== -1
            ? decks.find((deck) => deck.id === deleteId)
            : undefined
        }
        onDelete={() => decksDelete(deleteId)}
        onClose={() => setDeleteId(-1)}
      />
    </View>
  );
}

interface IDeckItemProps {
  deck: RecordOf<IDeck>;
  navigation: NavigationProp<any>;
  setDeleteId(id: number): void;
}

function DeckItem(props: IDeckItemProps) {
  return (
    <ListItem
      title={props.deck.name}
      disabled
      accessoryRight={() => (
        <>
          <Button
            size="small"
            onPress={() =>
              props.navigation.navigate(DECK_EDIT_SCREEN, {
                deckId: props.deck.id,
              })
            }
            accessoryLeft={(props) => <Icon {...props} name="edit-outline" />}
          />
          <Button
            size="small"
            status="danger"
            onPress={() => props.setDeleteId(props.deck.id)}
            accessoryLeft={(props) => <Icon {...props} name="trash-outline" />}
          />
        </>
      )}
    />
  );
}

interface IDeleteModalProps {
  deck?: RecordOf<IDeck>;
  onClose(): void;
  onDelete(): void;
}

function DeleteModal(props: IDeleteModalProps) {
  const [name, setName] = useState("");

  return (
    <ModalSmall
      title="Delete this Deck?"
      open={!!props.deck}
      onClose={props.onClose}
    >
      {props.deck && (
        <>
          <Text>
            Enter the name of this deck `{props.deck.name}` to delete Deck.
          </Text>
          <Input value={name} onChangeText={setName} />
          <Button
            disabled={name !== props.deck.name}
            onPress={() => {
              props.onDelete();
              props.onClose;
            }}
          >
            {`Delete ${props.deck.name}`}
          </Button>
        </>
      )}
    </ModalSmall>
  );
}
