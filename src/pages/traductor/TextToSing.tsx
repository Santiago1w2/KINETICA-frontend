
import AnimationList from '../../components/AnimationList'
import { useSigns } from '../../hooks/useSigns'
import SeniaTextInput from '../../components/SeniaTextInput'
import ModelCanvas from '../../components/3DModel/ModelCanvas'

function TextToSing() {
  const {
        entries,
        loading: signsLoading,
        selectedLabel: selectedName,
        selectedClipNames,
        select: signSelect,
        playAll,
        stopAll,
        isPlayingAll,
        allClips,
    } = useSigns()



    return (
        <main className="min-h-screen w-full bg-white relative flex flex-col items-center">

            {/* Fondo de circuito (Circuit Board Pattern) */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
                        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
                        radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
                        radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
                    `,
                    backgroundSize: '40px 40px, 40px 40px, 40px 40px, 40px 40px',
                }}
            />

            {/* Sección del Modelo 3D */}
            <div className="w-[90vw] md:w-[65vw] aspect-[16/9] md:aspect-[21/9] relative rounded-3xl overflow-hidden z-10 bg-slate-900 shadow-2xl mt-8">
                <ModelCanvas
                    activeClips={selectedClipNames}
                    testClips={allClips}
                    onClearTestSelection={() => signSelect(null)}
                />
            </div>

     
            <div className="w-[90vw] md:w-[75vw] flex flex-col md:flex-row gap-6 mt-10 mb-20 z-10">
                
         
                <div className="flex-1">
                    <SeniaTextInput onTranslate={(t) => console.log("Padre recibió:", t)} />
                </div>

         
                <div className="flex-1">
                    <AnimationList
                        animations={entries.map((e) => ({ name: e.sign.label }))}
                        selectedName={selectedName}
                        onSelect={(name) => signSelect(name)}
                        onPlayAll={playAll}
                        onStopAll={stopAll}
                        isPlayingAll={isPlayingAll}
                        loading={signsLoading}
                    />
                </div>
            </div>
        </main>
    )
}


export default TextToSing