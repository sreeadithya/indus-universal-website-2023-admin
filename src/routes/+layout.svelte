<script>
  import Nav from "$lib/nav.svelte";
  import "../app.css";
</script>

<div
  class="flex flex-row bg-[#0D0D0D] gap-20 max-[1000px]:flex-col max-[1000px]:gap-0 max-[1000px]:overflow-x-hidden">
  <Nav />
  <slot />
</div>
