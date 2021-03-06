import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Icon, List, Button, ListItem, Input } from "@ui-kitten/components";
import { DECKS_SCREEN, ParamList } from "../../navigationConfig";
import { decksAllForCreator } from "../../state/decks/functions";
import { useReduxStore } from "../../state";
import { selectUser } from "../../state/user/selectors";
import { selectDecks } from "../../state/decks/selectors";
import { RecordOf } from "immutable";
import { IDeck } from "../../state/decks/definitions";

export function Decks(_props: ParamList[typeof DECKS_SCREEN]) {
  const user = useReduxStore(selectUser),
    decks = useReduxStore(selectDecks),
    [search, setSearch] = useState(""),
    [filteredDecks, setFilteredDecks] = useState<RecordOf<IDeck>[]>([]);

  useMemo(() => setFilteredDecks(decks.toArray()), [decks]);

  useMemo(
    () =>
      setFilteredDecks(
        decks.filter((deck) => deck.name.includes(search)).toArray()
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
        value={search}
        onChangeText={setSearch}
      />
      <List data={filteredDecks} renderItem={renderDeckItem} />
    </View>
  );
}

function renderDeckItem({ item }: { item: RecordOf<IDeck> }) {
  return (
    <ListItem
      title={item.name}
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
            accessoryLeft={(props) => <Icon {...props} name="trash-outline" />}
          />
        </>
      )}
    />
  );
}
