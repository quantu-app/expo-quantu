import React, { useCallback, useMemo, useState } from "react";
import { Card, Divider, Input, Text } from "@ui-kitten/components";
import { QUESTION_EDIT_SCREEN, ParamList } from "../../navigationConfig";
import { useReduxStore } from "../../state";
import { Loading } from "../../Loading";
import {
  debouncedQuestionsUpdate,
  questionsGet,
} from "../../state/questions/functions";
import { selectQuestionById } from "../../state/questions/selectors";
import { Markdown } from "../../Markdown";
import { selectDeckById } from "../../state/decks/selectors";
import { decksGet } from "../../state/decks/functions";
import { View } from "react-native";

export function QuestionEdit(props: ParamList[typeof QUESTION_EDIT_SCREEN]) {
  const deck = useReduxStore((state) => selectDeckById(state, props.deckId)),
    question = useReduxStore((state) =>
      selectQuestionById(state, props.questionId)
    ),
    [loading, setLoading] = useState(false),
    [initted, setInitted] = useState(false),
    [front, setFront] = useState(""),
    [back, setBack] = useState("");

  useMemo(() => {
    setLoading(true);
    Promise.all([decksGet(props.deckId), questionsGet(props.questionId)])
      .then(() => setInitted(true))
      .finally(() => setLoading(false));
  }, [props.questionId]);

  useMemo(() => {
    if (initted && question) {
      setFront(question.front);
      setBack(question.back);
    }
  }, [initted]);

  const setQuestionFront = useCallback(
    (front) => {
      debouncedQuestionsUpdate(props.questionId, { front });
      setFront(front);
    },
    [props.questionId]
  );
  const setQuestionBack = useCallback(
    (back) => {
      debouncedQuestionsUpdate(props.questionId, { back });
      setBack(back);
    },
    [props.questionId]
  );

  return (
    <Card disabled>
      <Text category="h3">{`Deck: ${deck?.name}`}</Text>
      {!question && loading && <Loading />}
      <Divider />
      {question && (
        <MarkdownEditor markdown={front} onChangeMarkdown={setQuestionFront} />
      )}
      <Divider />
      {question && (
        <MarkdownEditor markdown={back} onChangeMarkdown={setQuestionBack} />
      )}
    </Card>
  );
}

interface IMarkdownEditorProps {
  markdown: string;
  onChangeMarkdown(markdown: string): void;
}

function MarkdownEditor(props: IMarkdownEditorProps) {
  return (
    <View>
      <View>
        <Input
          multiline
          value={props.markdown}
          onChangeText={props.onChangeMarkdown}
        />
      </View>
      <View>
        <Markdown>{props.markdown}</Markdown>
      </View>
    </View>
  );
}
