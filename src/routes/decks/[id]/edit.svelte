<script context="module" lang="ts">
	export function preload({ params }: { params: any }) {
		const { id } = params;
		return { id }
	}
</script>
<script lang="ts">
  import { goto } from "@sapper/app";
  import {  Button, Icon, ListItem } from "svelte-materialify";
  import { mdiPen, mdiPlus, mdiTrashCan } from "@mdi/js";
  import { createQuestion, deleteQuestion, questionStore, QuestionType } from "../../../state/questions";

  export let id: string;
</script>

<svelte:head>
  <title>Decks</title>
</svelte:head>

<Button on:click={() => createQuestion(QuestionType.FlashCard, id)}>
  <Icon path={mdiPlus} />
</Button>

{#each $questionStore.table.rows.filter(question => question.deckId === id) as question}
  <ListItem>
    <span slot="append">
      <Button on:click={() => goto(`/decks/${id}/questions/${question.id}/edit`)}>
        <Icon path={mdiPen} />
      </Button>
      <Button on:click={() => deleteQuestion(question.id)}>
        <Icon path={mdiTrashCan} />
      </Button>
    </span>
  </ListItem>
{/each}