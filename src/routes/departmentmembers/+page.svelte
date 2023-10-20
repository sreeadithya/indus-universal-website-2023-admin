<script>
  // Importing Rich Text Editor Dependencies
  import EditorJS from "@editorjs/editorjs";
  import Header from "@editorjs/header";
  import Underline from "@editorjs/underline";
  import List from "@editorjs/list";
  import Table from "@editorjs/table";

  // Importing Firebase Dependencies
  import { db } from "../firebase";
  import { onMount } from "svelte";
  import { ref, set, get, child, remove } from "firebase/database";
  import { onAuthStateChanged } from "firebase/auth";
  import { auth } from "../firebase";

  // Defining Reactive Variables
  let showLoggedIn = "none";
  let uid;
  let departMentMembers;
  let lastUpdated;
  let date;
  let month;
  let year;
  let hours;
  let minutes;

  // Check for user authentication status
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      showLoggedIn = true;
      console.log(user);
    } else {
      showLoggedIn = false;
      console.log(user);
      window.location = "/";
    }
  });

  // Setting Up EditorJS
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

  // Getting the data to display
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
  // Getting data on page load
  onMount(() => {
    getData();
  });

  // Saving data to the database
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

<!-- ! HTML for the department members page -->
<main
  class="pt-5 px-10 m-5 w-[100%] rounded-xl text-white max-[1000px]:w-[102vw] max-[1000px]:m-0 max-[1000px]:pt-0">
  <div class="flex items-center justify-between py-5">
    <div class="flex flex-col">
      <p class="opacity-50" id="file_input_help">
        Last Updated: {lastUpdated}
      </p>
    </div>

    <button
      class=" text-[#ffffffbb] hover:bg-[#151515] p-3 rounded-lg animate-all duration-200 flex items-center gap-2"
      on:click={saveData}
      >Save <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="#ffffff"
        viewBox="0 0 256 256"
        ><path
          d="M219.31,80,176,36.69A15.86,15.86,0,0,0,164.69,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V91.31A15.86,15.86,0,0,0,219.31,80ZM168,208H88V152h80Zm40,0H184V152a16,16,0,0,0-16-16H88a16,16,0,0,0-16,16v56H48V48H164.69L208,91.31ZM160,72a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h56A8,8,0,0,1,160,72Z" /></svg
      ></button>
  </div>
  <div
    id="departmentMembersEditor"
    class="h-[80vh] w-full overflow-auto prose rounded-lg border max-w-none mr-0 px-5 py-3 mb-4 border-gray-300 mt-3 bg-white" />
</main>
