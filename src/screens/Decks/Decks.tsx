import React, { useCallback, useMemo, useState } from "react";
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
import { NavigationProp, useNavigation } from "@react-navigation/core";
import { DECK_EDIT_SCREEN } from "../../navigationConfig";
import { ModalSmall } from "../../Modal";
import { createDeck, deleteDeck, IDeck, useDecks } from "../../state/decks";
import { TableRow } from "automerge";

export function Decks() {
  const decks = useDecks((state) => state.table.rows),
    navigation = useNavigation(),
    [search, setSearch] = useState(""),
    [deleteId, setDeleteId] = useState<string | undefined>(),
    [filteredDecks, setFilteredDecks] = useState<IDeck[]>([]);

  useMemo(
    () =>
      setFilteredDecks(
        decks.filter((deck) =>
          deck.name.toLowerCase().includes(search.toLowerCase())
        )
      ),
    [decks, search]
  );

  return (
    <View>
      <CreateDeck />
      <Input
        accessoryLeft={(props) => <Icon {...props} name="search-outline" />}
        accessoryRight={(props) => (
          <Button
            {...props}
            appearance="ghost"
            size="small"
            disabled={!search}
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
        deck={deleteId ? decks.find((deck) => deck.id === deleteId) : undefined}
        onDelete={() => deleteId && deleteDeck(deleteId)}
        onClose={() => setDeleteId(undefined)}
      />
    </View>
  );
}

function CreateDeck() {
  const [name, setName] = useState("");

  const onCreateDeck = useCallback(() => {
    setName("");
    createDeck(name);
  }, [name]);

  return (
    <Input
      label="New Deck Name"
      accessoryRight={(props) => (
        <Button
          {...props}
          size="small"
          status="success"
          disabled={!name}
          onPress={onCreateDeck}
          accessoryRight={(props) => <Icon {...props} name="plus-outline" />}
        />
      )}
      value={name}
      onChangeText={setName}
    />
  );
}

interface IDeckItemProps {
  deck: IDeck & TableRow;
  navigation: NavigationProp<any>;
  setDeleteId(id: string): void;
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
  deck?: IDeck;
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
