export default function Logo({ large=false }) {
  return (
    <div className={`font-bold ${large ? 'text-3xl' : 'text-xl'} tracking-wide`}>
      <span className="text-indigo-400">TOOL</span><span className="text-white">MONIQ</span>
    </div>
  );
}
