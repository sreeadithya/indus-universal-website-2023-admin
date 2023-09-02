<script>
  import { onAuthStateChanged } from "firebase/auth";
  import { auth, logInButton, logOutButton } from "../routes/firebase";

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
    <img src="./logo.svg" class="w-36 pb-5 pt-5" alt="logo" />
    <ul class="border-spacing-6">
      <li><a class="py-2" href="/announcements"> Announcements</a></li>
      <li><a class="py-2" href="/gallery">Gallery</a></li>
      <li><a class="py-2" href="/">Edit Department Members</a></li>
      <li><a class="py-2" href="/alumni">Alumni</a></li>
    </ul>
    <button
    on:click={logOutButton}
    class="bg-neutral-950 text-white px-5 py-2 rounded-lg">Log Out</button
  >
  </div>
  <div class="logOut" />
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
  }
</style>
