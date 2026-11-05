import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h1 style={{ fontSize: '5rem', margin: 0 }}>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="btn-home">Go Home</Link>
    </div>
  );
}