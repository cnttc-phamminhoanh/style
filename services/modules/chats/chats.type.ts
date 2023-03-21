import { Credentials } from "common/types"

export enum TypeMessage{
  TEXT = 'text',
  IMAGE = 'image',
  ICON = 'icon'
}

interface ISendMessageToChatRoomData {
  userId: string
  message: string
  type: string
}

export interface ISendMessageToChatRoomService {
  roomId: string
  data: ISendMessageToChatRoomData
}

interface IFindManyMessagesInChatRoomQuery {
  limit?: number
  cursor?: string
}

export interface IFindManyMessagesInChatRoomService {
  roomId: string
  query: IFindManyMessagesInChatRoomQuery
}

interface IUpdateChatMessageData {
  message?: string
  type?: string
}

interface IUpdateChatMessageQuery {
  messageId: string
  roomId: string
}

export interface IUpdateChatMessageService {
  data: IUpdateChatMessageData
  query: IUpdateChatMessageQuery
  credentials?: Credentials
}

interface IDeleteChatMessageQuery {
  messageId: string
  roomId: string
}

export interface IDeleteChatMessageService {
  query: IDeleteChatMessageQuery
  credentials?: Credentials
}