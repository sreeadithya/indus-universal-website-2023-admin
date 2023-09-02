<script>
  //! Importing required svelte elements
  import EditorJS from "@editorjs/editorjs";
  import Header from "@editorjs/header";
  import Underline from "@editorjs/underline";
  import List from "@editorjs/list";
  import ImageTool from "@editorjs/image";

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
      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
            byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
          },
        },
      },
      List: {
        class: List,
        inlineToolbar: true,
        config: {
          defaultStyle: "unordered",
        },
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
    },
    placeholder: "Edit the text of the announcement here",
    holder: "editAnnouncementEditor",
  });

  let showNewAnnouncement = "none";
  let pinned = false;
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
    set(ref(db, "announcements/" + titleAnnouncement), {
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
        pinned = undefined;
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
    get(ref(db, "announcements/" + title)).then((snapshot) => {
      currentAnnouncement = snapshot.val();
      editor2.blocks.render(currentAnnouncement.data);
      showEditAnnouncement = "flex";
      editAnnouncementTitle = currentAnnouncement.title;
      editPinned = currentAnnouncement.pinned;
      editDate = currentAnnouncement.date;
    });
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
    set(ref(db, "announcements/" + editAnnouncementTitle), {
      title: editAnnouncementTitle,
      data: editorData,
      pinned: editPinned,
      date: editDate,
    })
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
    remove(ref(db, "announcements/" + title));
    setTimeout(getData, 100);
  }
</script>

<main
  class="p-5 pl-10 pr-10 col-span-10 h-screen"
  style="display: {showLoggedIn}"
>
  <div class="flex justify-between py-5">
    <h1 class="text-2xl font-extrabold mb-0">Announcements</h1>
    <button
      class="px-5 py-2 rounded-lg bg-indigo-300 text-black"
      on:click={() => {
        if (showNewAnnouncement == "none") {
          showNewAnnouncement = "flex";
        } else {
          showNewAnnouncement = "none";
          editor.clear();
        }
      }}>New Announcement</button
    >
  </div>

  <div class="all-announcements py-5 background-neutral-100">
    <h2 class="text-lg font-bold">Pinned Announcements</h2>
    <table
      class="table-auto min-w-full text-left text-sm font-light border mt-3"
    >
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
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex flex-row gap-4">
                <button
                  class="px-5 hover:bg-gray-200 transition-colors py-2 rounded-lg bg-white outline-[0.5px] outline-stone-900 outline text-black"
                  on:click={editAnnouncement(pinnedAnnouncements[i].title)}
                  >Edit</button
                >

                <button
                  class="p-2 hover:bg-[#ff9c9c] transition-colors rounded-lg outline-[0.5px] outline-stone-900 outline"
                  on:click={deleteAnnouncement(pinnedAnnouncements[i].title)}
                  ><img src="./TrashDeleteBin.svg" alt="" class="w-5" /></button
                >
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <h2 class="text-lg font-bold mt-10">Announcements</h2>
    <table
      class="table-auto min-w-full text-left text-sm font-light border mt-3"
    >
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
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex flex-row gap-4">
                <button
                  class="px-5 py-2 hover:bg-gray-200 transition-colors rounded-lg bg-white outline-[0.5px] outline-stone-900 outline text-black"
                  on:click={editAnnouncement(normalAnnouncements[i].title)}
                  >Edit</button
                >
                <button
                  class="p-2 hover:bg-[#ff9c9c] transition-colors rounded-lg outline-[0.5px] outline-stone-900 outline"
                  on:click={deleteAnnouncement(normalAnnouncements[i].title)}
                  ><img src="./TrashDeleteBin.svg" alt="" class="w-5" /></button
                >
              </div>
            </td>
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
            editor.clear();
          }}
        >
          <img src="./XCloseDelete.svg" alt="" title="Close" class="w-5" />
        </button>
      </div>
      <div class="flex flex-row items-center gap-5 pb-5">
        <input
          name=""
          id=""
          class="py-3 pl-5 flex-grow rounded-lg border col-span-1 border-gray-300"
          placeholder="Title of the Annoucement"
          bind:value={titleAnnouncement}
        />
        <input
          type="date"
          class="py-3 pl-5 rounded-lg border border-gray-300"
          name=""
          id="date"
          bind:value={date}
        />
        <div class="col-span-1">
          <input type="checkbox" id="isPinned" bind:checked={pinned} />
          <label for="isPinned">📌</label>
        </div>
      </div>

      <div
        class="prose rounded-lg border max-w-none w-[100%] mr-0 px-5 py-3 mb-4 border-gray-300"
      >
        <div id="newAnnouncementEditor" />
      </div>

      <button
        class="px-5 py-2 rounded-lg bg-indigo-300 text-black"
        on:click={() => {
          // $editor
          //   .save()
          //   .then((outputData) => {
          //     setTimeout(showData, 10000);
          //   })
          //   .catch((error) => {
          //     console.log("Saving failed: ", error);
          //   });

          editor
            .save()
            .then((outputData) => {
              publishData(outputData);
            })
            .catch((error) => {
              console.log("Saving failed: ", error);
            });
        }}>Publish Announcement</button
      >
    </div>
  </div>

  <!-- Edit announcement -->

  <div
    style="display: {showEditAnnouncement};"
    class="absolute bg-[#00000059] top-0 left-0 w-screen h-full flex justify-center items-center"
  >
    <div class="p-5 bg-white w-[50%] rounded-2xl">
      <div class="flex justify-between pb-5">
        <h2 class="text-lg font-bold">Edit announcement</h2>
        <button
          on:click={() => {
            showEditAnnouncement = "none";
            editor2.clear();
          }}
        >
          <img src="./XCloseDelete.svg" alt="" title="Close" class="w-5" />
        </button>
      </div>
      <div class="flex flex-row items-center gap-5 pb-5">
        <input
          name=""
          id=""
          class="py-3 pl-5 flex-grow rounded-lg border col-span-1 border-gray-300"
          placeholder={editAnnouncementTitle}
          disabled
        />
        <input
          type="date"
          class="py-3 pl-5 rounded-lg border border-gray-300"
          name=""
          id="date"
          bind:value={editDate}
        />
        <div class="col-span-1">
          <input type="checkbox" id="isPinned" bind:checked={editPinned} />
          <label for="isPinned">📌</label>
        </div>
      </div>

      <div
        class="prose rounded-lg border max-w-none w-[100%] mr-0 px-5 py-3 mb-4 border-gray-300"
      >
        <div id="editAnnouncementEditor" />
      </div>

      <button
        class="px-5 py-2 rounded-lg bg-indigo-300 text-black"
        on:click={() => {
          editor2
            .save()
            .then((outputData) => {
              publishEditedData(outputData);
            })
            .catch((error) => {
              console.log("Saving failed: ", error);
            });
        }}>Publish Changes</button
      >
    </div>
  </div>
</main>

<style>
</style>
