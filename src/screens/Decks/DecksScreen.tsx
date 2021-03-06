import React from "react";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { Container } from "../../Container";

export function DecksScreen() {
  return (
    <Container>
      <Async
        promise={import("./Decks")}
        onSuccess={({ Decks }) => <Decks />}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Container>
  );
}
