import React from "react";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { Container } from "../../Container";
import { DECK_EDIT_SCREEN, ParamList } from "../../navigationConfig";
import { RouteProp } from "@react-navigation/core";

export function DeckEditScreen(props: {
  route: RouteProp<ParamList, typeof DECK_EDIT_SCREEN>;
}) {
  return (
    <Container>
      <Async
        promise={import("./DeckEdit")}
        onSuccess={({ DeckEdit }) => <DeckEdit {...props.route.params} />}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Container>
  );
}
