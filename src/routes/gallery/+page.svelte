<script>
  let showNewGallery = "none";
  let imagesLocation;
  let prog;
  let showProg = "none";
  let imageLinks = [];
  let galleryName;
  let galleryDate;
  let showSuccess = "none";
  let uploadError;
  let showError = "none";
  // function uploadImages() {
  //   console.log(imagesLocation);
  // }
  import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
  import { storage, db } from "../firebase";
  import { ref as dbref, set, push, update } from "firebase/database";

  function uploadImages() {
    if (!imagesLocation) return;

    // uploading images each at once so that even if it fails in the middle, everything before it will be still uploaded

    const uploadPromises = [];

    for (let i = 0; i < imagesLocation.length; i++) {
      console.log(imagesLocation[i].name);

      const storageRef = ref(storage, `images/${imagesLocation[i].name}`);
      const uploadTask = uploadBytesResumable(storageRef, imagesLocation[i]);

      const uploadPromise = new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            prog = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            showProg = "block";
          },
          (error) => {
            reject(error);
            showError = "block";
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
                showError = "block";
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
        set(dbref(db, "gallery/" + galleryName), {
          imageLinks: imageLinks,
          galleryDate: galleryDate,
        });
        showSuccess = "block";
        showProg = "none";
      })
      .catch((error) => {
        showError = "block";
        uploadError = error;
      });
  }
</script>

<main>
  <p>titles of galleries</p>
  <button
    on:click={() => {
      if (showNewGallery == "none") {
        showNewGallery = "block";
      } else {
        showNewGallery = "none";
      }
    }}>new gallery</button
  >

  <div style="display: {showNewGallery};">
    <textarea placeholder="name of new gallery" bind:value={galleryName} />
    <input type="date" bind:value={galleryDate} />
    <input
      type="file"
      alt=""
      name=""
      id=""
      bind:files={imagesLocation}
      multiple
      accept=".png  ,.jpg"
    />
    <button on:click={uploadImages}>upload images</button>
    <p style="display: {showProg};">{prog}</p>
    <p style="display: {showSuccess};">all uploads are finished</p>
    <p style="display: {showError};">
      there was an error with the upload <br />
      please send the following error to the stem department and we'll get it resolved
      ^-^
      {uploadError}
    </p>
  </div>
</main>
