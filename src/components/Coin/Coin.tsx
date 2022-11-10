import clsx from "clsx"
import React, { useEffect, useState } from "react"
import { Component } from "../../types/Util"
import { useEventListener, useInterval } from "../../util"

import "./Coin.css"


export interface Position {
	x: number,
	y: number
}

export interface Coin {
	id: number,
	variant: 1 | 2,
	startPosition: Position,
	endPosition: Position,
	maxSize: number,
	minSize: number,
	rotate: number
}

export interface UseCoinArgs {
	maxXOffset?: number,
	minXOffset?: number
	maxYOffset?: number,
	minYOffset?: number
	minSize?: number,
	maxSize?: number,
	maxCoinsInBurst?: number,
	minCoinsInBurst?: number,
	minRotate?: number,
	maxRotate?: number
}

let coinId = 0

export const useCoins = (
	containerRef: React.MutableRefObject<HTMLDivElement | undefined>,
	args: UseCoinArgs = {}
) => {
	const {
		maxXOffset, maxYOffset,
		minSize, maxSize,
		minXOffset, minYOffset,
		maxCoinsInBurst, minCoinsInBurst,
		minRotate, maxRotate
	} = {
		...args,
		maxXOffset: 80,
		minXOffset: -80,
		maxYOffset: 100,
		minYOffset: 30,
		minSize: 0,
		maxSize: 1,
		maxCoinsInBurst: 8,
		minCoinsInBurst: 6,
		minRotate: -30,
		maxRotate: 30
	}

	const [ coins, setCoins ] = useState<Coin[]>([])
	const [ containerHeight, setContainerHeight ] = useState(0)
	const [ containerWidth, setContainerWidth ] = useState(0)

	const maxCoinInterval = 200

	const coinBurst = () => {
		const numCoins = Math.random() * (maxCoinsInBurst - minCoinsInBurst) + minCoinsInBurst;
		for (let i = 0; i < numCoins; i++) {
			setTimeout(addRandomCoin, Math.random() * 200)
		}
	}

	const addRandomCoin = () => {
		coinId++
		const variant = Math.floor(Math.random() + 0.5) + 1 as Coin["variant"]

		const startPosition = {
			x: (Math.random() - 0.5) * containerWidth,
			y: Math.random() * containerHeight
		}

		const endPosition = {
			x: Math.random() * (maxXOffset - minXOffset) + minXOffset,
			y: Math.random() * (maxYOffset - minYOffset) + minYOffset,
		}

		const rotate = Math.random() * (maxRotate - minRotate) + minRotate
		
		const newCoin: Coin = {
			id: coinId,
			variant,
			startPosition,
			endPosition,
			minSize,
			maxSize,
			rotate
		}

		setCoins((coins) => [...coins, newCoin])

		setTimeout(() => {
			setCoins((coins) => coins.filter((coin) => coin.id !== newCoin.id))
		}, 1500)
	}

	const calculateContainerSize = () => {
		const container = containerRef.current
		if (!container) return;

		const { width, height } = container.getBoundingClientRect()

		setContainerHeight(height)
		setContainerWidth(width)
	}

	useEffect(calculateContainerSize, [])
	useEventListener(containerRef, ["resize"], calculateContainerSize)

	return {
		coins,
		addRandomCoin,
		coinBurst
	}
}

const Coin: Component<Coin> = ({
	startPosition, endPosition, variant,
	minSize, maxSize, rotate
}) => {
	const [ currentPosition, setCurrentPosition ] = useState(startPosition)
	const [ currentSize, setCurrentSize ] = useState(minSize)
	const [ state, setState ] = useState<"entering" | "exiting">("entering")

	useEffect(() => {
		let timeouts: NodeJS.Timeout[] = []

		timeouts.push(setTimeout(() => {
			setCurrentPosition(endPosition)
			setCurrentSize(maxSize)
		}, 20))

		timeouts.push(setTimeout(() => {
			setState("exiting")
		}, 150))

		return () => {
			timeouts.forEach((timeout) => clearTimeout(timeout))
		}
	}, [])

	return (
		<img
			className={clsx("coin", `coin-${state}`)}
			style={{
				transform: `
				translate(
					calc(-50% + ${currentPosition.x}px),
					calc(-50% + ${currentPosition.y}px)
				)
				scale(${currentSize})
				rotate(${rotate}deg)`
			}}
			src={`/img/coin-${variant}-sm/coin-${variant}-sm.webp`}
		/>
	)
}

export default Coin