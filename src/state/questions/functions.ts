import { questionAllAction, questionCreateAction } from "./actions";
import { QuestionType } from "./definitions";
import { store } from "..";

export function questionAllForDeck(deckId: number) {
  store.dispatch(questionAllAction.pending.create(deckId));
  store.dispatch(
    questionAllAction.success.create([
      {
        id: ++ID,
        type: QuestionType.FlashCard,
        deck_id: deckId,
        created_at: "2021-03-06T13:47:55.580Z",
        updated_at: "2021-03-06T13:47:55.580Z",
        front: {},
        back: {},
      },
    ])
  );
}

let ID = 0;
export function questionCreate(deckId: number, type: QuestionType) {
  store.dispatch(questionCreateAction.pending.create({ type, deckId }));
  store.dispatch(
    questionCreateAction.success.create({
      id: ++ID,
      type,
      deck_id: deckId,
      created_at: "2021-03-06T13:47:55.580Z",
      updated_at: "2021-03-06T13:47:55.580Z",
      front: {},
      back: {},
    })
  );
}
