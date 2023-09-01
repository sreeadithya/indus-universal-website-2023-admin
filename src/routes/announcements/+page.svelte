<script>
  // import stuff
  import { createEditor } from "svelte-editorjs";
  import Header from "@editorjs/header";
  import Underline from "@editorjs/underline";
  import List from "@editorjs/list";
  import { db } from "../firebase";
  import { onMount } from "svelte";
  import { ref, set, get, child } from "firebase/database";

  let announcements;
  let announcementsTitles = [];
  let pinnedAnnouncements = [];
  let normalAnnouncements = [];
  let pinnedAnnouncementsTitles = [];
  let normalAnnouncementsTitles = [];
  onMount(() => {
    get(ref(db, "announcements/")).then((snapshot) => {
      if (snapshot.exists()) {
        announcements = snapshot.val();
        // console.log(announcements);
        // console.log(Object.keys(announcements).length);
        announcementsTitles = Object.keys(announcements);

        for (let i = 0; i < announcementsTitles.length; i++) {
          if (announcements[announcementsTitles[i]].pinned == true) {
            pinnedAnnouncements = [
              ...pinnedAnnouncements,
              announcements[announcementsTitles[i]],
            ];
          } else {
            normalAnnouncements = [
              ...normalAnnouncements,
              announcements[announcementsTitles[i]],
            ];
          }
        }
        pinnedAnnouncementsTitles = Object.keys(pinnedAnnouncements);
        normalAnnouncementsTitles = Object.keys(normalAnnouncements);
      } else {
        console.log("No data available");
      }
    });
  });

  const { editor, data, isReady } = createEditor({
    tools: {
      Header,
      Underline,
      List: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: "unordered",
        },
      },
    },
  });

  let showNewAnnouncement = "none";
  let pinned = false;
  let date = null;
  let titleAnnouncement;

  function publishData() {
    set(ref(db, "announcements/" + titleAnnouncement), {
      title: titleAnnouncement,
      data: $data,
      pinned: pinned,
      date: date,
    });

    console.log($data);
  }
</script>

<main class="p-5 pl-10 pr-10 col-span-10 h-screen">
  <!-- <nav
    class="pb-5 border-b border-b-netural-400 flex justify-between items-center"
  >
    <p><span class="text-neutral-400">Home /</span> Announcements</p>
    <input placeholder="Search" class="px-5 py-3 rounded-lg bg-gray-100" />
  </nav> -->
  <div class="flex justify-between py-5">
    <h1 class="text-2xl font-extrabold mb-0">Announcements</h1>
    <button
      class="px-5 py-2 rounded-lg bg-blue-700 text-white"
      on:click={() => {
        if (showNewAnnouncement == "none") {
          showNewAnnouncement = "flex";
          $data = {
            time: 0,
            blocks: [
              {
                type: "paragraph",
                data: {
                  text: "Edit the text of the announcement here",
                },
              },
            ],
            version: "2.19.3",
          };
        } else {
          showNewAnnouncement = "none";
        }
      }}>New Announcment</button
    >
  </div>

  <!-- <h2 class="text-lg text-bold">pinned announcements</h2>
  <table class="table-auto">
    <tr>
      <td>first announcement</td>
      <td>edit</td>
      <td>delete</td>
    </tr>
  </table>
  <hr /> -->

  <!-- for (let i = 0; i < announcementsTitles.length; i++) {
    console.log(announcements[announcementsTitles[i]].pinned);
  } -->

  <!-- </p> -->
  <div class="all-announcements py-5 background-neutral-100">
    <h2 class="text-lg font-bold">Pinned Announcements</h2>
    <table class="table-auto min-w-full text-left text-sm font-light border">
      <thead>
        <tr class="border-b">
          <th scope="col" class="px-6 py-4">#</th>
          <th scope="col" class="px-6 py-4">Name of the Anouncement</th>
          <th scope="col" class="px-6 py-4">Date</th>
          <th scope="col" class="px-6 py-4">Options</th>
        </tr>
      </thead>
      <tbody>
        {#each pinnedAnnouncementsTitles as i, y}
          <tr class="border-b-1">
            <td class="whitespace-nowrap px-6 py-4">{y + 1}</td>
            <td class="whitespace-nowrap px-6 py-4"
              >{pinnedAnnouncements[i].title}</td
            >
            <td class="whitespace-nowrap px-6 py-4"
              >{pinnedAnnouncements[i].date}</td
            >
            <td class="whitespace-nowrap px-6 py-4">edit / delete</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <br /> <br />
    <h2 class="text-lg font-bold">Announcements</h2>
    <table class="table-auto min-w-full text-left text-sm font-light border">
      <thead>
        <tr class="border-b">
          <th scope="col" class="px-6 py-4">#</th>
          <th scope="col" class="px-6 py-4">Name of the Anouncement</th>
          <th scope="col" class="px-6 py-4">Date</th>
          <th scope="col" class="px-6 py-4">Options</th>
        </tr>
      </thead>
      <tbody>
        {#each normalAnnouncementsTitles as i, y}
          <tr class="border-b-1">
            <td class="whitespace-nowrap px-6 py-4">{y + 1}</td>
            <td class="whitespace-nowrap px-6 py-4"
              >{normalAnnouncements[i].title}</td
            >
            <td class="whitespace-nowrap px-6 py-4"
              >{normalAnnouncements[i].date}</td
            >
            <td class="whitespace-nowrap px-6 py-4">edit / delete</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div
    style="display: {showNewAnnouncement};"
    class="absolute bg-[#00000059] top-0 left-0 w-screen h-full flex justify-center items-center"
  >
    <div class="p-5 bg-white w-[50%] rounded-2xl">
      <div class="flex justify-between pb-5">
        <h2 class="text-lg font-bold">Add New Annoucement</h2>
        <button
          on:click={() => {
            showNewAnnouncement = "none";
          }}
        >
          <img src="./XCloseDelete.svg" alt="" title="Close" class="w-5" />
        </button>
      </div>
      <div class="flex flex-row items-center gap-10 pb-5">
        <input
          name=""
          id=""
          class="py-3 pl-5 bg-neutral-100 rounded-lg border col-span-1 border-gray-300"
          placeholder="Title of the Annoucement"
          bind:value={titleAnnouncement}
        />
        <input
          type="date"
          class="py-3 pl-5 w-max bg-neutral-100 rounded-lg border border-gray-300"
          name=""
          id="date"
          bind:value={date}
        />
        <div class="col-span-1">
          <input type="checkbox" id="isPinned" bind:checked={pinned} />
          <label for="isPinned">📌</label>
        </div>
      </div>

      <div class="no-tailwind">
        <div class="editor" use:editor />
      </div>

      <button
        class="px-5 py-2 rounded-lg bg-blue-700 text-white"
        on:click={() => {
          $editor.save();
          const myTimeout = setTimeout(publishData, 50);
        }}>Publish Announcement</button
      >
    </div>
  </div>
</main>

<style>
</style>
