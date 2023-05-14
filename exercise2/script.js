const btn = document.querySelector(".j-btn-test");

btn.addEventListener("click", () => {
   const width = window.screen.width;
   const height = window.screen.height;

   alert(`Screen width: ${width}\nScreen height: ${height}`);
});