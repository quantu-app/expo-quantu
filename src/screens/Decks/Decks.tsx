import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Icon,
  List,
  Button,
  ListItem,
  Input,
  Modal,
  Card,
} from "@ui-kitten/components";
import { DECKS_SCREEN, ParamList } from "../../navigationConfig";
import { decksAllForCreator, decksDelete } from "../../state/decks/functions";
import { useReduxStore } from "../../state";
import { selectUser } from "../../state/user/selectors";
import { selectDecks } from "../../state/decks/selectors";
import { RecordOf } from "immutable";
import { IDeck } from "../../state/decks/definitions";
import { SMALL_WIDTH } from "../../constants";

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
});

export function Decks(_props: ParamList[typeof DECKS_SCREEN]) {
  const user = useReduxStore(selectUser),
    decks = useReduxStore(selectDecks),
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

  useMemo(() => {
    decksAllForCreator(user.id);
  }, [user.id]);

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
        renderItem={({ item }) => (
          <DeckItem deck={item} setDeleteId={setDeleteId} />
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
  return (
    <Modal
      style={styles.modal}
      visible={!!props.deck}
      onBackdropPress={props.onClose}
      backdropStyle={styles.backdrop}
    >
      {props.deck && (
        <Card disabled>
          <Button
            onPress={() => {
              props.onDelete();
              props.onClose;
            }}
          >
            {`Delete ${props.deck.name}`}
          </Button>
        </Card>
      )}
    </Modal>
  );
}
