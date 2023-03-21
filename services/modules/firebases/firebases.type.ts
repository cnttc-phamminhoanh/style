import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier"
import { Provider } from "../../modules/users/users.type"

export interface ICreateChatMessageOnFBRDData {
  userId: string
  message: string
  type: string
  seenAt?: Date
  createdAt: Date
  updatedAt?: Date
}

export interface ICreateChatMessageOnFBRDService {
  createMessageData: ICreateChatMessageOnFBRDData
  roomId: string
}

interface IFindManyChatMessagesQuery {
  limit?: number
  cursor?: string
}

export interface IFindManyChatMessagesService {
  query: IFindManyChatMessagesQuery
  roomId: string
}

export interface IFindManyChatMessagesResult {
  list: string[]
  totalCount: number
  nextCursor: number | string
}

interface IUpdateMessageData {
  message?: string
  type?: string
  updatedAt: Date
}

export interface IUpdateChatMessageOnFBRDService {
  messageId: string
  roomId: string
  updateMessageData: IUpdateMessageData
}

export interface IFindOneChatMessageOnFBRDService {
  messageId: string
  roomId: string
}


export interface IDeleteChatMessageOnFBRDService {
  messageId: string
  roomId: string
}

export interface IVerifyFirebaseByIdTokenResult {
  decode: DecodedIdToken
  provider: Provider
  providerId: string
}