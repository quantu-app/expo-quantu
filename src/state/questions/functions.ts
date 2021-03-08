import {
  questionGetAction,
  questionAllAction,
  questionCreateAction,
  questionsDeleteAction,
} from "./actions";
import { QuestionType } from "./definitions";
import { store } from "..";
import { selectQuestionById } from "./selectors";

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function questionsGet(id: number, force = false) {
  if (!force || selectQuestionById(store.getState(), id)) {
    return;
  }
  store.dispatch(questionGetAction.pending.create(id));
  await wait(1000);
  store.dispatch(
    questionGetAction.success.create({
      id: 1,
      type: QuestionType.FlashCard,
      deck_id: 1,
      created_at: "2021-03-06T13:47:55.580Z",
      updated_at: "2021-03-06T13:47:55.580Z",
      front: "# Front",
      back: "# Back",
    })
  );
}

export async function questionAllForDeck(deckId: number) {
  store.dispatch(questionAllAction.pending.create(deckId));
  await wait(1000);
  store.dispatch(
    questionAllAction.success.create([
      {
        id: 1,
        type: QuestionType.FlashCard,
        deck_id: deckId,
        created_at: "2021-03-06T13:47:55.580Z",
        updated_at: "2021-03-06T13:47:55.580Z",
        front: "# Front",
        back: "# Back",
      },
    ])
  );
}

export async function questionCreate(deckId: number, type: QuestionType) {
  store.dispatch(questionCreateAction.pending.create({ type, deckId }));
  await wait(1000);
  store.dispatch(
    questionCreateAction.success.create({
      id: 1,
      type,
      deck_id: deckId,
      created_at: "2021-03-06T13:47:55.580Z",
      updated_at: "2021-03-06T13:47:55.580Z",
      front: "# Front",
      back: "# Back",
    })
  );
}

export async function questionsDelete(deckId: number) {
  store.dispatch(questionsDeleteAction.pending.create(deckId));
  await wait(1000);
  store.dispatch(questionsDeleteAction.success.create(undefined));
}
