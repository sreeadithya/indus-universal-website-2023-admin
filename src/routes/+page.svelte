<script>
  let userEmail;
  let userPassword;

  import { onAuthStateChanged } from "firebase/auth";
  import { auth, logInButton, logOutButton } from "./firebase";

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

<main class="col-span-10">
  <div
    class="flex flex-col justify-center items-center p-11 max-w-5xl"
    style="display: {showLoggedOut}"
  >
    <img src="./logo.svg" alt="" class="w-[200px]" />
    <form action="">
      <input
        type="email"
        placeholder="email"
        bind:value={userEmail}
        name=""
        class="py-3 pl-5 mb-2 rounded-lg border border-gray-300"
      />
      <input
        type="password"
        placeholder="password"
        bind:value={userPassword}
        name=""
        class="py-3 mb-2 pl-5 rounded-lg border border-gray-300"
      />
      <button
        on:click={logInButton(userEmail, userPassword)}
        class="bg-neutral-950 text-white px-5 py-2 rounded-lg">Log In</button
      >
    </form>
  </div>
  <div style="display: {showLoggedIn}">
    select an option on the sidebar to begin
  </div>
</main>
