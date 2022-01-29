import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './styles.css';

import api from '../../Services/api';

export default function NewBook(){

    const [id, setId] = useState(null);
    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [launchDate, setLaunchDate] = useState('');
    const [price, setPrice] = useState('');

    const {bookId} = useParams();

    //const history = useHistory();
    const navigate = useNavigate();

    const accessToken = localStorage.getItem('accessToken');

    const authorization = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }

    useEffect(() => {
        if(bookId ==='0') return;
        else loadBook();
    }, bookId);

    async function loadBook(){
        try{
            const response = await api.get(`api/v1/Book/${bookId}`, authorization);
            let ajustedDate = response.data.launchDate.split("T", 10)[0];
            setId(response.data.id);
            setTitle(response.data.title);
            setAuthor(response.data.author);
            setPrice(response.data.price);
            setLaunchDate(ajustedDate);
        } catch{
            alert("Error recovering book! Try again.");
            navigate('/books');
        }
    }

    async function saveOrUpdate(e){
        e.preventDefault(); //Previne que a pagina de refresh

        const data = {
            title,
            author,
            launchDate,
            price
        }

        try{
            if(bookId === '0'){
                await api.post('/api/v1/Book', data, authorization);
            } else{
                data.id = id;
                await api.put('/api/v1/Book', data, authorization);
            }
            
            
        } catch{
            alert("Error while recording book! Try again.");
        }
        navigate('/books');   
    }

    return(
        <div className='new-book-container'>
            <div className='content'>
                <section className='form'>
                    <h1>{bookId === '0' ? 'Add New' : 'Update'} Book</h1>
                    <p>Enter the book information and click on {bookId === '0' ? `'Add'` : `'Update'`}.</p>
                    <Link className='back-link' to="/books">
                        <FiArrowLeft size={16} color='#251fc5'/>
                        Back to book list
                    </Link>
                </section>
                <form onSubmit={saveOrUpdate}>
                    <input placeholder='Title' value={title} onChange={e => setTitle(e.target.value)}/>
                    <input placeholder='Author' value={author} onChange={e => setAuthor(e.target.value)}/>
                    <input type="date" value={launchDate} onChange={e => setLaunchDate(e.target.value)}/>
                    <input placeholder='Price' value={price} onChange={e => setPrice(e.target.value)}/>
                    <button className='button' type='submit'>{bookId === '0' ? 'Add' : 'Update'}</button>
                </form>
            </div>
        </div>
    );
}