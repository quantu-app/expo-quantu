<script lang="ts">
  import { goto } from "@sapper/app";
  import { TextField, Button, Icon, ListItem } from "svelte-materialify";
  import { mdiPen, mdiPlus, mdiTrashCan } from "@mdi/js";
  import { createDeck, deckStore, deleteDeck } from "../state/decks";

  let name = "";
</script>

<svelte:head>
  <title>Decks</title>
</svelte:head>

<TextField bind:value={name} />
<Button disabled={!name} on:click={() => createDeck(name)}>
  <Icon path={mdiPlus} />
</Button>

{#each $deckStore.table.rows as deck}
  <ListItem>
    {deck.name}
    <span slot="append">
      <Button on:click={() => goto(`/decks/${deck.id}/edit`)}>
        <Icon path={mdiPen} />
      </Button>
      <Button on:click={() => deleteDeck(deck.id)}>
        <Icon path={mdiTrashCan} />
      </Button>
    </span>
  </ListItem>
{/each}