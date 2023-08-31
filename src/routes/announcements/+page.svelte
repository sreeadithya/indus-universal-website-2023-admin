<script>
  import { createEditor } from "svelte-editorjs";
  import Header from "@editorjs/header";
  import Underline from "@editorjs/underline";
  import List from "@editorjs/list";

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
  let damn;
  let showNewAnnouncement = "none";
  let pinned;
  let date;
  let titleAnnouncement;
  function publishData() {
    console.log($data);
    console.log(titleAnnouncement);
    console.log(pinned);
    console.log(date);
  }
</script>

<main>
  <p>titles of pinned announcemnts</p>
  <p>titles of normal announcements</p>
  <button
    on:click={() => {
      if (showNewAnnouncement == "none") {
        showNewAnnouncement = "block";
      } else {
        showNewAnnouncement = "none";
      }
    }}>new announcement</button
  >

  <div style="display: {showNewAnnouncement};">
    <textarea
      name=""
      id=""
      cols="30"
      rows="10"
      placeholder="title of announcement"
      bind:value={titleAnnouncement}
    />
    <input type="checkbox" bind:checked={pinned} />
    <input type="date" name="" id="" bind:value={date} />

    <div class="editor" use:editor />

    <button
      on:click={() => {
        $editor.save();
        const myTimeout = setTimeout(publishData, 50);
      }}>show data</button
    >
  </div>
</main>

<style>
  div {
    outline: 1px #000 solid;
  }
</style>
