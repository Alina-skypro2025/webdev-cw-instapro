
export function renderUploadImageComponent({ elementId, onImageUrl }) {
  const root = document.getElementById(elementId);
  root.innerHTML = `
    <label class="file">
      <input type="file" id="file-input" accept="image/*" />
      <span>Загрузить фото</span>
    </label>
    <div id="preview" class="upload-preview"></div>
  `;

  const input = root.querySelector("#file-input");
  const preview = root.querySelector("#preview");

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;

 
    const { fileUrl } = await uploadToCloud(file);
    preview.innerHTML = <img src="${fileUrl}" alt="" style="max-width:100%;border-radius:12px;">;
    onImageUrl(fileUrl);
  });
}


async function uploadToCloud(file) {
 
  return { fileUrl: URL.createObjectURL(file) };
}
