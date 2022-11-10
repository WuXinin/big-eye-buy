import React, { createContext, useEffect, useState } from "react"
import axios, { AxiosResponse } from "axios";
import { Component } from "../types/Util";

const HEADERS = {
	headers: {
		project: "https://bigeyes.space/",
	},
};

export const ApiContext = createContext<ApiContextData>({
	data: {},
	fetching: false,
	fetchedAt: 0,
	getData: () => {}
} as ApiContextData)

export interface ApiResponse {
	tokenPrice: string,
	nextStageTokenPrice: string,
	stage: string,
	stageTokens: string,
	stageSoldTokens: number,
	totalSoldTokensValueUsd: number,
	cumTokenValueUsd: number,
	totalSoldTokens: number,
	projectWalletAddress: string
}

export interface ApiContextData {
	data: ApiResponse | undefined,
	fetching: boolean,
	fetchedAt: number
	getData: () => Promise<AxiosResponse<ApiResponse>>
}

export const ApiContextWrapper: Component = ({ children }) => {
	const [ data, setData ] = useState<ApiResponse>();
	const [ fetching, setFetching ] = useState(false)
	const [ fetchedAt, setFetchedAt ] = useState(0)
	
	const getNumbers = async (): Promise<AxiosResponse<ApiResponse>> => {
		return new Promise((resolve, reject) => {
			setFetching(true)
			setFetchedAt(Date.now())
			axios.get<ApiResponse>(`https://presaleapi.bigeyes.space`, HEADERS).then((res) => {
				if (res && res.data) {
					setData(res.data)      
				}
				resolve(res)
			}).catch((err) => reject(err)).finally(() => setFetching(false));
		})
	  };

	useEffect(() => {
		getNumbers()
	}, [])

	const ApiData: ApiContextData = {
		data,
		fetching,
		fetchedAt,
		getData: getNumbers
	}

	return (
		<ApiContext.Provider value={ApiData}>
			{children}
		</ApiContext.Provider>
	)
}