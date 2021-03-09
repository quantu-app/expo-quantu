import {
  questionsGetAction,
  questionsAllAction,
  questionsCreateAction,
  questionsDeleteAction,
  questionsUpdateAction,
} from "./actions";
import { IQuestionJSON, QuestionType } from "./definitions";
import { store } from "..";
import { selectQuestionById } from "./selectors";
import { debounce } from "@aicacia/debounce";

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function questionsGet(id: number, force = true) {
  if (!force || selectQuestionById(store.getState(), id)) {
    return;
  }
  store.dispatch(questionsGetAction.pending.create(id));
  await wait(1000);
  store.dispatch(
    questionsGetAction.success.create({
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

export async function questionsAllForDeck(deckId: number) {
  store.dispatch(questionsAllAction.pending.create(deckId));
  await wait(1000);
  store.dispatch(
    questionsAllAction.success.create([
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

export async function questionsCreate(deckId: number, type: QuestionType) {
  store.dispatch(questionsCreateAction.pending.create({ type, deckId }));
  await wait(1000);
  store.dispatch(
    questionsCreateAction.success.create({
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

export async function questionsUpdate(
  id: number,
  question: Partial<IQuestionJSON>
) {
  store.dispatch(questionsUpdateAction.pending.create({ id, question }));
  await wait(1000);
  store.dispatch(
    questionsUpdateAction.success.create({
      id,
      type: QuestionType.FlashCard,
      deck_id: 1,
      created_at: "2021-03-06T13:47:55.580Z",
      front: "# Front",
      back: "# Back",
      ...question,
      updated_at: new Date().toJSON(),
    })
  );
}

export const debouncedQuestionsUpdate = debounce(questionsUpdate, 1000);

export async function questionsDelete(deckId: number) {
  store.dispatch(questionsDeleteAction.pending.create(deckId));
  await wait(1000);
  store.dispatch(questionsDeleteAction.success.create(undefined));
}
