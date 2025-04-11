import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login, password })
            });

            if (!response.ok) {
                throw new Error('Неверный логин или пароль');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/inbox');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container" style={{ maxWidth: 400, margin: '100px auto' }}>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Логин</label><br />
                    <input value={login} onChange={e => setLogin(e.target.value)} required />
                </div>
                <div>
                    <label>Пароль</label><br />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Войти</button>
            </form>
        </div>
    );
}