import { FRDCollections } from "constant/constant";
import * as admin from 'firebase-admin';
import { IFirebaseIdentities, Provider } from "../../modules/users/users.type";
import { firebaseError } from "./firebase.constants";
import {
  ICreateChatMessageOnFBRDData,
  ICreateChatMessageOnFBRDService,
  IDeleteChatMessageOnFBRDService,
  IFindManyChatMessagesResult,
  IFindManyChatMessagesService,
  IFindOneChatMessageOnFBRDService,
  IUpdateChatMessageOnFBRDService,
  IVerifyFirebaseByIdTokenResult
} from "./firebases.type";
import { getNextCursor } from "./helper";

export class FirebaseService {
  constructor() {
    if (admin.apps && admin.apps.length) {
      return
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        projectId: process.env.FIREBASE_PROJECT_ID,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }

  async createChatMessageOnFBRD({
    createMessageData,
    roomId,
  }: ICreateChatMessageOnFBRDService): Promise<string> {
    try {
      const roomPath = `${FRDCollections.ROOMS}/${roomId}`;

      // Create a new message reference with an auto-generated id
      const newMessageKey = admin.database().ref(roomPath).push().key as string;

      const messagePath = `${roomPath}/${newMessageKey}`;

      await admin.database()
        .ref()
        .update({
          [messagePath]: createMessageData,
        });

      return newMessageKey;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getListChatMessageOnFBR({
    roomId,
    query = { }
  }: IFindManyChatMessagesService): Promise<IFindManyChatMessagesResult> {
    try {
      const messagePath = `${FRDCollections.ROOMS}/${roomId}`
      const { limit = 10, cursor } = query
      const messageRef = admin.database().ref(messagePath)

      const promises = [
        messageRef
          .orderByKey()
          .get()
      ]

      if (cursor) {
        promises.push(
          messageRef
            .orderByKey()
            .endBefore(cursor)
            .limitToLast(limit)
            .get(),
        )
      }

      if (!cursor) {
        promises.push(
          messageRef
            .orderByKey()
            .limitToLast(limit)
            .get(),
        )
      }

      const [
        allMess,
        messSnapshot,
      ] = await Promise.all(promises)

      const totalCount = (allMess.exists() && Object.keys(allMess.val()).length) || 0

      if (!messSnapshot.exists()) {
        return {
          list: [],
          totalCount,
          nextCursor: 'END',
        }
      }

      const messagesObject = messSnapshot.val() || { }

      const messages = Object.keys(messagesObject).map(key => ({
        ...messagesObject[key],
        messageId: key,
      }))

      const nextCursor = getNextCursor({ data: messages, sortBy: 'messageId', limit })

      return {
        list: messages,
        totalCount,
        nextCursor,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async updateChatMessageOnFBRD({
    messageId,
    roomId,
    updateMessageData
  }: IUpdateChatMessageOnFBRDService): Promise<boolean> {
    try {
      const messagePath = `${FRDCollections.ROOMS}/${roomId}/${messageId}`
      const updates = { }

      for (const field in updateMessageData) {
        if (!field) {
          continue
        }

        updates[`${messagePath}/${field}`] = updateMessageData[field]
      }

      if (!Object.keys(updates)?.length) {
        return true
      }

      await admin.database().ref().update(updates)

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findOneChatMessageOnFBRD({
    messageId,
    roomId
  }: IFindOneChatMessageOnFBRDService): Promise<ICreateChatMessageOnFBRDData> {
    try {
      const messagePath = `${FRDCollections.ROOMS}/${roomId}/${messageId}`
      const messageRef = admin.database().ref(messagePath)
      const message = (await messageRef.get()).val()

      if (!message) {
        throw {
          code: 400,
          name: 'MessageNotFound'
        }
      }

      return message
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteChatMessageOnFBRD({
    messageId,
    roomId,
  }: IDeleteChatMessageOnFBRDService): Promise<boolean> {
    try {
      const messagePath = `${FRDCollections.ROOMS}/${roomId}/${messageId}`

      await admin.database().ref(messagePath).remove()

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async verifyFirebaseByIdToken(idToken: string): Promise<IVerifyFirebaseByIdTokenResult> {
    try {
      const decode = await admin.auth().verifyIdToken(idToken)
      let provider: Provider
      let providerId: string

      if (!decode && decode?.email_verified) {
        throw {
          code: 401,
          name: 'Invalid idToken'
        }
      }

      if (decode.firebase.sign_in_provider === IFirebaseIdentities.GOOGLE) {
        providerId = decode.firebase.identities[IFirebaseIdentities.GOOGLE][0]
        provider = Provider.GOOGLE
      }

      if (decode.firebase.sign_in_provider === IFirebaseIdentities.APPLE) {
        providerId = decode.firebase.identities[IFirebaseIdentities.APPLE][0]
        provider = Provider.APPLE
      }

      if (!provider || !providerId) {
        throw {
          code: 400,
          name: 'Provider not support'
        }
      }

      return {
        decode,
        provider,
        providerId
      }
    } catch (error) {
      const errorDetail = this.getError(error)

      return Promise.reject(errorDetail)
    }
  }

  getError(error) {
    const errorDetail = firebaseError[error.code]

    if (!errorDetail) {
      return {
        ...error,
        code: 401,
        name: 'FirebaseError'
      }
    }

    return {
      code: 401,
      name: error.code,
      message: errorDetail
    }
  }
}
