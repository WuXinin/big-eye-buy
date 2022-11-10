import { MutableRefObject, useEffect, useRef, useState } from "react";

export function useEventListener(
	element: EventTarget | MutableRefObject<HTMLElement | undefined>,
	eventListeners: (keyof WindowEventMap)[] | keyof WindowEventMap,
	callback: (event: Event) => void, options?: boolean | AddEventListenerOptions
): void {
	let listeners: (keyof WindowEventMap)[];
	if (!Array.isArray(eventListeners)) listeners = [eventListeners];
	else listeners = eventListeners

	useEffect(() => {
		let listenerEl = ("current" in element) ? element.current : element;
		if (!listenerEl) return;
		listeners.forEach((listener: keyof WindowEventMap) => {
			(listenerEl as EventTarget).addEventListener(listener, callback, options)
		})
		return () => {
			if (!listenerEl) return;
			listeners.forEach((listener: keyof WindowEventMap) => {
				(listenerEl as EventTarget).removeEventListener(listener, callback)
			})
		}
	}, [element, listeners, callback, options])
}

export const useInterval = (callback: Function, timeoutMs: number, runFirst?: boolean) => {
	useEffect(() => {
		if (runFirst) callback()
		let interval = setInterval(callback, timeoutMs)
		return () => clearInterval(interval)
	}, [])
}

export const useRandoms = (numOfRandoms: number, min: number = 0, max: number = 1): number[] => {
	const [ randoms, setRandoms ] = useState<number[]>([])
	useEffect(() => {
		let newRandoms: number[] = []
		new Array(numOfRandoms).fill(0).forEach(() => {
			newRandoms.push(Math.random() * (max - min) + min)
		})
		setRandoms(newRandoms)
	}, [])
	return randoms
}

export const useRandom = (min: number, max: number): number => {
	let rands = useRandoms(1, min, max)
	return rands[0]
}

export const useClickAway = (
	ref: MutableRefObject<HTMLElement | null | undefined>,
	callback: (e: MouseEvent) => void,
	ignoreRefs?: MutableRefObject<HTMLElement | null | undefined>[]
) => {
	useEventListener(window, ["click"], (e: Event) => {
		const currRef = ref.current;
		if (!currRef) return;
		let isIgnored = false
		if (ignoreRefs) {
			ignoreRefs.forEach((ignoreRef: MutableRefObject<HTMLElement | undefined | null>) => {
				if (e.target) {
					let current = ignoreRef?.current
					if (current) {
						if (current.isEqualNode(e.target as Node)) isIgnored = true
						if (current.contains(e.target as Node)) isIgnored = true
					}
				}
				
			})
		}
		if (!currRef.isEqualNode(e.target as Node) && !currRef.contains(e.target as Node) && !isIgnored) {
			callback(e as MouseEvent);
		}
	});
};

export const usePrev = <T>(value: T): T | undefined => {
	const ref = useRef<T>();
  
	useEffect(() => {
	  ref.current = value;
	}, [value]);
  
	return ref.current;
}