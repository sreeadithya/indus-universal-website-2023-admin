<script>
  let showNewGallery = "none";
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
    <textarea placeholder="name of new gallery" />
    <input type="date" />
    <input type="file" name="" id="" />
  </div>
</main>
