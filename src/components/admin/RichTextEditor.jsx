import { Editor } from "@tinymce/tinymce-react";

// TinyMCE, self-hosted (no cloud API key, no CDN) — every plugin/skin/icon it
// needs is imported below and bundled by Vite, so this works fully offline.
import "tinymce/tinymce";
import "tinymce/models/dom/model";
import "tinymce/themes/silver";
import "tinymce/icons/default/icons";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/autolink";
import "tinymce/plugins/code";

import "tinymce/skins/ui/oxide/skin.css";
import contentCss from "tinymce/skins/content/default/content.css?inline";
import contentUiCss from "tinymce/skins/ui/oxide/content.css?inline";

// Small "description field" HTML editor used everywhere in the admin panel so
// admins can add bold/italic/links/lists instead of only plain text. Value is
// an HTML string, matching how the corresponding public page renders it via
// dangerouslySetInnerHTML — same value/onChange contract as before, so no
// call site elsewhere in the admin panel needed to change.
export default function RichTextEditor({ value, onChange, rows = 3, placeholder = "" }) {
  const height = Math.max(rows, 1) * 24 + 46;

  return (
    <div className="rich-text-editor-wrap">
      <Editor
        licenseKey="gpl"
        value={value || ""}
        onEditorChange={(html) => onChange(html)}
        init={{
          height,
          menubar: false,
          statusbar: false,
          plugins: "lists link autolink code",
          toolbar: "bold italic underline | bullist | link | removeformat | code",
          placeholder,
          skin: false,
          content_css: false,
          content_style: [contentCss, contentUiCss, "body { font-size:14px; font-family: inherit; }"].join("\n"),
          branding: false,
          resize: false,
        }}
      />
    </div>
  );
}
