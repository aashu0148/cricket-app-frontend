function useImagePicker() {
  function openImagePicker(isMultiple = false) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".png,.jpg,.jpeg,.webp,.gif,.svg";

    if (isMultiple) input.multiple = true;

    input.click();

    return new Promise((resolve) => {
      input.addEventListener("change", (e) =>
        resolve(Array.from(e.target.files))
      );

      function handleWindowFocus() {
        window.removeEventListener("focus", handleWindowFocus);

        setTimeout(() => {
          resolve(null);
        }, 400);
      }
      window.addEventListener("focus", handleWindowFocus);
    });
  }

  return { openImagePicker };
}

export default useImagePicker;
