<script>
  import { onAuthStateChanged } from "firebase/auth";
  import { auth, logOutButton } from "../routes/firebase";

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
    }
  });
</script>

<nav class="col-span-2" style="display: {showLoggedIn}">
  <div class="fixed pl-8 pr-5 border-r border-r-gray-400 h-full w-[15%]">
    <a href="/"><img src="./logo.svg" class="w-36 mb-5 mt-5" alt="logo" /></a>
    <ul class="border-spacing-6 space-y-7 pt-2">
      <li>
        <a href="/announcements"> Announcements</a>
      </li>
      <li>
        <a href="/gallery">Gallery</a>
      </li>
      <li>
        <a href="/departmentmembers">Edit Department Members</a>
      </li>
      <li>
        <a href="/alumni">Alumni</a>
      </li>
    </ul>
    <button
      on:click={logOutButton}
      class="bg-neutral-950 text-white px-5 py-2 absolute bottom-7 rounded-lg outline-[0.5px] outline-stone-200 outline"
      >Log Out</button
    >
  </div>
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
  }
</style>
