<script>
  import Nav from "$lib/nav.svelte";
  import "../app.css";
  import Notifications from "svelte-notifications";
</script>

<Notifications>
  <div class="grid grid-cols-12 bg-gray-950">
    <Nav />
    <!-- <div class=""> -->
    <slot />
    <!-- </div> -->
  </div>
</Notifications>
