export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85 backdrop-blur-sm">
      <div
        className="h-10 w-10 rounded-full border-[3px] border-gray-200 border-t-[#0070E0] animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}