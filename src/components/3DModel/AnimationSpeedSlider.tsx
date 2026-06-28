
interface AnimationSpeedSliderProps {
  speed: number
  onSpeedChange: (speed: number) => void
}

export default function AnimationSpeedSlider({ speed, onSpeedChange }: AnimationSpeedSliderProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-[#1e293b]/80 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
      
      <input
        id="speed-slider"
        type="range"
        min="0.5" // Velocidad mínima (10%)
        max="2.0" // Velocidad máxima (300%)
        step="0.1"
        value={speed}
        onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        className="w-48 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
      />
      
      {/* Botón rápido para resetear a 1x */}
      <button 
        onClick={() => onSpeedChange(1)}
        className="text-xs text-gray-400 hover:text-white transition-colors mt-1"
      >
        Reset
      </button>
    </div>
  )
}