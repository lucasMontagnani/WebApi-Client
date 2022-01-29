import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './styles.css';
import {FiPower, FiEdit, FiTrash2} from 'react-icons/fi'

import api from '../../Services/api';

export default function Books(){

    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);

    const Username = localStorage.getItem('userName');

    const accessToken = localStorage.getItem('accessToken');

    const authorization = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }

    //const history = useHistory();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMoreBooks();
    }, [accessToken]);

    async function fetchMoreBooks(){
        const response = await api.get(`/api/v1/Book/asc/6/${page}`, authorization);
        setBooks([...books, ...response.data.list]);
        setPage(page + 1);
    }

    async function logout(){
        try{
            await api.get('api/v1/Authentication/revoke', authorization);
            localStorage.clear();
            navigate('/');
        } catch{
            alert("Logout failed! Try again.");
        }
    }

    async function editBook(id){
        try{
            navigate(`./new/${id}`);
        } catch{
            alert("Action failed! Try again.");
        }
    }

    async function deleteBook(id){
        try{
            await api.delete(`/api/v1/Book/${id}`, authorization);
            setBooks(books.filter(book => book.id !== id));
        } catch{
            alert("Delete failed! Try again.");
        }
    }

    return(
        <div className='book-container'>
            <header>
                <span>Welcome, <strong>{Username.toUpperCase()}</strong>!</span>
                <Link className='button' to="./new/0">Add New Book</Link>
                <button type='button' onClick={logout}>
                    <FiPower size={18} color='#251fc5'/>
                </button>
            </header>

            <h1>Registered Books</h1>
            <ul>
                {books.map(book =>(
                    <li key={book.id}>
                        <strong>Title:</strong>
                        <p>{book.title}</p>
                        <strong>Author:</strong>
                        <p>{book.author}</p>
                        <strong>Price:</strong>
                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(book.price)}</p>
                        <strong>Release Date:</strong>
                        <p>{Intl.DateTimeFormat('pt-BR').format(new Date(book.launchDate))}</p>
                        <button type='button' onClick={() => editBook(book.id)}>
                            <FiEdit size={20} color='#251fc5'/>
                        </button>
                        <button type='button' onClick={() => deleteBook(book.id)}>
                            <FiTrash2 size={20} color='#251fc5'/>
                        </button>
                    </li>
                ))}
            </ul>
            <button type='button' className='button' onClick={fetchMoreBooks}>Load More</button>
        </div>
    );
}