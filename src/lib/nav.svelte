<script>
  import { onAuthStateChanged } from "firebase/auth";
  import { auth, logOutButton } from "../routes/firebase";

  import { page } from "$app/stores";

  import { onDestroy, onMount } from "svelte";

  let theme = localStorage.getItem("theme") || "light";

  function toggleDarkMode() {
    if (theme == "light") {
      theme = "dark";
      document.documentElement.classList.add("dark");
    } else {
      theme = "light";
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    location.reload();
  }

  // let theme = localStorage.getItem("theme");

  // console.log(theme);

  // function toggleDarkMode() {

  //   if (theme == "light") {
  //     theme = "dark";
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     theme = "light";
  //     document.documentElement.classList.remove("dark");
  //   }
  //   localStorage.setItem("theme", theme);
  // }

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

<nav class="col-span-2" style="display: {showLoggedIn}">
  <div class="fixed pl-4 pr-5 h-full w-[18%]">
    <ul class="border-spacing-6 space-y-2 mt-3 text-black dark:text-white pt-2">
      <li>
        {#if announcementsActive}
          <a
            href="/announcements"
            on:click={handlePageChange}
            class="flex items-center gap-2 bg-[#9FB4CE] dark:bg-zinc-700 rounded-xl px-5 py-2"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              class="fill-black dark:fill-white"
              viewBox="0 0 256 256"
              ><path
                d="M240,120a48.05,48.05,0,0,0-48-48H152.2c-2.91-.17-53.62-3.74-101.91-44.24A16,16,0,0,0,24,40V200a16,16,0,0,0,26.29,12.25c37.77-31.68,77-40.76,93.71-43.3v31.72A16,16,0,0,0,151.12,214l11,7.33A16,16,0,0,0,186.5,212l11.77-44.36A48.07,48.07,0,0,0,240,120ZM40,199.93V40h0c42.81,35.91,86.63,45,104,47.24v65.48C126.65,155,82.84,164.07,40,199.93Zm131,8,0,.11-11-7.33V168h21.6ZM192,152H160V88h32a32,32,0,1,1,0,64Z" /></svg>
            Announcements</a>
        {:else}
          <a
            href="/announcements"
            on:click={handlePageChange}
            class="flex items-center gap-2 px-5 py-2 bg-slate-300 dark:bg-zinc-900 rounded-xl"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              class="fill-black dark:fill-white"
              viewBox="0 0 256 256"
              ><path
                d="M240,120a48.05,48.05,0,0,0-48-48H152.2c-2.91-.17-53.62-3.74-101.91-44.24A16,16,0,0,0,24,40V200a16,16,0,0,0,26.29,12.25c37.77-31.68,77-40.76,93.71-43.3v31.72A16,16,0,0,0,151.12,214l11,7.33A16,16,0,0,0,186.5,212l11.77-44.36A48.07,48.07,0,0,0,240,120ZM40,199.93V40h0c42.81,35.91,86.63,45,104,47.24v65.48C126.65,155,82.84,164.07,40,199.93Zm131,8,0,.11-11-7.33V168h21.6ZM192,152H160V88h32a32,32,0,1,1,0,64Z" /></svg>
            Announcements</a>
        {/if}
      </li>
      <li>
        {#if galleryActive}
          <a
            href="/gallery"
            on:click={handlePageChange}
            class="flex items-center gap-2 bg-[#9FB4CE] dark:bg-zinc-700 rounded-xl px-5 py-2"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              class="fill-black dark:fill-white"
              viewBox="0 0 256 256"
              ><path
                d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z" /></svg
            >Gallery</a>
        {:else}
          <a
            href="/gallery"
            on:click={handlePageChange}
            class="flex items-center gap-2 px-5 py-2 bg-slate-300 dark:bg-zinc-900 rounded-xl"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              class="fill-black dark:fill-white"
              viewBox="0 0 256 256"
              ><path
                d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z" /></svg
            >Gallery</a>
        {/if}
      </li>
      <li>
        {#if departmentMembersActive}
          <a
            href="/departmentmembers"
            on:click={handlePageChange}
            class="flex items-center gap-2 bg-[#9FB4CE] dark:bg-zinc-700 rounded-xl px-5 py-2"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              class="fill-black dark:fill-white"
              viewBox="0 0 256 256"
              ><path
                d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z" /></svg
            >Department Members</a>
        {:else}
          <a
            href="/departmentmembers"
            on:click={handlePageChange}
            class="flex items-center gap-2 px-5 py-2 bg-slate-300 dark:bg-zinc-900 rounded-xl"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              class="fill-black dark:fill-white"
              viewBox="0 0 256 256"
              ><path
                d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z" /></svg
            >Department Members</a>
        {/if}
      </li>
      <li>
        {#if alumniActive}
          <a
            href="/alumni"
            on:click={handlePageChange}
            class="flex items-center gap-2 bg-zinc-700 rounded-xl px-5 py-2"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              class="fill-black dark:fill-white"
              viewBox="0 0 256 256"
              ><path
                d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z" /></svg
            >Alumni</a>
        {:else}
          <a
            href="/alumni"
            on:click={handlePageChange}
            class="flex items-center gap-2 px-5 py-2 bg-slate-300 dark:bg-zinc-900 rounded-xl"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              class="fill-black dark:fill-white"
              viewBox="0 0 256 256"
              ><path
                d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z" /></svg
            >Alumni</a>
        {/if}
      </li>
    </ul>
    <div
      class="absolute bottom-1 flex align-middle justify-between text-white w-[15vw]">
      <a href="/"
        ><img
          src="./logo-white.svg"
          class="h-10 mb-5 invert dark:invert-0"
          alt="logo" /></a>
      <button
        on:click={logOutButton}
        class="px-5 py-2 h-10 rounded-lg outline-[0.5px] border dark:border-white border-stone-900 text-black dark:text-white hover:bg-[#ff8989] transition-colors"
        >Log Out</button>
      <button
        on:click={toggleDarkMode}
        class="  px-3 py-2 h-10 rounded-lg outline-[0.5px] border dark:border-white border-stone-900 transition-colors">
        {#if theme == "light"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="#000"
            viewBox="0 0 256 256"
            ><path
              d="M240,96a8,8,0,0,1-8,8H216v16a8,8,0,0,1-16,0V104H184a8,8,0,0,1,0-16h16V72a8,8,0,0,1,16,0V88h16A8,8,0,0,1,240,96ZM144,56h8v8a8,8,0,0,0,16,0V56h8a8,8,0,0,0,0-16h-8V32a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16Zm72.77,97a8,8,0,0,1,1.43,8A96,96,0,1,1,95.07,37.8a8,8,0,0,1,10.6,9.06A88.07,88.07,0,0,0,209.14,150.33,8,8,0,0,1,216.77,153Zm-19.39,14.88c-1.79.09-3.59.14-5.38.14A104.11,104.11,0,0,1,88,64c0-1.79,0-3.59.14-5.38A80,80,0,1,0,197.38,167.86Z" /></svg>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="#ffffff"
            viewBox="0 0 256 256"
            ><path
              d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z" /></svg>
        {/if}
      </button>
    </div>
  </div>
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
  }
</style>
