<script>
  import EditorJS from "@editorjs/editorjs";
  import Header from "@editorjs/header";
  import Underline from "@editorjs/underline";
  import List from "@editorjs/list";
  import Table from "@editorjs/table";

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
</script>

<main
  class="prose border max-w-[80vw] h-[95.8vh] mr-0 px-5 py-3 border-gray-300 p-5 pl-10 pr-10 col-span-10 m-5 rounded-2xl bg-white">
  <div id="departmentMembersEditor" class="h-full w-full" />
</main>
