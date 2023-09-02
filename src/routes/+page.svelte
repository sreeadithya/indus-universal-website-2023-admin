<script>
  let userEmail;
  let userPassword;

  import { onAuthStateChanged } from "firebase/auth";
  import { auth, logInButton } from "./firebase";

  import { getNotificationsContext } from "svelte-notifications";
  const { addNotification } = getNotificationsContext();

  let showLoggedIn = "none";
  let logInError;
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

<div style="display: {showLoggedIn}" class="p-5 pl-10 pr-10 col-span-10">
  select an option on the sidebar to begin
</div>
<div style="display: {showLoggedOut}">
  <div class="w-screen h-screen flex flex-col items-center justify-center">
    <div>
      <img src="./logo.svg" alt="" class="h-[50px] mb-5" />
      <form action="">
        <input
          type="email"
          placeholder="email"
          bind:value={userEmail}
          name=""
          class="py-3 px-5 rounded-lg border border-gray-300"
        />
        <input
          type="password"
          placeholder="password"
          bind:value={userPassword}
          name=""
          class="py-3 px-5 rounded-lg border border-gray-300"
        /> <br />
        <button
          on:click={async () => {
            if ((await logInButton(userEmail, userPassword)) != null) {
              addNotification({
                text: "Wrong email or password",
                position: "bottom-center",
                removeAfter: "5000",
                type: "error",
              });
              userEmail = "";
              userPassword = "";
            }
            // if (logInError == true) {

            //   userEmail = "";
            //   userPassword = "";
            // }
          }}
          class="bg-neutral-950 text-white px-5 py-2 rounded-lg mt-5"
          >Log In</button
        >
      </form>
    </div>
  </div>
</div>
