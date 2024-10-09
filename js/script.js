const books = [];
const RENDER_EVENT = "render-book"
const SAVED_EVENT = "saved-book"
const STORAGE_KEY = "BOOK_APPS"

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    const searchBookForm = document.getElementById('searchBook');
    searchBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = parseInt(document.getElementById("inputBookYear").value);
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");

    const isCompleted = inputBookIsComplete.checked;

    const generatedID = generateID();
    const bookObject = generateBookObject(generatedID, inputBookTitle, inputBookAuthor, inputBookYear, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateID() {
    return +new Date();
}

function generateBookObject(id, bookTitle, bookAuthor, bookYear, isCompleted) {
    return {
        id,
        bookTitle,
        bookAuthor,
        bookYear,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    // console.log(books);
    const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
    uncompletedBOOKList.innerHTML = "";

    const completedBOOKList = document.getElementById("completeBookshelfList");
    completedBOOKList.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBOOKList.append(bookElement);
        } else {
            completedBOOKList.append(bookElement);
        }
    }
});

function makeBook(bookObject) {
    const textTitle = document.createElement("h3");
    textTitle.classList.add("bookTitle");
    textTitle.innerText = bookObject.bookTitle;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = `Penulis: ${bookObject.bookAuthor}`;

    const textYear = document.createElement("p");
    textYear.innerText = `Tahun: ${bookObject.bookYear}`;

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    if (bookObject.isCompleted) {
        const uncompleteButton = document.createElement("button");
        uncompleteButton.classList.add("green");
        uncompleteButton.innerText = "Belum selesai dibaca";
        uncompleteButton.addEventListener("click", function () {
            addBookToUncompleted(bookObject.id);
        });
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("red");
        deleteButton.innerText = "Hapus buku";

        deleteButton.addEventListener("click", function () {
            addBookToDeleted(bookObject.id);
        });

        actionContainer.append(uncompleteButton, deleteButton);
    } else {
        const completeButton = document.createElement("button");
        completeButton.classList.add("green");
        completeButton.innerText = "Selesai dibaca";
        completeButton.addEventListener("click", function () {
            addBookToCompleted(bookObject.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("red");
        deleteButton.innerText = "Hapus buku";

        deleteButton.addEventListener("click", function () {
            addBookToDeleted(bookObject.id);
        });

        actionContainer.append(completeButton, deleteButton);
    }

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.setAttribute("id", `book-${bookObject.id}`);

    container.append(textTitle, textAuthor, textYear, actionContainer);

    return container;
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function addBookToDeleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToUncompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

let hiddenBooks = [];

function searchBook() {
    const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();
    const findBookTitle = document.querySelectorAll(".bookTitle");
    hiddenBooks.forEach(book => book.parentElement.style.display = "block");
    hiddenBooks = [];

    for (const findBook of findBookTitle) {
        if (!findBook.innerText.toLowerCase().includes(searchInput)) {
            hiddenBooks.push(findBook);
            findBook.parentElement.style.display = "none";
        }
    }
}

const buttonSubmit = document.getElementById("bookSubmit");
const spanStatus = buttonSubmit.querySelector("span");

inputBookIsComplete.addEventListener("change", function () {
    if (inputBookIsComplete.checked) {
        spanStatus.textContent = "Selesai dibaca";
    } else {
        spanStatus.textContent = "Belum selesai dibaca";
    }
});