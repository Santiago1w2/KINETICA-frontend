import React from 'react'
import { FaPlay, FaStop } from 'react-icons/fa'
import type { AnimationData } from '../types/type'

interface AnimationListProps {
    animations: AnimationData[]
    selectedName: string | null
    onSelect: (name: string | null) => void
    onPlayAll: () => void
    onStopAll: () => void
    isPlayingAll: boolean
    loading: boolean
}

const cardBase: React.CSSProperties = {
    padding: '14px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    border: '2px solid #c0d6e4',
    background: '#ffffff',
    color: '#004aad',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.15s',
    userSelect: 'none',
}

const cardActive: React.CSSProperties = {
    ...cardBase,
    border: '2px solid #004aad',
    background: '#004aad',
    color: '#ffffff',
}

const iconBtn: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: '50%',
    cursor: 'pointer',
    border: '2px solid #004aad',
    background: '#004aad',
    color: '#ffffff',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
    padding: 0,
}

function AnimationList({ animations, selectedName, onSelect, onPlayAll, onStopAll, isPlayingAll, loading }: AnimationListProps) {
    if (loading) {
        return (
            <div style={{ padding: 20, color: '#888', fontSize: 14 }}>
                Loading animations...
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1 }}>
                {animations.map(({ name }) => (
                    <div
                        key={name}
                        style={selectedName === name ? cardActive : cardBase}
                        onClick={() => onSelect(selectedName === name ? null : name)}
                        onPointerEnter={(e) => {
                            if (selectedName !== name) {
                                e.currentTarget.style.background = '#e8f4ff'
                            }
                        }}
                        onPointerLeave={(e) => {
                            if (selectedName !== name) {
                                e.currentTarget.style.background = '#ffffff'
                            }
                        }}
                    >
                        {name}
                    </div>
                ))}
            </div>
            <button
                style={iconBtn}
                onClick={isPlayingAll ? onStopAll : onPlayAll}
                onPointerEnter={(e) => { e.currentTarget.style.background = '#3879d0' }}
                onPointerLeave={(e) => { e.currentTarget.style.background = '#004aad' }}
                title={isPlayingAll ? 'Detener' : 'Reproducir todas'}
            >
                {isPlayingAll ? <FaStop /> : <FaPlay />}
            </button>
        </div>
    )
}

export default AnimationList
