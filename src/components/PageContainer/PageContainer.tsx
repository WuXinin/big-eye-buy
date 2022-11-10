import clsx from "clsx"
import React from "react"
import { Component } from "../../types/Util"

import "./PageContainer.css"

export type PageContainerProps = React.HTMLAttributes<HTMLDivElement> & {

}

const PageContainer: Component<PageContainerProps> = ({
	className, ...others
}) => {
	return (
		<div {...others} className={clsx("page-container", className)}>
			{others.children}
		</div>
	)
}

export default PageContainer