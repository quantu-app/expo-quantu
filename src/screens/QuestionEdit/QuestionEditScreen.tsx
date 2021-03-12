import React from "react";
import { Async } from "@aicacia/async_component-react";
import { JSError } from "../../JSError";
import { Loading } from "../../Loading";
import { Container } from "../../Container";
import { ParamList, QUESTION_EDIT_SCREEN } from "../../navigationConfig";
import { RouteProp } from "@react-navigation/core";

export function QuestionEditScreen(props: {
  route: RouteProp<ParamList, typeof QUESTION_EDIT_SCREEN>;
}) {
  return (
    <Container>
      <Async
        promise={import("./QuestionEdit")}
        onSuccess={({ QuestionEdit }) => (
          <QuestionEdit {...props.route.params} />
        )}
        onPending={() => <Loading />}
        onError={(error) => <JSError error={error} />}
      />
    </Container>
  );
}
