<script>
  import Nav from "$lib/nav.svelte";
  import "../app.css";
</script>

<div class="grid grid-cols-12 bg-slate-200 dark:bg-zinc-950">
  <Nav />
  <!-- <div class=""> -->
  <slot />
  <!-- </div> -->
</div>
