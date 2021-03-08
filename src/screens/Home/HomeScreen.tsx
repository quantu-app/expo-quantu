import React from "react";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { Container } from "../../Container";
import { HOME_SCREEN, ParamList } from "../../navigationConfig";

export function HomeScreen(_props: ParamList[typeof HOME_SCREEN]) {
  return (
    <Container>
      <Async
        promise={import("../Decks/Decks")}
        onSuccess={({ Decks }) => <Decks />}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Container>
  );
}
