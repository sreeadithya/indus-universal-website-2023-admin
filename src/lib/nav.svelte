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
    } else {
      showLoggedIn = "none";
      showLoggedOut = "block";
    }
  });
</script>

<nav class="col-span-2" style="display: {showLoggedIn}">
  <div class="fixed pl-8 pr-5 h-full w-[17%]">
    <a href="/"
      ><img src="./logo-white.svg" class="w-36 mb-5 mt-5" alt="logo" /></a>
    <ul class="border-spacing-6 space-y-7 text-white pt-2">
      <li>
        <a href="/announcements" class="flex items-center gap-2"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="#fff"
            viewBox="0 0 256 256"
            ><path
              d="M240,120a48.05,48.05,0,0,0-48-48H152.2c-2.91-.17-53.62-3.74-101.91-44.24A16,16,0,0,0,24,40V200a16,16,0,0,0,26.29,12.25c37.77-31.68,77-40.76,93.71-43.3v31.72A16,16,0,0,0,151.12,214l11,7.33A16,16,0,0,0,186.5,212l11.77-44.36A48.07,48.07,0,0,0,240,120ZM40,199.93V40h0c42.81,35.91,86.63,45,104,47.24v65.48C126.65,155,82.84,164.07,40,199.93Zm131,8,0,.11-11-7.33V168h21.6ZM192,152H160V88h32a32,32,0,1,1,0,64Z" /></svg>
          Announcements</a>
      </li>
      <li>
        <a href="/gallery" class="flex items-center gap-2"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="#fff"
            viewBox="0 0 256 256"
            ><path
              d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z" /></svg
          >Gallery</a>
      </li>
      <li>
        <a href="/departmentmembers" class="flex items-center gap-2"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="#fff"
            viewBox="0 0 256 256"
            ><path
              d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z" /></svg
          >Department Members</a>
      </li>
      <li>
        <a href="/alumni" class="flex items-center gap-2"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="#fff"
            viewBox="0 0 256 256"
            ><path
              d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z" /></svg
          >Alumni</a>
      </li>
    </ul>
    <div class="absolute bottom-7 flex text-white w-[15vw]">
      <button
        on:click={logOutButton}
        class="bg-indigo-300 text-black px-5 py-2 rounded-lg">Log Out</button>
    </div>
  </div>
</nav>

<style>
  nav {
    display: flex;
    flex-direction: column;
  }
</style>
