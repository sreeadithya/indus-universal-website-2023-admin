<script>
  let showNewAlbum = "none";
  let editImagesLocation = [];
  let imagesLocation = [];
  let showProg = "none";
  let imageLinks = [];
  let prog;
  let albumName;
  let albumDate;
  let uploadError;
  let editAlbumName;
  let editAlbumDate;
  let showEditAlbum = "none";
  let editImageLinks = [];
  let showUploadButton = "block";
  let editImages2;
  let deletedImages = [];

  let theme = localStorage.getItem("theme");

  if (theme == "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  import {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
    listAll,
  } from "firebase/storage";
  import { storage, db } from "../firebase";
  import {
    ref as dbref,
    set,
    push,
    update,
    get,
    remove,
  } from "firebase/database";
  import { onMount } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";
  const { addNotification } = getNotificationsContext();
  let userEmail;
  let userPassword;
  function getData() {
    albums = {};
    albumTitles = [];
    get(dbref(db, "gallery/")).then((snapshot) => {
      albums = snapshot.val();
      albumTitles = Object.keys(albums);
      return albums;
    });
  }
  function editAlbum(selectedAlbumName) {
    albums = {};
    albumTitles = [];
    get(dbref(db, "gallery/")).then((snapshot) => {
      albums = snapshot.val();
      albumTitles = Object.keys(albums);

      console.log(albums);
      showEditAlbum = "flex";
      console.log(albums);
      editAlbumName = selectedAlbumName.replaceAll("_", " ");
      editAlbumDate = albums[selectedAlbumName].albumDate;
      // editImageLinks = albums[selectedAlbumName].imageLinks;
      for (
        let x = 0;
        x < Object.keys(albums[selectedAlbumName].imageLinks).length;
        x++
      ) {
        editImageLinks = [
          ...editImageLinks,
          albums[selectedAlbumName].imageLinks[x],
        ];
        console.log(editImageLinks);
      }
    });
  }
  function deleteAlbum(nameOfAlbum) {
    listAll(ref(storage, `gallery/${nameOfAlbum}/`))
      .then((res) => {
        res.items.forEach((itemRef) => {
          deleteObject(itemRef);
        });
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
    remove(dbref(db, "gallery/" + nameOfAlbum.replaceAll(" ", "_")));
    getData();
  }

  function updateAlbum() {
    if (!editImagesLocation) {
      set(dbref(db, "gallery/" + editAlbumName.replaceAll(" ", "_")), {
        title: editAlbumName,
        imageLinks: editImageLinks,
        albumDate: editAlbumDate,
      }).then(() => {
        for (let i = 0; i < deletedImages.length; i++) {
          let segments = deletedImages[i].split("/");
          let lastSegment = segments[segments.length - 1];
          let decodedFileName = extractFileName(
            decodeURIComponent(lastSegment)
          );
          deleteObject(
            ref(storage, `gallery/${editAlbumName}/${decodedFileName}`)
          )
            .then(() => {
              console.log("deleted" + decodedFileName);
            })
            .catch((error) => {
              // sht has erroredd sins have been done
            });
        }
        showProg = "none";
        showUploadButton = "block";
        showEditAlbum = "none";
        editAlbumName = undefined;
        editAlbumDate = undefined;
        editImageLinks = [];
        editImagesLocation = "";
        const editFileInput = document.getElementById("editFileInput");
        editFileInput.value = "";
      });
    } else {
      const uploadPromises = [];

      for (let i = 0; i < editImagesLocation.length; i++) {
        const storageRef = ref(
          storage,
          `gallery/${editAlbumName}/${editImagesLocation[i].name}`
        );
        const uploadTask = uploadBytesResumable(
          storageRef,
          editImagesLocation[i]
        );

        const uploadPromise = new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              showProg = "block";
              showUploadButton = "none";
            },
            (error) => {
              reject(error);
              uploadError = error;
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  editImageLinks = [...editImageLinks, downloadURL];
                  resolve(downloadURL);
                })
                .catch((error) => {
                  reject(error);
                  uploadError = error;
                });
            }
          );
        });
        uploadPromises.push(uploadPromise);
      }

      Promise.all(uploadPromises).then((downloadURLs) => {
        // editAlbum(editAlbumName);
        set(dbref(db, "gallery/" + editAlbumName.replaceAll(" ", "_")), {
          title: editAlbumName,
          imageLinks: editImageLinks,
          albumDate: editAlbumDate,
        }).then(() => {
          for (let i = 0; i < deletedImages.length; i++) {
            let segments = deletedImages[i].split("/");
            let lastSegment = segments[segments.length - 1];
            let decodedFileName = extractFileName(
              decodeURIComponent(lastSegment)
            );
            deleteObject(
              ref(storage, `gallery/${editAlbumName}/${decodedFileName}`)
            )
              .then(() => {
                console.log("deleted" + decodedFileName);
              })
              .catch((error) => {
                // sht has erroredd sins have been done
              });
          }
          showProg = "none";
          showUploadButton = "block";
          showEditAlbum = "none";

          editAlbumName = undefined;
          editAlbumDate = undefined;
          editImagesLocation = "";
          const editFileInput = document.getElementById("editFileInput");
          editFileInput.value = "";
        });
        update(
          dbref(
            db,
            "gallery/" + editAlbumName.replaceAll(" ", "_") + "/" + imageLinks
          ),
          {
            editImageLinks,
          }
        )
          .then(() => {})
          .catch((error) => {
            uploadError = error;
          });
        addNotification({
          text: "Successfully Updated Album",
          position: "bottom-center",
          removeAfter: "5000",
          type: "success",
        });
        editImageLinks = [];
        getData();
      });
    }
  }

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
    } else {
      showLoggedIn = "none";
      showLoggedOut = "block";
      window.location = "/";
    }
  });

  function arrayRemove(array, valueToRemove) {
    const index = array.indexOf(valueToRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  let albums;
  let albumTitles = [];

  onMount(() => {
    getData();
  });

  function uploadImages() {
    if (!imagesLocation) return;

    const uploadPromises = [];

    for (let i = 0; i < imagesLocation.length; i++) {
      const storageRef = ref(
        storage,
        `gallery/${albumName}/${imagesLocation[i].name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, imagesLocation[i]);

      const uploadPromise = new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            showProg = "block";
            showUploadButton = "none";
          },
          (error) => {
            reject(error);
            uploadError = error;
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                imageLinks = [...imageLinks, downloadURL];
                resolve(downloadURL);
              })
              .catch((error) => {
                reject(error);
                uploadError = error;
              });
          }
        );
      });

      uploadPromises.push(uploadPromise);
    }

    Promise.all(uploadPromises)
      .then((downloadURLs) => {
        set(dbref(db, "gallery/" + albumName.replaceAll(" ", "_")), {
          title: albumName,
          imageLinks: imageLinks,
          albumDate: albumDate,
        }).then(() => {
          showProg = "none";
          showUploadButton = "block";
          showNewAlbum = "none";
          albumName = undefined;
          albumDate = undefined;
          imageLinks = undefined;
          imagesLocation = "";
          const fileInput = document.getElementById("fileInput");
          fileInput.value = "";
        });
        addNotification({
          text: "Successfully Published Album",
          position: "bottom-center",
          removeAfter: "5000",
          type: "success",
        });
        getData();
      })
      .catch((error) => {
        uploadError = error;
      });
  }

  function deleteImageFromAlbum(imageUrl) {
    arrayRemove(editImageLinks, imageUrl);
    editImageLinks = editImageLinks;
    console.log(editImageLinks);

    deletedImages = [...deletedImages, imageUrl];

    console.log();
    console.log(deletedImages);
  }

  function extractFileName(url) {
    const match = url.match(/\/([^/?#]+)\?/);

    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  }
</script>

<main
  style="display: {showLoggedIn};"
  class="py-5 px-10 col-span-10 overflow-y-visible m-5 rounded-xl bg-white dark:bg-zinc-900 dark:text-white">
  <div class="py-5 flex justify-between items-center">
    <h1 class="text-2xl font-extrabold mb-0">Gallery</h1>
    <button
      on:click={() => {
        if (showNewAlbum == "none") {
          showNewAlbum = "flex";
        } else {
          showNewAlbum = "none";
        }
      }}
      class="px-5 py-2 rounded-lg bg-zinc-950 text-white">New Album</button>
  </div>
  <div
    style="display: {showNewAlbum};"
    class="absolute bg-[#00000059] top-0 left-0 w-screen h-full flex justify-center items-center">
    <div
      class="p-5 bg-white w-[50%] rounded-2xl dark:bg-zinc-900 dark:text-white">
      <div class="flex justify-between pb-5">
        <h2 class="text-lg font-bold">Add New Album</h2>
        <button
          on:click={() => {
            showNewAlbum = "none";
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
      <div>
        <div class="flex flex-row items-center gap-5">
          <input
            placeholder="Name of new album"
            class="py-3 pl-5 rounded-lg border col-span-1 border-gray-300 w-[50%] dark:bg-zinc-900 dark:text-white"
            bind:value={albumName} />

          <input
            type="date"
            bind:value={albumDate}
            class="py-3 px-4 pl-5 rounded-lg border border-gray-300 w-[50%] dark:bg-zinc-900 dark:text-white" />
        </div>

        <div class="flex justify-between items-end">
          <div>
            <div
              class="relative cursor-pointer overflow-hidden inline-block hover:bg-gray-200 transition-colors py-2 rounded-lg bg-white outline-[0.5px] outline-stone-900 outline text-black mt-5 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600">
              <button class="px-5 cursor-pointer">
                {imagesLocation.length} images selected</button>
              <input
                type="file"
                alt=""
                name=""
                id="fileInput"
                class="absolute left-0 top-0 opacity-0 cursor-pointer"
                bind:files={imagesLocation}
                multiple
                accept=".png, .jpg, .jpeg" />
            </div>

            <p
              class=" text-sm text-gray-500 dark:text-gray-300 mt-1"
              id="file_input_help">
              Uploading 10-30 high quality images per album is reccomended in <br />
              order to maintain a good quantity - quality ratio.
            </p>
          </div>
          <div>
            <button
              on:click={uploadImages}
              style="display: {showUploadButton}"
              class="px-5 py-2 mt-5 rounded-lg items-center gap-2 bg-zinc-950 text-white"
              >Publish Album
            </button>
            <div style="display: {showProg};">
              <img
                src="/LoadingSpinner.svg"
                class="animate-spin-slow mt-5"
                alt="loading" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Album -->

  <div
    style="display: {showEditAlbum};"
    class="absolute bg-[#00000059] top-0 left-0 w-screen h-full flex justify-center items-center">
    <div
      class="p-5 bg-white w-[80%] h-auto rounded-2xl dark:bg-zinc-900 dark:text-white">
      <div class="flex justify-between pb-5">
        <h2 class="text-lg font-bold">Edit Album</h2>
        <button
          on:click={() => {
            showEditAlbum = "none";
            editImageLinks = [];
            editImagesLocation = [];
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
      <div>
        <form>
          <div class="flex flex-row items-center gap-5">
            <input
              placeholder={editAlbumName}
              class="py-3 pl-5 rounded-lg border col-span-1 border-gray-300 w-[50%] dark:bg-zinc-900 dark:text-white"
              disabled />

            <input
              type="date"
              bind:value={editAlbumDate}
              class="py-3 px-4 pl-5 rounded-lg border border-gray-300 w-[50%] dark:bg-zinc-900 dark:text-white" />
          </div>

          <!-- show images here -->

          <div class="overflow-auto max-h-[45vh] mt-3">
            <div class="masonry">
              {#each editImageLinks as item (item)}
                <div class="masonry-item bg-white shadow rounded-lg relative">
                  <button
                    class="absolute bottom-3 right-3 p-2 hover:bg-[#ff9c9c] transition-colors rounded-lg outline-[0.5px] outline-stone-900 bg-[#ffffff8c] backdrop-blur-sm outline"
                    on:click={deleteImageFromAlbum(item)}
                    ><img
                      src="./TrashDeleteBin.svg"
                      alt=""
                      class="w-5" /></button>
                  <img src={item} alt="" class="mt-3" />
                </div>
              {/each}
            </div>
          </div>
          <div class="flex justify-between align-bottom items-end">
            <div>
              <div
                class="relative cursor-pointer overflow-hidden inline-block hover:bg-gray-200 transition-colors py-2 rounded-lg bg-white outline-[0.5px] outline-stone-900 outline text-black mt-5 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600">
                <button class="px-5 cursor-pointer"
                  >{editImagesLocation.length} images selected</button>
                <input
                  type="file"
                  alt=""
                  name=""
                  id="editFileInput"
                  class="absolute left-0 top-0 opacity-0 cursor-pointer"
                  bind:files={editImagesLocation}
                  multiple
                  accept=".png, .jpg, .jpeg" />
              </div>
              <p
                class=" text-sm text-gray-500 dark:text-gray-300 mt-1"
                id="file_input_help">
                Select more images to add to the album
              </p>
            </div>
            <button
              on:click={updateAlbum}
              style="display: {showUploadButton}"
              class="px-5 py-2 mt-5 h-min rounded-lg items-center gap-2 bg-zinc-950 text-white"
              >Update Album
            </button>
            <div style="display: {showProg};">
              <img
                src="/LoadingSpinner.svg"
                class="animate-spin-slow mt-5"
                alt="loading" />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div>
    <div class="h-[83.2vh] overflow-auto">
      <table class="table-auto min-w-full text-left text-sm font-light mt-3">
        <thead>
          <tr class="border-b">
            <th scope="col" class="px-6 py-4">#</th>
            <th scope="col" class="px-6 py-4">Name of the Album</th>
            <th scope="col" class="px-6 py-4">Date</th>
            <th scope="col" class="px-6 py-4">Options</th>
          </tr>
        </thead>
        <tbody>
          {#each albumTitles as i, y}
            <tr class="border-b-1">
              <td class="whitespace-nowrap px-6 py-4">{y + 1}</td>
              <td class="whitespace-nowrap px-6 py-4"
                >{i.replaceAll("_", " ")}</td>
              <td class="whitespace-nowrap px-6 py-4">{albums[i].albumDate}</td>
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex flex-row gap-4">
                  <button
                    class="px-5 hover:bg-gray-200 transition-colors py-2 rounded-lg bg-white outline-[0.5px] outline-stone-900 outline text-black dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                    on:click={editAlbum(i)}>Edit</button>
                  <button
                    class="p-2 hover:bg-[#ff9c9c] transition-colors rounded-lg outline-[0.5px] outline-stone-900 outline dark:bg-zinc-700 dark:hover:bg-[#FF8989]"
                    on:click={deleteAlbum(i)}>
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
        </tbody>
      </table>
    </div>
  </div>
</main>

<style>
  .masonry {
    column-count: 6;
    column-gap: 1rem;
  }

  .masonry-item {
    break-inside: avoid;
    margin-bottom: 1rem;
  }
</style>
