<script>
  import { NinjaKeys } from "ninja-keys";
  import { logOutButton } from "./firebase";

  import { goto } from "$app/navigation";

  import { onMount } from "svelte";

  import Nav from "$lib/nav.svelte";

  import "../app.css";

  const hotkeys = [
    {
      title: "Announcement",
      id: "Announcement",

      section: "New",

      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff"  viewBox="0 0 256 256" style="padding: 0px 10px 0px 0px"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>`,
      handler: () => {
        goto("/announcements", true);

        setTimeout(() => {
          document.querySelector("[data-newAnnouncement]").showModal();
          showTitleAnnouncement = "block";
        }, 800);
      },
    },
    {
      title: "Album",
      id: "Album",
      section: "New",

      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff"  viewBox="0 0 256 256" style="padding: 0px 10px 0px 0px"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>`,
      handler: () => {
        goto("/gallery", true);

        setTimeout(() => {
          document.querySelector("[data-newAlbum]").showModal();
        }, 800);
      },
    },
    {
      title: "Announcements",
      id: "Announcements",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" style="padding: 0px 10px 0px 0px" width="16" height="16" fill="#fff" viewBox="0 0 256 256"><path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"></path></svg>`,
      section: "Announcements",
      section: "Go To",
      handler: () => {
        goto("/announcements", true);
      },
    },

    {
      title: "Gallery",
      id: "Gallery",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" style="padding: 0px 10px 0px 0px" width="16" height="16" fill="#fff" viewBox="0 0 256 256"><path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"></path></svg>`,

      section: "Go To",
      handler: () => {
        goto("/gallery", true);
      },
    },

    {
      title: "Dept Members",
      id: "Dept Members",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" style="padding: 0px 10px 0px 0px" width="16" height="16" fill="#fff" viewBox="0 0 256 256"><path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"></path></svg>`,

      section: "Go To",
      handler: () => {
        goto("/departmentmembers", true);
      },
    },
    {
      title: "Alumni",
      id: "Alumni",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" style="padding: 0px 10px 0px 0px" width="16" height="16" fill="#fff" viewBox="0 0 256 256"><path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"></path></svg>`,

      section: "Go To",
      handler: () => {
        goto("/alumni", true);
      },
    },
    {
      title: "Log Out",
      id: "Log Out",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" style="padding: 0px 10px 0px 0px" width="16" height="16" fill="#fff" viewBox="0 0 256 256"><path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"></path></svg>`,
      section: "Misc",

      handler: () => {
        logOutButton();
      },
    },
  ];
  onMount(async () => {
    const ninja = document.querySelector("ninja-keys");
    ninja.data = hotkeys;
  });

  function handleSelected(event) {
    console.log("handleSelected", event.detail);
  }
</script>

<div
  class="flex flex-row bg-[#0D0D0D] gap-20 max-[1000px]:flex-col max-[1000px]:gap-0 max-[1000px]:overflow-x-hidden">
  <Nav />
  <slot />
  <ninja-keys
    on:selected={handleSelected}
    class="dark"
    placeholder=""
    navigationUpHotkey="i"
    navigationDownHotkey="k"
    hideBreadcrumbs>
    <div slot="footer" class="p-5">
      i<sub>up</sub> &nbsp; k<sub>down</sub>
    </div>
  </ninja-keys>
</div>

<style>
  ninja-keys {
    --ninja-modal-background: #121212;
    --ninja-accent-color: #ffffff;
    --ninja-actions-height: max-content;
  }
</style>
