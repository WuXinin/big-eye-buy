import React, { ReactElement, ReactNode } from "react";

export interface Serializer<T> {
	serialize: (value: T) => string,
	deserialize: (str: string) => T
}

export interface ComponentItem<V extends string | number = any, D = any> {
	label: string,
	value: V,
	data?: D
}

export type Primitive = number | string | boolean | null | undefined

export type WatchListSortType = "WATCH_STATUS" | "LAST_UPDATED" | "USER_SCORE" | "DATE_STARTED"


type PropsWithChildren<P = unknown> = P & { children?: ReactNode | ReactNode[] | undefined };

export type Component<P = {}> = React.FC<PropsWithChildren<P>>;

export type ComponentType = React.FC<any> | string

export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;