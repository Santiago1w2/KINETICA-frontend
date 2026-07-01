import { Link } from 'react-router-dom'
import { FiArrowRight, FiCamera, FiCpu, FiMessageSquare, FiUserCheck, FiVideo } from 'react-icons/fi'

const signToTextSteps = [
    { label: 'Camara o video', icon: FiVideo },
    { label: 'Backend Python', icon: FiCpu },
    { label: 'Resultado', icon: FiMessageSquare },
    { label: 'Texto mejorado en Java', icon: FiUserCheck },
]

const textToSignSteps = [
    { label: 'Texto', icon: FiMessageSquare },
    { label: 'Backend Java', icon: FiCpu },
    { label: 'Glosa o senas', icon: FiArrowRight },
    { label: 'Modelo 3D', icon: FiCamera },
]

function FlowCard({ title, description, steps }: {
    title: string
    description: string
    steps: typeof signToTextSteps
}) {
    return (
        <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="rubik text-xl font-bold text-slate-950">{title}</h2>
            <p className="rubik mt-2 text-sm text-slate-600">{description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {steps.map(({ label, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#004aad] text-white">
                            <Icon />
                        </span>
                        <span className="rubik text-sm font-semibold text-slate-800">{label}</span>
                    </div>
                ))}
            </div>
        </article>
    )
}

function HomeTraductorPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <section className="bg-white px-6 py-8 shadow-[0_18px_50px_rgba(0,74,173,0.12)] ring-1 ring-slate-200">
                <div className="mx-auto max-w-7xl">
                    <p className="rubik text-sm uppercase tracking-[0.22em] text-[#004aad]">Panel del traductor</p>
                    <h1 className="bloksy mt-2 text-4xl text-slate-950 sm:text-5xl">Traductor Kinetica</h1>
                    <p className="rubik mt-3 max-w-3xl text-base text-slate-600">
                        Traduce senas a texto usando video y convierte texto en una secuencia de senas reproducida por el modelo 3D.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-[#004aad] p-5 text-white shadow-sm">
                        <p className="rubik text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">Puedes hacer</p>
                        <h2 className="rubik mt-2 text-2xl font-bold">Traducir en ambos sentidos</h2>
                        <p className="rubik mt-2 text-sm text-blue-50">
                            Usa la camara para interpretar senas o escribe texto para verlo representado por el personaje 3D.
                        </p>
                    </div>
                    <Link
                        to="/dashboard/sing-to-text"
                        className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <FiVideo className="text-3xl text-[#004aad]" />
                        <h2 className="rubik mt-4 text-xl font-bold text-slate-950">Se&ntilde;a a texto</h2>
                        <p className="rubik mt-2 text-sm text-slate-600">Graba un video, obtiene la prediccion y genera un texto final claro.</p>
                    </Link>
                    <Link
                        to="/dashboard/text-to-sing"
                        className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <FiMessageSquare className="text-3xl text-[#004aad]" />
                        <h2 className="rubik mt-4 text-xl font-bold text-slate-950">Texto a se&ntilde;a</h2>
                        <p className="rubik mt-2 text-sm text-slate-600">Convierte frases en glosas y reproduce las senas en el modelo 3D.</p>
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <FlowCard
                        title="Flujo de Se&ntilde;a a texto"
                        description="React graba el video, Python predice las senas y Java mejora el texto final."
                        steps={signToTextSteps}
                    />
                    <FlowCard
                        title="Flujo de Texto a se&ntilde;a"
                        description="Java genera glosas o referencias de senas y React carga las animaciones del modelo 3D."
                        steps={textToSignSteps}
                    />
                </div>
            </section>
        </main>
    )
}

export default HomeTraductorPage
