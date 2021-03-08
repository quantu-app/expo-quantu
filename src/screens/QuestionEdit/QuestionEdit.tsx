import React, { useMemo, useState } from "react";
import { Card, Text } from "@ui-kitten/components";
import { QUESTION_EDIT_SCREEN, ParamList } from "../../navigationConfig";
import { useReduxStore } from "../../state";
import { Loading } from "../../Loading";
import { questionsGet } from "../../state/questions/functions";
import { selectQuestionById } from "../../state/questions/selectors";
import { Markdown } from "../../Markdown";
import { selectDeckById } from "../../state/decks/selectors";
import { decksGet } from "../../state/decks/functions";

export function QuestionEdit(props: ParamList[typeof QUESTION_EDIT_SCREEN]) {
  const deck = useReduxStore((state) => selectDeckById(state, props.deckId)),
    question = useReduxStore((state) =>
      selectQuestionById(state, props.questionId)
    ),
    [loading, setLoading] = useState(false);

  useMemo(() => {
    setLoading(true);
    Promise.all([
      decksGet(props.deckId),
      questionsGet(props.questionId),
    ]).finally(() => setLoading(false));
  }, [props.questionId]);

  return (
    <Card disabled>
      <Text category="h3">{`Deck: ${deck?.name}`}</Text>
      {!question && loading && <Loading />}
      {question && <Markdown>{question.front}</Markdown>}
      {question && <Markdown>{question.back}</Markdown>}
    </Card>
  );
}
