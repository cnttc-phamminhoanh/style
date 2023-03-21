import { FirebaseService } from "../../modules/firebases/firebases.service"
import { IFindManyChatMessagesResult } from "../../modules/firebases/firebases.type"
import {
  IDeleteChatMessageService,
  IFindManyMessagesInChatRoomService,
  ISendMessageToChatRoomService,
  IUpdateChatMessageService
} from "./chats.type"

export class ChatsService {

  async sendMessageToChatRoom({
    roomId,
    data,
  }: ISendMessageToChatRoomService): Promise<boolean> {
    try {
      const firebaseService = new FirebaseService()

      // Call create chat message on fireBase realtime database
      const newKeyMessage = await firebaseService.createChatMessageOnFBRD({
        createMessageData: {
          ...data,
          createdAt: new Date(),
        },
        roomId
      })

      return newKeyMessage ? true : false
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findManyMessagesInChatRoom({
    roomId,
    query,
  }: IFindManyMessagesInChatRoomService): Promise<IFindManyChatMessagesResult> {
    try {
      const firebaseService = new FirebaseService()

      // Call get list chat messages on fireBase realtime database
      const messages = await firebaseService.getListChatMessageOnFBR({
        query,
        roomId
      })

      return messages
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async updateChatMessage({
    query,
    data,
    credentials
  }: IUpdateChatMessageService): Promise<boolean> {
    try {
      const firebaseService = new FirebaseService()

      const message = await firebaseService.findOneChatMessageOnFBRD({
        ...query
      })

      if (message.userId !== credentials.userId) {
        throw {
          code: 403,
          name: 'You do not have permission for updating this message'
        }
      }

      // Call function update chat on fireBase realtime database
      const messages = await firebaseService.updateChatMessageOnFBRD({
        ...query,
        updateMessageData: {
          updatedAt: new Date(),
          ...data
        },
      })

      return messages
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteChatMessage({
    query,
    credentials
  }: IDeleteChatMessageService): Promise<boolean> {
    try {
      const firebaseService = new FirebaseService()

      const message = await firebaseService.findOneChatMessageOnFBRD({
        ...query
      })

      if (message.userId !== credentials.userId) {
        throw {
          code: 403,
          name: 'You do not have permission for delete this message'
        }
      }

      // Call function delete chat on fireBase realtime database
      return await firebaseService.deleteChatMessageOnFBRD({
        ...query,
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

}