import Navbar from '../components/Navbar'
import ModelCanvas from '../components/3DModel/ModelCanvas'
import AnimationList from '../components/AnimationList'
import { useTestAnimations } from '../hooks/useTestAnimations'

function HomePage() {
    const {
        entries,
        loading: testLoading,
        selectedName,
        selectedClipNames,
        select: testSelect,
        playAll,
        stopAll,
        isPlayingAll,
        allClips,
    } = useTestAnimations()

    return (
        <>
            <Navbar />
            <div className="w-full min-h-screen bg-[#E7ffff] flex flex-col items-center py-10">
                <div className="w-[50vw] aspect-[4/3]">
                    <ModelCanvas
                        activeClips={selectedClipNames}
                        testClips={allClips}
                        onClearTestSelection={() => testSelect(null)}
                    />
                </div>
                <div className="w-[50vw] mt-8">
                    <AnimationList
                        animations={entries.map((e) => e.animation)}
                        selectedName={selectedName}
                        onSelect={(name) => {
                            testSelect(name)
                        }}
                        onPlayAll={playAll}
                        onStopAll={stopAll}
                        isPlayingAll={isPlayingAll}
                        loading={testLoading}
                    />
                </div>
            </div>
        </>
    )
}

export default HomePage