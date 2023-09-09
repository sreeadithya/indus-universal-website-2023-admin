<script>
  import EditorJS from "@editorjs/editorjs";
  import Header from "@editorjs/header";
  import Underline from "@editorjs/underline";
  import List from "@editorjs/list";
  import Table from "@editorjs/table";

  import { db } from "../firebase";
  import { onMount } from "svelte";
  import { ref, set, get, child, remove } from "firebase/database";
  import { onAuthStateChanged } from "firebase/auth";
  import { auth, logInButton, logOutButton } from "../firebase";

  let showLoggedIn = "none";
  let showLoggedOut = "none";
  let uid;
  let departMentMembers;
  let lastUpdated;
  let date;
  let month;
  let year;
  let hours;
  let minutes;

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
    placeholder: "",
    holder: "departmentMembersEditor",
  });

  function getData() {
    get(ref(db, "departmentMembers")).then((snapshot) => {
      departMentMembers = snapshot.val();
      editor.blocks.render(departMentMembers.data);
      lastUpdated = departMentMembers.lastUpdated;
    });
  }
  import { Notyf } from "notyf";
  import "notyf/notyf.min.css";
  var notyf = new Notyf({
    duration: 2000,
    position: {
      x: "center",
      y: "bottom",
    },
  });
  onMount(() => {
    getData();
  });

  function saveData() {
    date = new Date().getDate();
    month = new Date().getMonth() + 1;
    year = new Date().getFullYear();
    hours = new Date().getHours();
    minutes = new Date().getMinutes() < 10 ? "0" : new Date().getMinutes();

    lastUpdated =
      date + "/" + month + "/" + year + " at " + hours + ":" + minutes;
    editor.save().then((outputData) => {
      set(ref(db, "departmentMembers"), {
        lastUpdated: lastUpdated,
        data: outputData,
      }).then(() => {
        getData();
        console.log("data saved");
      });
    });
  }
</script>

<main
  class=" border max-w-[80vw] h-[95.8vh] mr-0 px-5 py-3 border-gray-300 p-5
pl-10 pr-10 col-span-10 m-5 rounded-xl bg-white">
  <div class="flex justify-between items-center py-5">
    <div class="flex flex-col">
      <h1 class="text-2xl font-extrabold mb-0">Department Members</h1>

      <p
        class=" text-sm text-gray-500 dark:text-gray-300 mt-1"
        id="file_input_help">
        Last Updated: {lastUpdated}
      </p>
    </div>

    <button
      class="px-5 py-2 rounded-lg bg-zinc-950 text-white"
      on:click={saveData}>Save Data</button>
  </div>
  <div
    id="departmentMembersEditor"
    class="h-[80vh] w-full overflow-auto prose rounded-lg border max-w-none mr-0 px-5 py-3 mb-4 border-gray-300 mt-3" />
</main>
