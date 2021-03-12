import React, { useCallback, useState } from "react";
import { Card, Divider, Input, Text } from "@ui-kitten/components";
import { QUESTION_EDIT_SCREEN, ParamList } from "../../navigationConfig";
import { Markdown } from "../../Markdown";
import { View } from "react-native";
import { useDecks } from "../../state/decks";
import { updateQuestionDebounced, useQuestions } from "../../state/questions";

export function QuestionEdit(props: ParamList[typeof QUESTION_EDIT_SCREEN]) {
  const deck = useDecks((state) => state.table.byId(props.deckId)),
    question = useQuestions((state) => state.table.byId(props.questionId)),
    [front, setFront] = useState(question.front),
    [back, setBack] = useState(question.back);

  const setQuestionFront = useCallback(
    (front) => {
      updateQuestionDebounced(props.questionId, { front });
      setFront(front);
    },
    [props.questionId]
  );
  const setQuestionBack = useCallback(
    (back) => {
      updateQuestionDebounced(props.questionId, { back });
      setBack(back);
    },
    [props.questionId]
  );

  return (
    <Card disabled>
      <Text category="h3">{`Deck: ${deck?.name}`}</Text>
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
