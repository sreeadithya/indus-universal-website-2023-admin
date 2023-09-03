<script>
  import Nav from "$lib/nav.svelte";
  import "../app.css";
  import Notifications from "svelte-notifications";
</script>

<Notifications>
  <div class="grid grid-cols-12">
    <Nav />
    <slot />
  </div>
</Notifications>
