

interface IUpdateStylistData {
  bio?: string
  introduce?: string
  images?: string[]
  rate?: number
  flexibility?: number
}

export interface IUpdateStylistService {
  stylistId: string
  data: IUpdateStylistData
}

interface IFindOneStylistData {
  stylistId: string
}

export interface IFindOneStylistService {
  query: IFindOneStylistData
  relations?: string[]
}

interface ICreateStylistData {
  stylistId: string
  bio?: string
  introduce?: string
  images?: string[]
  rate?: number
  flexibility?: number
}

export interface ICreateStylistService {
  data: ICreateStylistData
}