<script context="module" lang="ts">
  export function preload({ params }: { params: { deckId: string } }) {
    return params;
  }
</script>

<script lang="ts">
  import marked from "marked";
  import { goto } from "@sapper/app";
  import {
    Button,
    Icon,
    ListItem,
    Dialog,
    TextField,
  } from "svelte-materialify";
  import { mdiArrowLeft, mdiPen, mdiPlus, mdiTrashCan } from "@mdi/js";
  import {
    createQuestion,
    deleteQuestion,
    questionStore,
    QuestionType,
  } from "../../../state/questions";
  import { deckStore, updateDeckDebounced } from "../../../state/decks";

  export let deckId: string;
  let name = $deckStore.table.byId(deckId)?.name || "";
  let deleteQuestionId: string;
  let deleteOpen = false;

  function onChangeName() {
    updateDeckDebounced(deckId, { name });
  }
</script>

<svelte:head>
  <title>Decks</title>
</svelte:head>

<Button text class="mb-4" on:click={() => goto("/decks")}
  ><Icon class="mr-2" path={mdiArrowLeft} /> Back</Button
>

<TextField bind:value={name} on:input={onChangeName}>
  Edit Deck Name
  <Button
    fab
    size="small"
    slot="append-outer"
    class="green white-text"
    on:click={() => createQuestion(QuestionType.FlashCard, deckId)}
  >
    <Icon path={mdiPlus} />
  </Button>
</TextField>

{#each $questionStore.table.rows.filter((question) => question.deckId === deckId) as question}
  <ListItem>
    {@html marked(question.front)}
    {@html marked(question.back)}
    <span slot="append">
      <Button
        fab
        size="small"
        on:click={() => goto(`/decks/${deckId}/questions/${question.id}/edit`)}
        class="primary-color"
      >
        <Icon path={mdiPen} />
      </Button>
      <Button
        fab
        size="small"
        on:click={() => {
          deleteQuestionId = question.id;
          deleteOpen = true;
        }}
        class="red white-text"
      >
        <Icon path={mdiTrashCan} />
      </Button>
    </span>
  </ListItem>
{/each}

<Dialog class="pa-4 text-center" bind:active={deleteOpen}>
  <h3>Delete Question {$questionStore.table.byId(deleteQuestionId)?.id}</h3>
  <Button
    class="red white-text"
    on:click={() => {
      deleteOpen = false;
      deleteQuestion(deleteQuestionId);
    }}>Confirm Delete</Button
  >
</Dialog>
