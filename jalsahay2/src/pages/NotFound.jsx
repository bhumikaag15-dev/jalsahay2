import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-20 space-y-4">
      <h1 className="text-6xl font-black text-primary">404</h1>
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <Link to="/" className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl font-semibold">
        Back to Home
      </Link>
    </div>
  );
}