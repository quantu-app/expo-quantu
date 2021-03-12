<script context="module" lang="ts">
  export function preload({ params }: { params: any }) {
    const { id } = params;
    return { id };
  }
</script>

<script lang="ts">
  import marked from "marked";
  import { goto } from "@sapper/app";
  import { Button, Icon, ListItem, TextField } from "svelte-materialify";
  import { mdiPen, mdiPlus, mdiTrashCan } from "@mdi/js";
  import {
    createQuestion,
    deleteQuestion,
    questionStore,
    QuestionType,
  } from "../../../state/questions";
  import { deckStore, updateDeckDebounced } from "../../../state/decks";

  export let id: string;
  let name = $deckStore.table.byId(id)?.name || "";

  function onChangeName() {
    updateDeckDebounced(id, { name });
  }
</script>

<svelte:head>
  <title>Decks</title>
</svelte:head>

<TextField bind:value={name} on:input={onChangeName} />

<Button on:click={() => createQuestion(QuestionType.FlashCard, id)}>
  <Icon path={mdiPlus} />
</Button>

{#each $questionStore.table.rows.filter((question) => question.deckId === id) as question}
  <ListItem>
    {@html marked(question.front)}
    {@html marked(question.back)}
    <span slot="append">
      <Button
        on:click={() => goto(`/decks/${id}/questions/${question.id}/edit`)}
      >
        <Icon path={mdiPen} />
      </Button>
      <Button on:click={() => deleteQuestion(question.id)}>
        <Icon path={mdiTrashCan} />
      </Button>
    </span>
  </ListItem>
{/each}
