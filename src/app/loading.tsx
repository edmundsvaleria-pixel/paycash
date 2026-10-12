export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div
        className="h-8 w-8 rounded-full border-[3px] border-gray-200 border-t-black animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}