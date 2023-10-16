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
  let showLoggedIn = false;
  let showLoggedOut = false;
  let uid;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      showLoggedIn = true;
      showLoggedOut = false;
      console.log(user);
    } else {
      showLoggedIn = false;
      showLoggedOut = true;
      console.log(user);
    }
  });
</script>

{#if showLoggedIn}
  <div
    class="pt-5 px-10 m-5 rounded-xl text-white max-[1000px]:w-[102vw] max-[1000px]:m-0 max-[1000px]:pt-0">
    <p>Select an option on the sidebar</p>
  </div>
{/if}
{#if showLoggedOut}
  <div
    class="flex flex-col items-center justify-center w-screen h-screen bg-[#0D0D0D] text-white">
    <div class="flex flex-col p-8 bg-[#0D0D0D] rounded-lg">
      <img src="./logo.svg" alt="" class="h-[50px] mb-5" />
      <form action="" class="flex flex-col content-stretch">
        <input
          type="email"
          placeholder="email"
          bind:value={userEmail}
          name=""
          class="px-5 py-3 mb-2 rounded-lg bg-[#0d0d0d] border-gray-300 border-[0.4px]" />
        <input
          type="password"
          placeholder="password"
          bind:value={userPassword}
          name=""
          class="px-5 py-3 mb-2 rounded-lg bg-[#0d0d0d] border-gray-300 border-[0.4px]" />
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
          class="p-3 rounded-lg hover:bg-[#202020] bg-[#171717] text-white group animate-all duration-200"
          >Log In</button>
      </form>
    </div>
  </div>
{/if}
