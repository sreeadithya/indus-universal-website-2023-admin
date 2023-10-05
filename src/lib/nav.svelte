<script>
  import { onAuthStateChanged } from "firebase/auth";
  import { auth, logOutButton } from "../routes/firebase";

  import { page } from "$app/stores";

  import { onDestroy, onMount } from "svelte";

  let announcementsActive = false;
  let galleryActive = false;
  let departmentMembersActive = false;
  let alumniActive = false;

  // console.error(theme);

  export async function handlePageChange() {
    let path = $page.url.pathname;
    console.log(path);

    announcementsActive = path === "/announcements";
    galleryActive = path === "/gallery";
    departmentMembersActive = path === "/departmentmembers";
    alumniActive = path === "/alumni";
  }

  const unsubscribe = page.subscribe(() => {
    handlePageChange();
  });

  onDestroy(() => {
    unsubscribe();
  });

  onMount(() => {
    handlePageChange();
  });

  let showLoggedIn = "none";
  let showLoggedOut = "none";
  let uid;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      showLoggedIn = "block";
      showLoggedOut = "none";
    } else {
      showLoggedIn = "none";
      showLoggedOut = "block";
    }
  });
</script>

<main
  class="h-full p-10 max-[1000px]:flex max-[1000px]:flex-col-reverse"
  style="display: {showLoggedIn}">
  <div
    class=" text-[#ffffff80] absolute bottom-12 max-[1000px]:static max-[1000px]:flex max-[1000px]:justify-between">
    <p>IUS -> Web Admin Panel</p>
    <button
      on:click={logOutButton}
      class="hover:text-[#ff8989] transition-colors">Log Out</button>
  </div>

  <div>
    <ul class="border-spacing-6 space-y-2 mt-3 text-white pt-2">
      <li>
        {#if announcementsActive}
          <a
            href="/announcements"
            on:click={handlePageChange}
            class="flex items-center gap-2 bg-[#151515] rounded-xl px-5 py-2">
            Announcements</a>
        {:else}
          <a
            href="/announcements"
            on:click={handlePageChange}
            class="flex items-center gap-2 px-5 py-2 dark:bg-zinc-900 rounded-xl">
            Announcements</a>
        {/if}
      </li>
      <li>
        {#if galleryActive}
          <a
            href="/gallery"
            on:click={handlePageChange}
            class="flex items-center gap-2 bg-[#151515] rounded-xl px-5 py-2"
            >Gallery</a>
        {:else}
          <a
            href="/gallery"
            on:click={handlePageChange}
            class="flex items-center gap-2 px-5 py-2 dark:bg-zinc-900 rounded-xl">
            Gallery</a>
        {/if}
      </li>
      <li>
        {#if departmentMembersActive}
          <a
            href="/departmentmembers"
            on:click={handlePageChange}
            class="flex items-center gap-2 bg-[#151515] rounded-xl px-5 py-2">
            Department Members</a>
        {:else}
          <a
            href="/departmentmembers"
            on:click={handlePageChange}
            class="flex items-center gap-2 px-5 py-2 dark:bg-zinc-900 rounded-xl">
            Department Members</a>
        {/if}
      </li>
      <li>
        {#if alumniActive}
          <a
            href="/alumni"
            on:click={handlePageChange}
            class="flex items-center gap-2 bg-zinc-700 rounded-xl px-5 py-2">
            Alumni</a>
        {:else}
          <a
            href="/alumni"
            on:click={handlePageChange}
            class="flex items-center gap-2 px-5 py-2 dark:bg-zinc-900 rounded-xl">
            Alumni</a>
        {/if}
      </li>
    </ul>
  </div>
</main>
