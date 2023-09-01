<script>
  import Nav from "$lib/nav.svelte";
  import "../app.css";
</script>

<div class="grid grid-cols-12">
  <Nav />
  <slot />
</div>
