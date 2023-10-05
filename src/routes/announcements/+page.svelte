<script>
  //! Importing required svelte elements
  import EditorJS from "@editorjs/editorjs";
  import Header from "@editorjs/header";
  import Underline from "@editorjs/underline";
  import List from "@editorjs/list";
  import Table from "@editorjs/table";
  import AttachesTool from "@editorjs/attaches";
  import ImageTool from "@editorjs/image";

  import { Notyf } from "notyf";
  import "notyf/notyf.min.css";
  var notyf = new Notyf({
    duration: 2000,
    position: {
      x: "center",
      y: "bottom",
    },
  });

  import { db, storage } from "../firebase";
  import { onMount } from "svelte";
  import { ref, set, get, child, remove } from "firebase/database";

  import {
    ref as storageRef,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
    listAll,
  } from "firebase/storage";
  let downloadURL;

  let userEmail;
  let userPassword;
  let shit;
  let currentAnnouncement;
  let showEditAnnouncement = "none";
  let titleEditAnnouncement;
  let editPinned;
  let editDate;
  let editAnnouncementTitle;
  let thumbnailLocation;
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
  let showTitleAnnouncement = "block";

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
      attaches: {
        class: AttachesTool,
        config: {
          uploader: {
            async uploadByFile(file) {
              console.log(file);
              console.log(titleAnnouncement);

              let storeRef = storageRef(
                storage,
                `announcements/${titleAnnouncement.replaceAll(" ", "_")}/${
                  file.name
                }`
              );
              console.log(storeRef);

              // Create a promise to resolve with the download URL when the upload is complete
              return new Promise((resolve, reject) => {
                const uploadTask = uploadBytesResumable(storeRef, file);

                uploadTask.on(
                  "state_changed",
                  (snapshot) => {
                    console.log(snapshot);
                  },
                  (error) => {
                    reject(error);
                    console.log(error);
                  },
                  () => {
                    // Once the upload is complete, get the download URL
                    getDownloadURL(uploadTask.snapshot.ref)
                      .then((downloadURL) => {
                        // Resolve the promise with the download URL
                        resolve({
                          success: 1,
                          file: {
                            url: downloadURL,
                          },
                        });
                      })
                      .catch((error) => {
                        reject(error);
                        console.log(error);
                      });
                  }
                );
              });
            },
          },
        },
      },
      image: {
        class: ImageTool,
        config: {
          uploader: {
            async uploadByFile(file) {
              console.log(file);
              console.log(titleAnnouncement);

              const storeRef = storageRef(
                storage,
                `announcements/${titleAnnouncement.replaceAll(" ", "_")}/${
                  file.name
                }`
              );
              console.log(storeRef);

              // Create a promise to resolve with the download URL when the upload is complete
              return new Promise((resolve, reject) => {
                const uploadTask = uploadBytesResumable(storeRef, file);
                uploadTask.on(
                  "state_changed",
                  (snapshot) => {
                    console.log(snapshot);
                  },
                  (error) => {
                    reject(error);
                    console.log(error);
                  },
                  () => {
                    // Once the upload is complete, get the download URL
                    getDownloadURL(uploadTask.snapshot.ref)
                      .then((downloadURL) => {
                        // Resolve the promise with the download URL
                        resolve({
                          success: 1,
                          file: {
                            url: downloadURL,
                          },
                        });
                      })
                      .catch((error) => {
                        reject(error);
                        console.log(error);
                      });
                  }
                );
              });
            },
          },
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
      table: {
        class: Table,
        inlineToolbar: true,
      },
      attaches: {
        class: AttachesTool,
        config: {
          uploader: {
            async uploadByFile(file) {
              console.log(file);
              console.log(editAnnouncementTitle);

              const storeRef = storageRef(
                storage,
                `announcements/${editAnnouncementTitle.replaceAll(" ", "_")}/${
                  file.name
                }`
              );
              console.log(storeRef);

              // Create a promise to resolve with the download URL when the upload is complete
              return new Promise((resolve, reject) => {
                const uploadTask = uploadBytesResumable(storeRef, file);

                uploadTask.on(
                  "state_changed",
                  (snapshot) => {
                    console.log(snapshot);
                  },
                  (error) => {
                    reject(error);
                    console.log(error);
                  },
                  () => {
                    // Once the upload is complete, get the download URL
                    getDownloadURL(uploadTask.snapshot.ref)
                      .then((downloadURL) => {
                        // Resolve the promise with the download URL
                        resolve({
                          success: 1,
                          file: {
                            url: downloadURL,
                          },
                        });
                      })
                      .catch((error) => {
                        reject(error);
                        console.log(error);
                      });
                  }
                );
              });
            },
          },
        },
      },
      image: {
        class: ImageTool,
        config: {
          uploader: {
            async uploadByFile(file) {
              console.log(file);
              console.log(editAnnouncementTitle);

              const storeRef = storageRef(
                storage,
                `announcements/${editAnnouncementTitle.replaceAll(" ", "_")}/${
                  file.name
                }`
              );
              console.log(storeRef);

              // Create a promise to resolve with the download URL when the upload is complete
              return new Promise((resolve, reject) => {
                const uploadTask = uploadBytesResumable(storeRef, file);
                uploadTask.on(
                  "state_changed",
                  (snapshot) => {
                    console.log(snapshot);
                  },
                  (error) => {
                    reject(error);
                    console.log(error);
                  },
                  () => {
                    // Once the upload is complete, get the download URL
                    getDownloadURL(uploadTask.snapshot.ref)
                      .then((downloadURL) => {
                        // Resolve the promise with the download URL
                        resolve({
                          success: 1,
                          file: {
                            url: downloadURL,
                          },
                        });
                      })
                      .catch((error) => {
                        reject(error);
                        console.log(error);
                      });
                  }
                );
              });
            },
          },
        },
      },
    },
    placeholder: "Edit the text of the announcement here",
    holder: "editAnnouncementEditor",
  });

  let showNewAnnouncement = "none";

  let showEditorJs = "none";

  let date = null;
  let titleAnnouncement = "";

  function publishData(editorData) {
    if (!date) {
      notyf.error("Please add a date for the announcement");
      return;
    }

    console.log(editorData);
    console.log(thumbnailLocation);

    if (!thumbnailLocation) return;

    let storeRef = storageRef(
      storage,
      `announcements/${titleAnnouncement.replaceAll(" ", "_")}/${
        thumbnailLocation[0].name
      }`
    );
    const uploadTask = uploadBytesResumable(storeRef, thumbnailLocation[0]);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            //
            set(
              ref(
                db,
                "announcements/" + titleAnnouncement.replaceAll(" ", "_")
              ),
              {
                title: titleAnnouncement,
                data: editorData,
                pinned: pinned,
                date: date,
                thumbnail: downloadURL,
              }
            )
              .then(() => {
                notyf.success("Successfully published");
                titleAnnouncement = undefined;
                thumbnailLocation = undefined;
                editor.clear();
                pinned = false;
                date = undefined;
                showEditorJs = "none";
                document.querySelector("[data-newAnnouncement]").close();
              })
              .catch((error) => {
                notyf.error(
                  `There was an error publishing the announcement" + ${error}`
                );
              });

            // console.log($data);
            setTimeout(getData, 100);
          })
          .catch((error) => {
            reject(error);
            uploadError = error;
          });
      }
    );
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
      notyf.error("Please add a title");
      return;
    }
    if (!editDate) {
      notyf.error("Please add a date for the announcement");
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
        notyf.success("Successfully edited");
        showEditAnnouncement = "none";
        editor2.clear();
      })
      .catch((error) => {
        notyf.error(`There was an error editing the announcement" + ${error}`);
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
  class="pt-5 px-10 m-5 w-[70%] rounded-xl text-white max-[1000px]:w-[102vw] max-[1000px]:m-0 max-[1000px]:pt-0"
  style="display: {showLoggedIn}">
  <div
    class="h-[90vh] overflow-auto max-[1000px]:h-max max-[1000px]:overflow-scroll">
    <div class="flex justify-between pt-5">
      <p class="text-[30px] text-[#ffffffbb]"><b>Pinned</b></p>

      <button
        class=" text-[#ffffffbb] hover:bg-[#151515] p-3 rounded-lg animate-all duration-200"
        on:click={() => {
          document.querySelector("[data-newAnnouncement]").showModal();
          showTitleAnnouncement = "block";
        }}
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="#ffffff"
          viewBox="0 0 256 256"
          ><path
            d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" /></svg
        ></button>
    </div>

    <div
      class="all-announcements py-5 grid grid-cols-3 gap-6 pr-3 max-[1000px]:grid-cols-1">
      {#each pinnedAnnouncementsTitles as i}
        <div class="w-[100%]">
          <img
            src={pinnedAnnouncements[i].thumbnail}
            alt=""
            class="w-max h-max rounded-md" />

          <div class="flex justify-between w-[100%] pt-2">
            <p>{pinnedAnnouncements[i].title}</p>

            <p class="text-[#ffffff80]">{pinnedAnnouncements[i].date}</p>
          </div>

          <div class="flex flex-row gap-5 pt-1">
            <button on:click={editAnnouncement(pinnedAnnouncements[i].title)}
              ><u>Edit</u>
            </button>
            <button on:click={deleteAnnouncement(pinnedAnnouncements[i].title)}
              ><u>Delete</u>
            </button>
          </div>
        </div>
      {/each}

      <!-- <table class="table-auto w-full text-left text-sm font-light mt-3">
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
                  on:click={deleteAnnouncement(normalAnnouncements[i].title)} />
              </div>
            </td>
          </tr>
        {/each}
      </table> -->
    </div>
  </div>
  <dialog
    data-newAnnouncement
    class="bg-[#0D0D0D] text-white p-5 rounded-lg w-[50%] border-[#151515] border-2">
    <div class="flex justify-between items-center pb-5">
      <button
        class="p-3 rounded-lg hover:bg-[#151515] text-white group animate-all duration-200"
        on:click={() => {
          document.querySelector("[data-newAnnouncement]").close();
          showTitleAnnouncement = "block";
          showEditorJs = "none";
          titleAnnouncement = "";

          editor.clear();
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          class="fill-white group-hover:fill-[#ff9c9c] animate-all duration-200"
          viewBox="0 0 256 256"
          ><path
            d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" /></svg>
      </button>

      <div style="cursor: pointer;">
        <div
          style="display: {showEditorJs};"
          class="relative cursor-pointer overflow-hidden inline-block hover:bg-[#151515] p-3 rounded-lg animate-all duration-200">
          <button class=" cursor-pointer">
            {#if !thumbnailLocation}
              Select Thumbnail
            {:else}
              Thumbnail Selected
            {/if}
          </button>

          <input
            type="file"
            alt=""
            name=""
            id="fileInput"
            class="absolute left-0 top-0 opacity-0 !cursor-pointer"
            bind:files={thumbnailLocation}
            accept=".png, .jpg, .jpeg" />
        </div>
      </div>

      <input
        style="display: {showEditorJs};"
        type="date"
        class=" bg-[#0D0D0D]"
        name=""
        id="date"
        bind:value={date} />
      <div class="flex items-center" style="display: {showEditorJs};">
        <label class="checkBoxContainer">
          <input
            class="checkBox"
            type="checkbox"
            bind:checked={pinned}
            id="isPinned" />

          <span
            class="checkBoxIndicator p-3 border-2 border-[#3d3d3d] rounded-md hover:bg-[#151515] animate-all duration-200" />
        </label>
        Pin
      </div>
      <button
        class="p-3 rounded-lg hover:bg-[#151515] text-white animate-all duration-200"
        style="display: {showTitleAnnouncement};"
        on:click={() => {
          if (titleAnnouncement == "") {
            notyf.error("Please add a title");
            return;
          }
          showTitleAnnouncement = "none";
          showEditorJs = "block";
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          class="fill-white"
          viewBox="0 0 256 256"
          ><path
            d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" /></svg>
      </button>
      <button
        style="display: {showEditorJs};"
        class="p-3 rounded-lg hover:bg-[#151515] text-white group animate-all duration-200"
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
    <div class="flex gap-3">
      <input
        name=""
        id=""
        style="display: {showTitleAnnouncement};"
        class="py-3 pl-5 flex-grow rounded-lg border col-span-1 border-[#3d3d3d] bg-[#0D0D0D]"
        placeholder="Title of New Annoucement"
        bind:value={titleAnnouncement} />
    </div>

    <div
      class="editorJsEditor prose rounded-lg border max-w-none overflow-auto max-h-[45vh] w-[100%] mr-0 px-5 py-3 border-[#3d3d3d] bg-[#0D0D0D] text-white"
      style="display: {showEditorJs};">
      <div id="newAnnouncementEditor" />
    </div>
  </dialog>

  <!-- Edit announcement -->

  <div
    style="display: {showEditAnnouncement};"
    class="absolute bg-[#00000059] top-0 left-0 w-screen h-full flex justify-center items-center">
    <div class="p-5 w-[50%] rounded-2xl dark:bg-zinc-900 dark:text-white">
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
        class="prose rounded-lg border max-w-none w-[100%] overflow-auto max-h-[45vh] mr-0 px-5 py-3 mb-4 border-gray-300 bg-white">
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
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.459);
    backdrop-filter: blur(5px);
  }

  .checkBoxContainer input {
    display: none;
    cursor: pointer;
  }

  .checkBoxContainer .checkBoxIndicator {
    transform: scale(0.8);
    display: block;
    float: left;
    margin-right: 5px;
    cursor: pointer;
  }
  .checkBoxContainer input:checked ~ .checkBoxIndicator {
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzg4IiBoZWlnaHQ9IjM4OCIgdmlld0JveD0iMCAwIDM4OCAzODgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zNDQgMTE0LjMwNEwzMDYuNzQyIDc3TDE0Ny41NDggMjM2LjMzMUw4MS4yNTgxIDE3MC4wMTlMNDQgMjA3LjMyM0wxNDcuNTQ4IDMxMUwzNDQgMTE0LjMwNFoiIGZpbGw9IiNCMEIwQjAiLz4KPC9zdmc+Cg==)
      center/cover no-repeat;
    color: #121212;
  }

  * {
    color-scheme: dark;
  }
</style>
