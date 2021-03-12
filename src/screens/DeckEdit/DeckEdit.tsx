import React, { useCallback, useState } from "react";
import {
  Button,
  Card,
  Input,
  ListItem,
  List,
  Icon,
  TextProps,
  Divider,
  Select,
  SelectItem,
  IndexPath,
} from "@ui-kitten/components";
import {
  DECK_EDIT_SCREEN,
  QUESTION_EDIT_SCREEN,
  ParamList,
} from "../../navigationConfig";
import { NavigationProp, useNavigation } from "@react-navigation/core";
import { ModalSmall } from "../../Modal";
import { Markdown } from "../../Markdown";
import { IDeck, updateDeckDebounced, useDecks } from "../../state/decks";
import {
  createQuestion,
  deleteQuestion,
  IQuestion,
  QuestionType,
  useQuestions,
} from "../../state/questions";
import { TableRow } from "automerge";

export function DeckEdit(props: ParamList[typeof DECK_EDIT_SCREEN]) {
  const navigation = useNavigation(),
    deck = useDecks((state) => state.table.byId(props.deckId)),
    questions = useQuestions((state) =>
      state.table.rows.filter((row) => row.deckId === props.deckId)
    ),
    [deleteId, setDeleteId] = useState<string | undefined>(undefined);

  return (
    <Card disabled>
      {deck ? (
        <>
          <DeckEditForm deck={deck} />
          <CreateQuestion deckId={deck.id} />
        </>
      ) : null}
      <List
        data={questions}
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
          deleteId
            ? questions.find((question) => question.id === deleteId)
            : undefined
        }
        onDelete={() => deleteId && deleteQuestion(deleteId)}
        onClose={() => setDeleteId(undefined)}
      />
    </Card>
  );
}

interface ICreateQuestionProps {
  deckId: string;
}

const QUESTION_TYPE_VALUE = [QuestionType.FlashCard],
  QUESTION_TYPE_DISPLAY = ["FlashCard"];

function CreateQuestion(props: ICreateQuestionProps) {
  const [index, setIndex] = useState(new IndexPath(0)),
    [type, setType] = useState(QuestionType.FlashCard);

  const onSelect = useCallback((index: IndexPath | IndexPath[]) => {
    if (!Array.isArray(index)) {
      setIndex(index);
      setType(QUESTION_TYPE_VALUE[index.row]);
    }
  }, []);

  const onCreateQuestion = useCallback(() => {
    createQuestion(type, props.deckId);
  }, [props.deckId]);

  return (
    <Select
      label="Question Type"
      accessoryRight={(props) => (
        <Button
          {...props}
          size="small"
          status="success"
          onPress={onCreateQuestion}
          accessoryRight={(props) => <Icon {...props} name="plus-outline" />}
        />
      )}
      selectedIndex={index}
      value={QUESTION_TYPE_DISPLAY[index.row]}
      onSelect={onSelect}
    >
      <SelectItem title={"FlashCard"} />
    </Select>
  );
}

interface IDeckEditFormProps {
  deck: IDeck & TableRow;
}

function DeckEditForm(props: IDeckEditFormProps) {
  const [name, setName] = useState(props.deck.name);

  const setDeckName = useCallback(
    (name: string) => {
      updateDeckDebounced(props.deck.id, { name });
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
  question: IQuestion & TableRow;
  navigation: NavigationProp<any>;
  setDeleteId(id: string): void;
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
  question: IQuestion & TableRow;
}

function QuestionDescription(props: IQuestionDescriptionProps) {
  if (props.question.type === QuestionType.FlashCard) {
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
  question?: IQuestion & TableRow;
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
