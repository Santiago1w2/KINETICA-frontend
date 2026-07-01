type LoadingSpinnerProps = {
  message?: string
}

export default function LoadingSpinner({ message = 'Cargando...' }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center gap-14 rounded-2xl bg-white/95 px-10 py-9 shadow-2xl ring-1 ring-slate-200">
        <div className="scale-150 sm:scale-200 md:scale-[2.5]">
          <div className="loader-6">
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
          </div>
        </div>
        <p className="rubik max-w-xs text-center text-sm font-semibold text-slate-700">{message}</p>
      </div>
    </div>
  );
}
