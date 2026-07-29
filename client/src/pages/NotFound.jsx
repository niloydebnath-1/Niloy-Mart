import { Link } from "react-router-dom";

export default function NotFound() {
  return <main className="container page-section empty-state"><h1>404</h1><p>Page not found.</p><Link className="button" to="/">Go home</Link></main>;
}
