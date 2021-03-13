<script lang="ts">
  import { goto } from "@sapper/app";
  import {
    TextField,
    Button,
    Icon,
    Dialog,
    ListItem,
  } from "svelte-materialify";
  import { mdiClose, mdiPen, mdiPlus, mdiTrashCan } from "@mdi/js";
  import { createDeck, deckStore, deleteDeck } from "../../state/decks";

  let name: string;
  let search: string;
  let deleteDeckId: string;
  let deleteOpen = false;
</script>

<svelte:head>
  <title>Decks</title>
</svelte:head>

<TextField bind:value={name}>
  New Deck name
  <Button
    slot="append-outer"
    disabled={!name}
    fab
    size="small"
    on:click={() => createDeck(name)}
    class="green white-text"
  >
    <Icon path={mdiPlus} />
  </Button>
</TextField>

<TextField bind:value={search} placeholder="Filter">
  <Button
    slot="append-outer"
    disabled={!search}
    on:click={() => (search = "")}
    fab
    size="small"
  >
    <Icon path={mdiClose} />
  </Button>
</TextField>

{#each $deckStore.table.rows.filter((row) => row.name.includes(search)) as deck}
  <ListItem>
    {deck.name}
    <span slot="append">
      <Button
        fab
        size="small"
        on:click={() => goto(`/decks/${deck.id}/edit`)}
        class="primary-color"
      >
        <Icon path={mdiPen} />
      </Button>
      <Button
        fab
        size="small"
        on:click={() => {
          deleteDeckId = deck.id;
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
  <h3>Delete {$deckStore.table.byId(deleteDeckId)?.name}</h3>
  <p>This will delete all data associated with this deck.</p>
  <Button
    class="red white-text"
    on:click={() => {
      deleteOpen = false;
      deleteDeck(deleteDeckId);
    }}>Confirm Delete</Button
  >
</Dialog>
