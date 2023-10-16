<script>
  import { onAuthStateChanged } from "firebase/auth";
  import { auth, logOutButton } from "../routes/firebase";

  import { page } from "$app/stores";

  import { onDestroy, onMount } from "svelte";

  let announcementsActive = false;
  let galleryActive = false;
  let departmentMembersActive = false;
  let alumniActive = false;

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

  let showLoggedIn = false;
  let uid;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      showLoggedIn = true;
    } else {
      showLoggedIn = false;
    }
  });
</script>

<!-- ! HTML for the main page -->
{#if showLoggedIn}
  <main class="h-full p-10 max-[1000px]:flex max-[1000px]:flex-col-reverse">
    <div
      class=" text-[#ffffff80] absolute bottom-12 max-[1000px]:static max-[1000px]:flex max-[1000px]:justify-between">
      <p>IUS -> Web Admin Panel</p>
      <button
        on:click={logOutButton}
        class="hover:text-[#ff8989] transition-colors">Log Out</button>
    </div>

    <div>
      <ul class="pt-2 mt-3 space-y-2 text-white border-spacing-6">
        <li>
          {#if announcementsActive}
            <a
              href="/announcements"
              on:click={handlePageChange}
              class="flex items-center gap-2 bg-[#171717] rounded-xl px-5 py-2">
              Announcements</a>
          {:else}
            <a
              href="/announcements"
              on:click={handlePageChange}
              class="flex items-center gap-2 px-5 py-2 rounded-xl hover:bg-[#121212] duration-200 transition-colors">
              Announcements</a>
          {/if}
        </li>
        <li>
          {#if galleryActive}
            <a
              href="/gallery"
              on:click={handlePageChange}
              class="flex items-center gap-2 bg-[#171717] rounded-xl px-5 py-2"
              >Gallery</a>
          {:else}
            <a
              href="/gallery"
              on:click={handlePageChange}
              class="flex items-center gap-2 px-5 py-2 rounded-xl hover:bg-[#121212] duration-200 transition-colors">
              Gallery</a>
          {/if}
        </li>
        <li>
          {#if departmentMembersActive}
            <a
              href="/departmentmembers"
              on:click={handlePageChange}
              class="flex items-center gap-2 bg-[#171717] rounded-xl px-5 py-2">
              Department Members</a>
          {:else}
            <a
              href="/departmentmembers"
              on:click={handlePageChange}
              class="flex items-center gap-2 px-5 py-2 rounded-xl hover:bg-[#121212] duration-200 transition-colors">
              Department Members</a>
          {/if}
        </li>
        <li>
          {#if alumniActive}
            <a
              href="/alumni"
              on:click={handlePageChange}
              class="flex items-center gap-2 px-5 py-2 bg-[#171717] rounded-xl">
              Alumni</a>
          {:else}
            <a
              href="/alumni"
              on:click={handlePageChange}
              class="flex items-center gap-2 px-5 py-2 rounded-xl hover:bg-[#121212] duration-200 transition-colors">
              Alumni</a>
          {/if}
        </li>
      </ul>
    </div>
  </main>
{/if}
