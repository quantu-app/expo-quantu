<script context="module" lang="ts">
  export function preload({
    params,
  }: {
    params: { deckId: string; questionId: string };
  }) {
    return params;
  }
</script>

<script lang="ts">
  import marked from "marked";
  import { goto } from "@sapper/app";
  import {
    Row,
    Col,
    Icon,
    Button,
    Textarea,
    Divider,
  } from "svelte-materialify";
  import {
    questionStore,
    updateQuestionDebounced,
  } from "../../../../../state/questions";
  import { deckStore } from "../../../../../state/decks";
  import { mdiArrowLeft, mdiTableRow } from "@mdi/js";

  export let deckId: string;
  export let questionId: string;
  let name = $deckStore.table.byId(deckId)?.name || "";
  let front = $questionStore.table.byId(questionId)?.front || "";
  let back = $questionStore.table.byId(questionId)?.back || "";

  function onChangeFront() {
    updateQuestionDebounced(questionId, { front });
  }
  function onChangeBack() {
    updateQuestionDebounced(questionId, { back });
  }
</script>

<svelte:head>
  <title>{name} Question Edit</title>
</svelte:head>

<Button text class="mb-4" on:click={() => goto(`/decks/${deckId}/edit`)}
  ><Icon class="mr-2" path={mdiArrowLeft} /> Back</Button
>

<div class="d-flex">
  <h3>{name}</h3>
  <div style="flex-grow:1" />
  <a target="_blank" href="https://spec.commonmark.org/0.29/#what-is-markdown-"
    >What is markdown</a
  >
</div>
<Divider class="mb-4" />

<div class="container">
  <Row class="align-center">
    <Col offset={4} cols={4}>
      <div>
        <Textarea
          bind:value={front}
          on:input={onChangeFront}
          outlined
          autogrow
          rows={front.split("\n").length}>Front</Textarea
        >
        {@html marked(front)}
      </div>
      <Divider class="ma-4" />
      <div>
        <Textarea
          bind:value={back}
          on:input={onChangeBack}
          outlined
          autogrow
          rows={back.split("\n").length}>Back</Textarea
        >
        {@html marked(back)}
      </div>
    </Col>
  </Row>
</div>
