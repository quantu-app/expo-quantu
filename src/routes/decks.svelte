<script lang="ts">
  import { TextField, Button, Icon, ListItem } from "svelte-materialify";
  import { mdiPen, mdiPlus, mdiTrashCan } from "@mdi/js";
  import { createDeck, decks } from "../state/decks";

  const deckState = $decks;
  let name = "";
</script>

<svelte:head>
  <title>Decks</title>
</svelte:head>

<TextField bind:value={name} />
<Button disabled={!name} on:click={() => createDeck(name)}>
  <Icon path={mdiPlus} />
</Button>

{#each deckState.table.rows as deck}
  <ListItem>
    {deck.name}
    <span slot="append">
      <Button href={`/decks/${deck.id}/edit`}>
        <Icon path={mdiPen} />
      </Button>
      <Button on:click={() => console.log(`Delete ${deck.id}`)}>
        <Icon path={mdiTrashCan} />
      </Button>
    </span>
  </ListItem>
{/each}