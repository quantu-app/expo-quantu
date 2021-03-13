<script lang="ts">
  import Nav from "../components/Nav.svelte";
  import { Container, MaterialApp } from "svelte-materialify";
</script>

<MaterialApp>
  <Nav />
  <Container>
    <slot />
  </Container>
</MaterialApp>
