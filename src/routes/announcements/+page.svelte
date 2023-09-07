<script>
  //! Importing required svelte elements
  import EditorJS from "@editorjs/editorjs";
  import Header from "@editorjs/header";
  import Underline from "@editorjs/underline";
  import List from "@editorjs/list";
  import Table from "@editorjs/table";

  let theme = localStorage.getItem("theme");

  if (theme == "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  import { db } from "../firebase";
  import { onMount } from "svelte";
  import { ref, set, get, child, remove } from "firebase/database";
  import { getNotificationsContext } from "svelte-notifications";
  const { addNotification } = getNotificationsContext();

  let userEmail;
  let userPassword;
  let shit;
  let currentAnnouncement;
  let showEditAnnouncement = "none";
  let titleEditAnnouncement;
  let editPinned;
  let editDate;
  let editAnnouncementTitle;

  import { onAuthStateChanged } from "firebase/auth";
  import { auth, logInButton, logOutButton } from "../firebase";

  let showLoggedIn = "none";
  let showLoggedOut = "none";
  let uid;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      showLoggedIn = "block";
      showLoggedOut = "none";
      console.log(user);
    } else {
      showLoggedIn = "none";
      showLoggedOut = "block";
      console.log(user);
      window.location = "/";
    }
  });

  let announcements;
  let announcementsTitles = [];
  let pinnedAnnouncements = [];
  let pinned = false;
  let normalAnnouncements = [];
  let pinnedAnnouncementsTitles = [];
  let normalAnnouncementsTitles = [];

  function getData() {
    announcements = {};
    announcementsTitles = {};
    pinnedAnnouncements = [];
    normalAnnouncements = [];
    pinnedAnnouncementsTitles = [];
    normalAnnouncementsTitles = [];
    get(ref(db, "announcements/")).then((snapshot) => {
      if (snapshot.exists()) {
        announcements = snapshot.val();

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
        announcements = {};
        announcementsTitles = {};
        pinnedAnnouncements = [];
        normalAnnouncements = [];
        pinnedAnnouncementsTitles = [];
        normalAnnouncementsTitles = [];
      }
    });
  }

  onMount(() => {
    getData();
  });

  const editor = new EditorJS({
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
      },
      Underline,
      List: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: "unordered",
        },
      },
      table: {
        class: Table,
        inlineToolbar: true,
      },
    },
    placeholder: "Edit the text of the announcement here",
    holder: "newAnnouncementEditor",
  });

  const editor2 = new EditorJS({
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
      },
      Underline,
      List: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: "unordered",
        },
      },
      table: {
        class: Table,
        inlineToolbar: true,
      },
    },
    placeholder: "Edit the text of the announcement here",
    holder: "editAnnouncementEditor",
  });

  let showNewAnnouncement = "none";

  let date = null;
  let titleAnnouncement;

  function publishData(editorData) {
    if (!titleAnnouncement) {
      addNotification({
        text: "Please add a title",
        position: "bottom-center",
        removeAfter: "5000",
        type: "warning",
      });
      return;
    }
    if (!date) {
      addNotification({
        text: "Please add a date for the announcement",
        position: "bottom-center",
        removeAfter: "5000",
        type: "warning",
      });
      return;
    }
    set(ref(db, "announcements/" + titleAnnouncement.replaceAll(" ", "_")), {
      title: titleAnnouncement,
      data: editorData,
      pinned: pinned,
      date: date,
    })
      .then(() => {
        addNotification({
          text: "Successfully published",
          position: "bottom-center",
          removeAfter: "5000",
          type: "success",
        });
        titleAnnouncement = undefined;
        editor.clear();
        pinned = false;
        date = undefined;
        showNewAnnouncement = "none";
        editor.clear();
      })
      .catch((error) => {
        addNotification({
          text: "There was an error publishing the announcement" + { error },
          position: "bottom-center",
          type: "error",
        });
      });

    // console.log($data);
    setTimeout(getData, 100);
  }

  function editAnnouncement(title) {
    get(ref(db, "announcements/" + title.replaceAll(" ", "_"))).then(
      (snapshot) => {
        currentAnnouncement = snapshot.val();
        editor2.blocks.render(currentAnnouncement.data);
        showEditAnnouncement = "flex";
        editAnnouncementTitle = currentAnnouncement.title;
        editPinned = currentAnnouncement.pinned;
        editDate = currentAnnouncement.date;
        console.log(currentAnnouncement.data);
      }
    );
  }

  function publishEditedData(editorData) {
    if (!editAnnouncementTitle) {
      addNotification({
        text: "Please add a title",
        position: "bottom-center",
        removeAfter: "5000",
        type: "warning",
      });
      return;
    }
    if (!editDate) {
      addNotification({
        text: "Please add a date for the announcement",
        position: "bottom-center",
        removeAfter: "5000",
        type: "warning",
      });
      return;
    }
    set(
      ref(db, "announcements/" + editAnnouncementTitle.replaceAll(" ", "_")),
      {
        title: editAnnouncementTitle,
        data: editorData,
        pinned: editPinned,
        date: editDate,
      }
    )
      .then(() => {
        addNotification({
          text: "Successfully edited",
          position: "bottom-center",
          removeAfter: "5000",
          type: "success",
        });
        showEditAnnouncement = "none";
        editor2.clear();
      })
      .catch((error) => {
        addNotification({
          text: "There was an error editing the announcement" + { error },
          position: "bottom-center",
          type: "error",
        });
      });

    // console.log($data);
    setTimeout(getData, 100);
  }

  function deleteAnnouncement(title) {
    remove(ref(db, "announcements/" + title.replaceAll(" ", "_")));
    setTimeout(getData, 100);
  }
</script>

<main
  class="p-5 pl-10 pr-10 col-span-10 m-5 rounded-xl bg-white dark:bg-zinc-900 dark:text-white"
  style="display: {showLoggedIn}">
  <div class="flex justify-between py-5">
    <h1 class="text-2xl font-extrabold mb-0">Announcements</h1>
    <button
      class="px-5 py-2 rounded-lg bg-zinc-950 text-white"
      on:click={() => {
        if (showNewAnnouncement == "none") {
          showNewAnnouncement = "flex";
        } else {
          showNewAnnouncement = "none";
          editor.clear();
        }
      }}>New Announcement</button>
  </div>

  <div class="h-[83.2vh] overflow-auto">
    <div class="all-announcements py-5 background-neutral-100">
      <h2 class="text-lg font-bold">Pinned Announcements</h2>
      <table class="table-auto w-full text-left text-sm font-light mt-3">
        <thead>
          <tr class="border-b">
            <th scope="col" class="px-6 py-4">#</th>
            <th scope="col" class="px-6 py-4">Name of the Anouncement</th>
            <th scope="col" class="px-6 py-4">Date</th>
            <th scope="col" class="px-6 py-4">Options</th>
          </tr>
        </thead>
        {#each pinnedAnnouncementsTitles as i, y}
          <tr class="border-b-1">
            <td class="whitespace-nowrap px-6 py-4">{y + 1}</td>
            <td class="whitespace-nowrap px-6 py-4"
              >{pinnedAnnouncements[i].title}</td>
            <td class="whitespace-nowrap px-6 py-4"
              >{pinnedAnnouncements[i].date}</td>
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex flex-row gap-5">
                <button
                  class="px-5 hover:bg-gray-200 transition-colors py-2 rounded-lg bg-white outline-[0.5px] outline-stone-900 outline text-black dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                  on:click={editAnnouncement(pinnedAnnouncements[i].title)}
                  >Edit</button>
                <button
                  class="p-2 hover:bg-[#ff9c9c] transition-colors rounded-lg outline-[0.5px] outline-stone-900 outline dark:bg-zinc-700 dark:hover:bg-[#FF8989]"
                  on:click={deleteAnnouncement(pinnedAnnouncements[i].title)}>
                  {#if theme == "light"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="#000000"
                      viewBox="0 0 256 256"
                      ><path
                        d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" /></svg>
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="#ffffff"
                      viewBox="0 0 256 256"
                      ><path
                        d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" /></svg>
                  {/if}
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </table>

      <h2 class="text-lg font-bold mt-10">Announcements</h2>
      <table class="table-auto w-full text-left text-sm font-light mt-3">
        <thead>
          <tr class="border-b">
            <th scope="col" class="px-6 py-4">#</th>
            <th scope="col" class="px-6 py-4">Name of the Anouncement</th>
            <th scope="col" class="px-6 py-4">Date</th>
            <th scope="col" class="px-6 py-4">Options</th>
          </tr>
        </thead>
        {#each normalAnnouncementsTitles as i, y}
          <tr class="border-b-1">
            <td class="whitespace-nowrap px-6 py-4">{y + 1}</td>
            <td class="whitespace-nowrap px-6 py-4"
              >{normalAnnouncements[i].title}</td>
            <td class="whitespace-nowrap px-6 py-4"
              >{normalAnnouncements[i].date}</td>
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex flex-row gap-4">
                <button
                  class="px-5 hover:bg-gray-200 transition-colors py-2 rounded-lg bg-white outline-[0.5px] outline-stone-900 outline text-black dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                  on:click={editAnnouncement(normalAnnouncements[i].title)}
                  >Edit</button>
                <button
                  class="p-2 hover:bg-[#ff9c9c] transition-colors rounded-lg outline-[0.5px] outline-stone-900 outline dark:bg-zinc-700 dark:hover:bg-[#FF8989]"
                  on:click={deleteAnnouncement(normalAnnouncements[i].title)}>
                  {#if theme == "light"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="#000000"
                      viewBox="0 0 256 256"
                      ><path
                        d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" /></svg>
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="#ffffff"
                      viewBox="0 0 256 256"
                      ><path
                        d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" /></svg>
                  {/if}
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </table>
    </div>
  </div>
  <div
    style="display: {showNewAnnouncement};"
    class="absolute bg-[#00000059] top-0 left-0 w-screen h-full flex justify-center items-center">
    <div
      class="p-5 bg-white w-[50%] rounded-2xl dark:bg-zinc-900 dark:text-white">
      <div class="flex justify-between pb-5">
        <h2 class="text-lg font-bold">Add New Annoucement</h2>
        <button
          on:click={() => {
            showNewAnnouncement = "none";
            editor.clear();
          }}>
          {#if theme == "light"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="#000000"
              viewBox="0 0 256 256"
              ><path
                d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" /></svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="#ffffff"
              viewBox="0 0 256 256"
              ><path
                d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" /></svg>
          {/if}
        </button>
      </div>
      <div class="flex pb-5">
        <input
          name=""
          id=""
          class="py-3 pl-5 flex-grow rounded-lg border col-span-1 border-gray-300 dark:bg-zinc-900 dark:text-white"
          placeholder="Title of the Annoucement"
          bind:value={titleAnnouncement} />
      </div>

      <div
        class="prose rounded-lg border max-w-none overflow-auto max-h-[45vh] w-[100%] mr-0 px-5 py-3 mb-4 border-gray-300 dark:bg-zinc-900 dark:text-white">
        <div id="newAnnouncementEditor" />
      </div>

      <div class=" flex flex-row items-center gap-5 justify-between">
        <div class="flex flex-row items-center gap-10">
          <input
            type="date"
            class="py-3 px-4 pl-5 rounded-lg border border-gray-300 dark:bg-zinc-900 dark:text-white"
            name=""
            id="date"
            bind:value={date} />
          <div class="col-span-1">
            <input type="checkbox" id="isPinned" bind:checked={pinned} />
            <label for="isPinned">📌</label>
          </div>
        </div>

        <button
          class="px-5 py-2 rounded-lg bg-zinc-950 text-white"
          on:click={() => {
            editor
              .save()
              .then((outputData) => {
                publishData(outputData);
              })
              .catch((error) => {
                console.log("Saving failed: ", error);
              });
          }}>Publish Announcement</button>
      </div>
    </div>
  </div>

  <!-- Edit announcement -->

  <div
    style="display: {showEditAnnouncement};"
    class="absolute bg-[#00000059] top-0 left-0 w-screen h-full flex justify-center items-center">
    <div
      class="p-5 bg-white w-[50%] rounded-2xl dark:bg-zinc-900 dark:text-white">
      <div class="flex justify-between pb-5">
        <h2 class="text-lg font-bold">Edit announcement</h2>
        <button
          on:click={() => {
            showEditAnnouncement = "none";
            editor2.clear();
          }}>
          <img src="./XCloseDelete.svg" alt="" title="Close" class="w-5" />
        </button>
      </div>

      <div class="flex pb-5">
        <input
          name=""
          id=""
          class="py-3 pl-5 flex-grow rounded-lg border col-span-1 border-gray-300 dark:bg-zinc-900 dark:text-white"
          placeholder={editAnnouncementTitle}
          disabled />
      </div>

      <div
        class="prose rounded-lg border max-w-none w-[100%] overflow-auto max-h-[45vh] mr-0 px-5 py-3 mb-4 border-gray-300 dark:bg-zinc-900 dark:text-white">
        <div id="editAnnouncementEditor" />
      </div>

      <div class=" flex flex-row items-center gap-5 justify-between">
        <div class="flex flex-row items-center gap-10">
          <input
            type="date"
            class="py-3 px-4 pl-5 rounded-lg border border-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
            name=""
            id="date"
            bind:value={editDate} />
          <div class="col-span-1">
            <input type="checkbox" id="isPinned" bind:checked={editPinned} />
            <label for="isPinned">📌</label>
          </div>
        </div>

        <button
          class="px-5 py-2 rounded-lg bg-zinc-950 text-white"
          on:click={() => {
            editor2
              .save()
              .then((outputData) => {
                publishEditedData(outputData);
              })
              .catch((error) => {
                console.log("Saving failed: ", error);
              });
          }}>Publish Changes</button>
      </div>
    </div>
  </div>
</main>

<style>
</style>
