document.addEventListener('DOMContentLoaded', (event) => {
  const markdownContent = document.querySelector('#markdown_section').innerHTML;
  document.querySelector('#markdown_section').innerHTML =
    marked.parse(markdownContent);
});
