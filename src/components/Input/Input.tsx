import React, { useRef } from "react"
import { Component } from "../../types/Util"
import Button from "../Button"

import toast, { Toaster } from "react-hot-toast"

import CopyIcon from "../../svg/copy.svg"

import "./Input.css"
import clsx from "clsx"
import InputBase from "../InputBase"

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
	label?: string,
	copyable?: boolean,
	size?: "default" | "compact"
}

const Input: Component<InputProps> = ({
	label, copyable, id, style, className, size, ...others
}: InputProps) => {
	const ref = useRef<HTMLInputElement | null>(null)

	const copy = () => {
		navigator.clipboard.writeText(ref.current?.value || "")
		toast("Copied Text", {position: "bottom-center", duration: 2000})
	}

	return (
		<InputBase
			label={label}
			className={clsx("form-input-root", className, `size-${size || "default"}`)}
			style={style}
			id={id}
		>
			<input
				{...others}
				id={id}
				size={1}
				ref={(el) => ref.current = el}
				className={"input"}
			/>
			{copyable && (
				<Button onClick={copy} variant="secondary">
					Copy <CopyIcon />
				</Button>
			)}
		</InputBase>
	)
}

export default Input