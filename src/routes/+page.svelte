<script>
  let userEmail;
  let userPassword;

  import { onAuthStateChanged } from "firebase/auth";
  import { auth, logInButton } from "./firebase";
  import { Notyf } from "notyf";
  import "notyf/notyf.min.css";
  var notyf = new Notyf({
    duration: 2000,
    position: {
      x: "center",
      y: "bottom",
    },
  });
  let showLoggedIn = "none";
  let logInError;
  let showLoggedOut = "none";
  let uid;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      showLoggedIn = "flex";
      showLoggedOut = "none";
      console.log(user);
    } else {
      showLoggedIn = "none";
      showLoggedOut = "block";
      console.log(user);
    }
  });
</script>

<div
  style="display: {showLoggedIn}"
  class="p-5 pl-10 pr-10 col-span-10 h-[95.8vh] flex-col justify-center items-center text-center m-5 bg-white rounded-xl">
  <p>select an option on the sidebar to begin</p>
</div>
<div style="display: {showLoggedOut}">
  <div
    class="w-screen h-screen flex flex-col items-center justify-center bg-white">
    <div class="flex flex-col p-8 bg-white rounded-lg">
      <img src="./logo.svg" alt="" class="h-[50px] mb-5" />
      <form action="" class="flex flex-col content-stretch">
        <input
          type="email"
          placeholder="email"
          bind:value={userEmail}
          name=""
          class="py-3 px-5 rounded-lg border mb-2 border-gray-300" />
        <input
          type="password"
          placeholder="password"
          bind:value={userPassword}
          name=""
          class="py-3 px-5 rounded-lg border mb-2 border-gray-300" />
        <button
          on:click={async () => {
            if ((await logInButton(userEmail, userPassword)) != null) {
              notyf.error("Wrong email or password");
              userEmail = "";
              userPassword = "";
            }
            // if (logInError == true) {

            //   userEmail = "";
            //   userPassword = "";
            // }
          }}
          class="bg-neutral-950 text-white px-5 py-2 rounded-lg">Log In</button>
      </form>
    </div>
  </div>
</div>
