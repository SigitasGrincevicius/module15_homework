const btn = document.querySelector(".j-btn-test");
const mainIcon = document.querySelector(".main-icon");
const altIcon = document.querySelector(".alt-icon");

btn.addEventListener("click", () => {
   console.log("Pasileidau");
   mainIcon.classList.toggle("icon--hidden");
   altIcon.classList.toggle("icon--hidden");
});