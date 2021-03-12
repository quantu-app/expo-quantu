<script lang="ts">
  import {
    NavigationDrawer,
    List,
    Overlay,
    AppBar,
    Button,
    Icon,
    Menu,
    ListItem,
  } from "svelte-materialify";
  import { mdiMenu, mdiAccount, mdiHome, mdiLogout } from "@mdi/js";

  export let segment: string;

  let active = false;

  function close() {
    active = false;
  }
  function open() {
    active = true;
  }
</script>

<AppBar>
  <div slot="icon">
    <Button fab depressed on:click={active ? close : open}>
      <Icon path={mdiMenu} />
    </Button>
  </div>
  <span slot="title">QuantU {segment || ""}</span>
  <div style="flex-grow:1" />
  <Menu right>
    <div slot="activator">
      <Button fab depressed>
        <Icon path={mdiAccount} />
      </Button>
    </div>
    <ListItem href="."
      ><span slot="prepend"><Icon path={mdiHome} /></span> Home</ListItem
    >
    <ListItem href="/account"
      ><span slot="prepend"><Icon path={mdiAccount} /></span> Account</ListItem
    >
    <ListItem
      ><span slot="prepend"><Icon path={mdiLogout} /></span> Sign out</ListItem
    >
  </Menu>
</AppBar>
<NavigationDrawer absolute {active}>
  <List nav>
    <ListItem />
    <ListItem href=".">
      <span slot="prepend">
        <Icon path={mdiHome} />
      </span>
      Home
    </ListItem>
    <ListItem href="/decks">
      <span slot="prepend">
        <Icon path={mdiAccount} />
      </span>
      Decks
    </ListItem>
    <ListItem href="/account">
      <span slot="prepend">
        <Icon path={mdiAccount} />
      </span>
      Account
    </ListItem>
  </List>
  <span slot="append">
    <Button block>
      <Icon path={mdiLogout} />
      Sign out
    </Button>
  </span>
</NavigationDrawer>
<Overlay index={1} {active} on:click={close} absolute />
