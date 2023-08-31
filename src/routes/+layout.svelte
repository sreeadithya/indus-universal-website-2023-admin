<script>
  import Nav from "$lib/nav.svelte";
</script>

<div id="mainDiv">
  <Nav />
  <slot />
</div>

<style>
  #mainDiv {
    display: flex;
  }
</style>
