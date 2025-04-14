let myLibrary = [];

function Book() {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(title, author, pages, read) {
    let book = new Book(title, author, pages, read);
    myLibrary.push(book);
    displayBooks(myLibrary);
}

function displayBooks(myLibrary) {
    myLibrary.forEach(book => {
        bookContainer.innerHTML += book;
        //console.log(book);
    });
}

//form to add new book
const sidebar = document.getElementById("sidebar");
const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");

openBtn.addEventListener("click", () => {
    sidebar.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
    sidebar.classList.add("hidden");
});

//handle form submission
const form = document.getElementById("bookForm");

form.addEventListener("submit", (e) => {
    e.preventDefault;

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const read = document.getElementById("read").checked;

    addBookToLibrary(title, author, pages, read);

    form.reset();
});

function addBookToLibrary(title, author, pages, read) {
    let book = new Book(title, author, pages, read);
    myLibrary.push(book);
}
