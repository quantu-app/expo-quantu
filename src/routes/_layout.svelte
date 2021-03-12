<script lang="ts">
  import Nav from "../components/Nav.svelte";
  import { Container, MaterialApp } from "svelte-materialify";

  export let segment: string;
</script>

<MaterialApp>
  <Nav {segment} />
  <Container>
    <slot />
  </Container>
</MaterialApp>
