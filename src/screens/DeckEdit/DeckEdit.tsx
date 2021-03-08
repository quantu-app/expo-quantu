import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  Card,
  Input,
  ListItem,
  List,
  Icon,
  TextProps,
  Divider,
} from "@ui-kitten/components";
import {
  DECK_EDIT_SCREEN,
  QUESTION_EDIT_SCREEN,
  ParamList,
} from "../../navigationConfig";
import { debouncedDecksUpdate } from "../../state/decks/functions";
import { useReduxStore } from "../../state";
import { RecordOf } from "immutable";
import { Loading } from "../../Loading";
import {
  questionAllForDeck,
  questionsDelete,
} from "../../state/questions/functions";
import { selectQuestionsByDeckId } from "../../state/questions/selectors";
import { NavigationProp, useNavigation } from "@react-navigation/core";
import {
  IQuestion,
  isFlashCardQuestion,
} from "../../state/questions/definitions";
import { decksGet } from "../../state/decks/functions";
import { selectDeckById } from "../../state/decks/selectors";
import { IDeck } from "../../state/decks/definitions";
import { ModalSmall } from "../../Modal";
import { Markdown } from "../../Markdown";

export function DeckEdit(props: ParamList[typeof DECK_EDIT_SCREEN]) {
  const navigation = useNavigation(),
    deck = useReduxStore((state) => selectDeckById(state, props.deckId)),
    questions = useReduxStore((state) =>
      selectQuestionsByDeckId(state, props.deckId)
    ),
    [loading, setLoading] = useState(false),
    [deleteId, setDeleteId] = useState(-1);

  useMemo(() => {
    setLoading(true);
    Promise.all([
      questionAllForDeck(props.deckId),
      decksGet(props.deckId),
    ]).finally(() => setLoading(false));
  }, [props.deckId]);

  return (
    <Card disabled>
      {loading ? <Loading /> : deck ? <DeckEditForm deck={deck} /> : null}
      <List
        data={questions.toArray()}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <QuestionItem
            question={item}
            navigation={navigation}
            setDeleteId={setDeleteId}
          />
        )}
      />
      <DeleteModal
        question={
          deleteId !== -1
            ? questions.find((question) => question.id === deleteId)
            : undefined
        }
        onDelete={() => questionsDelete(deleteId)}
        onClose={() => setDeleteId(-1)}
      />
    </Card>
  );
}

interface IDeckEditFormProps {
  deck: RecordOf<IDeck>;
}

function DeckEditForm(props: IDeckEditFormProps) {
  const [name, setName] = useState(props.deck.name);

  const setDeckName = useCallback(
    (name: string) => {
      debouncedDecksUpdate(props.deck.id, { name });
      setName(name);
    },
    [props.deck.id]
  );

  return (
    <>
      <Input label="Deck Name" value={name} onChangeText={setDeckName} />
    </>
  );
}

interface IDeckItemProps {
  question: RecordOf<IQuestion>;
  navigation: NavigationProp<any>;
  setDeleteId(id: number): void;
}

function QuestionItem(props: IDeckItemProps) {
  return (
    <ListItem
      disabled
      description={(textProps) => (
        <QuestionDescription {...textProps} question={props.question} />
      )}
      accessoryRight={() => (
        <>
          <Button
            size="small"
            onPress={() =>
              props.navigation.navigate(QUESTION_EDIT_SCREEN, {
                deckId: props.question.deckId,
                questionId: props.question.id,
              })
            }
            accessoryLeft={(props) => <Icon {...props} name="edit-outline" />}
          />
          <Button
            size="small"
            status="danger"
            onPress={() => props.setDeleteId(props.question.id)}
            accessoryLeft={(props) => <Icon {...props} name="trash-outline" />}
          />
        </>
      )}
    />
  );
}

interface IQuestionDescriptionProps extends TextProps {
  question: RecordOf<IQuestion>;
}

function QuestionDescription(props: IQuestionDescriptionProps) {
  if (isFlashCardQuestion(props.question)) {
    return (
      <>
        <Markdown>{props.question.front}</Markdown>
        <Markdown>{props.question.back}</Markdown>
      </>
    );
  } else {
    return null as any;
  }
}

interface IDeleteModalProps {
  question?: RecordOf<IQuestion>;
  onClose(): void;
  onDelete(): void;
}

function DeleteModal(props: IDeleteModalProps) {
  return (
    <ModalSmall
      title="Delete Question?"
      open={!!props.question}
      onClose={props.onClose}
    >
      {props.question && (
        <Button
          onPress={() => {
            props.onDelete();
            props.onClose;
          }}
        >
          {`Delete ${props.question.id}?`}
        </Button>
      )}
    </ModalSmall>
  );
}
