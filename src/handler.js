const { nanoid } = require('nanoid');
const booksData = require('./booksData');

const addBookNoteByIdHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
    return response;
  }

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  booksData.push(newBooks);

  const isSuccess = booksData.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'kesalahan pada server',
  }).code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  let newBook = booksData;

  const { name, reading, finished } = request.query;

  if (name) {
    const queryName = name.toLowerCase();
    newBook = booksData.filter((book) => book.name.toLowerCase().includes(queryName));
  }
  if (reading) {
    newBook = booksData.filter((book) => Number(book.reading) === Number(reading));
  }
  if (finished) {
    newBook = booksData.filter((book) => Number(book.finished) === Number(finished));
  }
  const books = newBook.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  }).code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = booksData.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
    return response;
  }

  const index = booksData.findIndex((book) => book.id === id);

  if (index !== -1) {
    const updatedAt = new Date().toISOString();
    booksData[index] = {
      ...booksData[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = booksData.findIndex((b) => b.id === id);
  if (index !== -1) {
    booksData.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
  return response;
};

module.exports = {
  addBookNoteByIdHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
