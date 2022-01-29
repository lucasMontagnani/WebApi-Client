import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './styles.css';

import api from '../../Services/api';

export default function Login(){
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    //const history = useHistory();
    const navigate = useNavigate();

    async function login(e){
        e.preventDefault(); //Previne que a pagina de refresh

        const data = {
            userName,
            password
        };

        try{
            const response = await api.post('api/v1/Authentication/signin', data);

            localStorage.setItem('userName', userName);
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            navigate('/books');
        } catch{
            alert('Login failed! Try again!')
        }
    }

    return(
        <div className="login-container">
            <section className='form'>
                <form onSubmit={login}>
                    <h1>Acess Your Account</h1>
                    <input placeholder='Username' value={userName} onChange={e => setUserName(e.target.value)}/>
                    <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                    <button type='submit' className='button'>Login</button>
                </form>
            </section>
        </div>
    );
}