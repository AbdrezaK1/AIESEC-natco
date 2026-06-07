'use client'

import { Compass, Dice5, Flame, HeartHandshake, MapPinned, Trophy, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const questTiles = [
  {
    href: '/seat',
    label: 'Claim Camp Access',
    desc: 'Register and unlock your conference pass.',
    Icon: UserPlus,
  },
  {
    href: '/leaderboard',
    label: 'Climb The Board',
    desc: 'Watch LCs move up as delegates register.',
    Icon: Trophy,
  },
  {
    href: '/location',
    label: 'Find The Basecamp',
    desc: 'Open the venue map and basecamp details.',
    Icon: MapPinned,
  },
  {
    href: '/location#schedule',
    label: 'Follow The Trail',
    desc: 'The conference schedule will be shared after.',
    Icon: Compass,
  },
  {
    href: '/gossip',
    label: 'Light The Campfire',
    desc: 'Share the funniest anonymous stories.',
    Icon: Flame,
  },
  {
    href: '/wishes',
    label: 'Send Totem Energy',
    desc: 'Leave wishes for delegates and LCs.',
    Icon: HeartHandshake,
  },
]

export default function JungleQuestBoard() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [rollValue, setRollValue] = useState(1)
  const [isRolling, setIsRolling] = useState(false)

  const selectedTile = questTiles[selectedIndex]
  const trailNote = useMemo(() => {
    return `Checkpoint ${selectedIndex + 1} is open: ${selectedTile.label}.`
  }, [selectedIndex, selectedTile.label])

  function rollDice() {
    if (isRolling) return

    setIsRolling(true)

    const nextRoll = Math.floor(Math.random() * questTiles.length) + 1
    setRollValue(nextRoll)

    window.setTimeout(() => {
      setSelectedIndex(nextRoll - 1)
      setIsRolling(false)
    }, 540)
  }

  return (
    <section className="jungle-quest-board animate-in" aria-label="Interactive Juman'CO adventure board">
      <div className="quest-board-copy">
        <h2 className="board-title">Roll Into The Next Checkpoint</h2>
        <p>
          Pick your route manually or roll the dice and let the game board choose the next place to explore.
        </p>
      </div>

      <div className="quest-board-control">
        <button type="button" className={`quest-dice ${isRolling ? 'is-rolling' : ''}`} onClick={rollDice}>
          <Dice5 size={24} aria-hidden="true" />
          <span>{rollValue}</span>
        </button>
        <p>{trailNote}</p>
        <Link href={selectedTile.href} className="wood-button">
          Enter Checkpoint
        </Link>
      </div>

      <div className="quest-path" aria-label="Adventure checkpoints">
        {questTiles.map((tile, index) => {
          const Icon = tile.Icon
          const isActive = index === selectedIndex

          return (
            <Link
              key={tile.href}
              href={tile.href}
              className={`quest-tile ${isActive ? 'is-active' : ''}`}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="quest-step">{String(index + 1).padStart(2, '0')}</span>
              <span className="quest-icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <span className="quest-text">
                <strong>{tile.label}</strong>
                <small>{tile.desc}</small>
              </span>
              {isActive ? <span className="quest-token" aria-hidden="true" /> : null}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
