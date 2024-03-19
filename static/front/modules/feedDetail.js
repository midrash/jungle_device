document.addEventListener('DOMContentLoaded', (event) => {
  const markdownContent = document.querySelector('#markdown_section').innerHTML;
  console.log(markdownContent);
  document.querySelector('#markdown_section').innerHTML = marked.parse(markdownContent);
}); 