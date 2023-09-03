<script>
  let showNewAlbum = "none";
  let imagesLocation;
  let showProg = "none";
  let imageLinks = [];
  let prog;
  let albumName;
  let albumDate;
  let uploadError;
  let editAlbumName;
  let editAlbumDate;
  let showEditAlbum = "none";
  let editImages = [];
  let showUploadButton = "block";
  import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
  import { storage, db } from "../firebase";
  import { ref as dbref, set, push, update, get } from "firebase/database";
  import { onMount } from "svelte";
  import { getNotificationsContext } from "svelte-notifications";
  const { addNotification } = getNotificationsContext();
  let userEmail;
  let userPassword;
  function editAlbum(selectedAlbumName) {
    console.log(selectedAlbumName);
    showEditAlbum = "flex";
    editAlbumName = selectedAlbumName;
    editAlbumDate = albums[selectedAlbumName].albumDate;
    console.log(Object.keys(albums[selectedAlbumName].imageLinks));
    for (
      let x = 0;
      x < Object.keys(albums[selectedAlbumName].imageLinks).length;
      x++
    ) {
      editImages = [...editImages, albums[selectedAlbumName].imageLinks[x]];
      console.log(editImages);
    }
  }
  function deleteAlbum() {}

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

  let albums;
  let albumTitles = [];

  function getData() {
    albums = {};
    albumTitles = [];
    get(dbref(db, "gallery/")).then((snapshot) => {
      if (snapshot.exists()) {
        albums = snapshot.val();

        albumTitles = Object.keys(albums);
      } else {
        albums = {};
        albumTitles = [];
      }
    });
  }

  onMount(() => {
    getData();
  });

  function uploadImages() {
    if (!imagesLocation) return;

    const uploadPromises = [];

    for (let i = 0; i < imagesLocation.length; i++) {
      console.log(imagesLocation[i].name);

      const storageRef = ref(storage, `images/${imagesLocation[i].name}`);
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
        console.log("all uploads complete", downloadURLs);
        set(dbref(db, "gallery/" + albumName), {
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
      })
      .catch((error) => {
        uploadError = error;
      });
  }
</script>

<main style="display: {showLoggedIn};" class="py-10 px-10 col-span-10">
  <div class="py-5 flex justify-between items-center">
    <h1 class="text-2xl font-bold">Gallery</h1>
    <button
      on:click={() => {
        if (showNewAlbum == "none") {
          showNewAlbum = "flex";
        } else {
          showNewAlbum = "none";
        }
      }}
      class="px-5 py-2 rounded-lg bg-indigo-300 text-black">New Album</button>
  </div>
  <div
    style="display: {showNewAlbum};"
    class="absolute bg-[#00000059] top-0 left-0 w-screen h-full flex justify-center items-center">
    <div class="p-5 bg-white w-[50%] rounded-2xl">
      <div class="flex justify-between pb-5">
        <h2 class="text-lg font-bold">Add New Album</h2>
        <button
          on:click={() => {
            showNewAlbum = "none";
          }}>
          <img src="./XCloseDelete.svg" alt="" title="Close" class="w-5" />
        </button>
      </div>
      <div>
        <form>
          <div class="flex flex-row items-center gap-5">
            <input
              placeholder="Name of new album"
              class="py-3 pl-5 rounded-lg border col-span-1 border-gray-300 w-[50%]"
              bind:value={albumName} />

            <input
              type="date"
              bind:value={albumDate}
              class="py-3 pl-5 rounded-lg border border-gray-300 w-[50%]" />
          </div>
          <input
            class="block w-full text-lg border border-gray-300 rounded-lg cursor-pointer focus:outline-none mt-5"
            type="file"
            alt=""
            name=""
            id="fileInput"
            bind:files={imagesLocation}
            multiple
            accept=".png, .jpg, .jpeg" />
          <p
            class=" text-sm text-gray-500 dark:text-gray-300 mt-1"
            id="file_input_help">
            Uploading 10-30 high quality images per album is reccomended in <br />
            order to maintain a good quantity - quality ratio.
          </p>
          <button
            on:click={uploadImages}
            style="display: {showUploadButton}"
            class="px-5 py-2 mt-5 rounded-lg items-center gap-2 bg-indigo-300 text-black"
            >Publish Album
          </button>
        </form>
        <div style="display: {showProg};">
          <img
            src="/LoadingSpinner.svg"
            class="animate-spin-slow mt-5"
            alt="loading" />
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Album -->

  <div
    style="display: {showEditAlbum};"
    class="absolute bg-[#00000059] top-0 left-0 w-screen overflow-hidden h-full flex justify-center items-center">
    <div class="p-5 bg-white w-[50%] rounded-2xl">
      <div class="flex justify-between pb-5">
        <h2 class="text-lg font-bold">Add New Album</h2>
        <button
          on:click={() => {
            showEditAlbum = "none";
            editImages = [];
          }}>
          <img src="./XCloseDelete.svg" alt="" title="Close" class="w-5" />
        </button>
      </div>
      <div>
        <form>
          <div class="flex flex-row items-center gap-5">
            <input
              placeholder={editAlbumName}
              class="py-3 pl-5 rounded-lg border col-span-1 border-gray-300 w-[50%]"
              disabled />

            <input
              type="date"
              bind:value={editAlbumDate}
              class="py-3 pl-5 rounded-lg border border-gray-300 w-[50%]" />
          </div>

          <!-- show images here -->

          <div class="overflow-auto h-96" />
          <br /><br /><br />
          <input
            class="block w-full text-lg border border-gray-300 rounded-lg cursor-pointer focus:outline-none mt-5"
            type="file"
            alt=""
            name=""
            id="fileInput"
            bind:files={imagesLocation}
            multiple
            accept=".png, .jpg, .jpeg" />
          <button
            on:click={uploadImages}
            style="display: {showUploadButton}"
            class="px-5 py-2 mt-5 rounded-lg items-center gap-2 bg-indigo-300 text-black"
            >Publish Edited Album
          </button>
        </form>
        <div style="display: {showProg};">
          <img
            src="/LoadingSpinner.svg"
            class="animate-spin-slow mt-5"
            alt="loading" />
        </div>
      </div>
    </div>
  </div>
  <div>
    <table
      class="table-auto min-w-full text-left text-sm font-light border mt-3">
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
            <td class="whitespace-nowrap px-6 py-4">{i}</td>
            <td class="whitespace-nowrap px-6 py-4">{albums[i].albumDate}</td>
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex flex-row gap-4">
                <button
                  class="px-5 hover:bg-gray-200 transition-colors py-2 rounded-lg bg-white outline-[0.5px] outline-stone-900 outline text-black"
                  on:click={editAlbum(i)}>Edit</button>

                <button
                  class="p-2 hover:bg-[#ff9c9c] transition-colors rounded-lg outline-[0.5px] outline-stone-900 outline"
                  on:click={deleteAlbum(1)}
                  ><img
                    src="./TrashDeleteBin.svg"
                    alt=""
                    class="w-5" /></button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</main>
