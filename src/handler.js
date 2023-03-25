const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    let finished;
    const id = nanoid(16);
    if (readPage === pageCount){
        finished = true;
    } else {
        finished = false;
    }
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }; 

    if(name){
        if(readPage > pageCount){
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }
        books.push(newBook);
        console.log(books);
        const isSuccess = books.filter((book) => book.id === id).length > 0;
        if (isSuccess) {
            const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
            });
            response.code(201);
            return response;
        }
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let result;
    let resultReading;
    let resultNotReading;
    let resultFinished;
    let resultNotFinished;

    
    if(name){
        const results = books.filter(book => {
            return Object.values(book).some(value => {
                return typeof value === 'string' && value.toLowerCase().includes(name.toLowerCase());
            });
        });
        const bookData = results.map((result) => {
            return {
                id:result.id,
                name:result.name,
                publisher:result.publisher
            };
        });
        const response = h.response({
            status: 'success',
            data: {
                books:bookData
            },
        });
        response.statusCode = 200;
        return response;
    }

    if (reading === "1"){
        resultReading = books.filter((read) => read.reading === true)
        const bookData = resultReading.map((resultReading) => {
            return {
                id: resultReading.id,
                name:resultReading.name,
                publisher:resultReading.publisher
            };
        });
        const response = h.response({
            status: 'success',
            data: {
                books:bookData
            }
        });
        response.statusCode = 200;
        return response;
    } 
    

    if (reading === "0"){
        resultNotReading = books.filter((read) => read.reading === false)
        const bookData = resultNotReading.map((resultNotReading) => {
            return {
                id: resultNotReading.id,
                name:resultNotReading.name,
                publisher:resultNotReading.publisher
            };
        });
        const response = h.response({
            status: 'success',
            data: {
                books:bookData
            }
        });
        response.statusCode = 200;
        return response;
    }

    if(finished === "1"){
        resultFinished = books.filter((read) => read.finished === true)
        const bookData = resultFinished.map((resultFinished) => {
            return {
                id: resultFinished.id,
                name:resultFinished.name,
                publisher:resultFinished.publisher
            };
        });
        const response = h.response({
            status: 'success',
            data: {
                books:bookData
            }
        });
        response.statusCode = 200;
        return response;
    }

    if(finished === "0"){
        resultNotFinished = books.filter((read) => read.finished === false)
        const bookData = resultNotFinished.map((resultNotFinished) => {
            return {
                id: resultNotFinished.id,
                name:resultNotFinished.name,
                publisher:resultNotFinished.publisher
            };
        });
        const response = h.response({
            status: 'success',
            data: {
                books:bookData
            }
        });
        response.statusCode = 200;
        return response;
    }

    const bookData = books.map((books) => {
        return {
            id:books.id,
            name:books.name,
            publisher:books.publisher
        };

    });

    const response = h.response({
        status: 'success',
        data: {
            books:bookData
        },
    });
    response.statusCode = 200;
    return response;
};


const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];

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
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        if(name){
            books[index] = {
                ...books[index],
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
        } else {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }
        if(readPage > pageCount){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };