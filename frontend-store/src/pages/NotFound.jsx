import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF4] flex flex-col items-center justify-center text-center px-4 py-28 text-[#6B6560]">
      <div className="text-6xl mb-6 text-[#C8922A]">🏺</div>
      <h1 className="font-display font-light text-4xl text-[#1A1A1A] mb-2">Page Not Found</h1>
      <p className="text-xs uppercase tracking-wider text-[#9A8A70] mb-8">The jar you are looking for has been misplaced or does not exist.</p>
      <Link to="/" className="btn-primary py-3.5 px-8 text-xs tracking-[0.12em]">
        Return to Curing Room
      </Link>
    </div>
  );
}
