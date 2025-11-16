export function FormErrorBox({ message }: { message: string }) {
  return (
    <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded-lg relative mt-2">
      <span className="text-red-500">{message}</span>
    </div>
  );
}
