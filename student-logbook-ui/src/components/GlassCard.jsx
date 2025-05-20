const GlassCard = ({ children }) => {
  return (
    <div className="w-full max-w-md p-8 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg">
      {children}
    </div>
  );
};

export default GlassCard;
