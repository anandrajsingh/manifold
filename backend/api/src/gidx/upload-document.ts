import { APIError, APIHandler } from 'api/helpers/endpoint'
import { getGIDXStandardParams } from 'shared/gidx/standard-params'
import { isProd, log } from 'shared/utils'
import * as admin from 'firebase-admin'
import { PROD_CONFIG } from 'common/envs/prod'
import { DEV_CONFIG } from 'common/envs/dev'
import { updateUser } from 'shared/supabase/users'
import { createSupabaseDirectClient } from 'shared/supabase/init'
import {
  DocumentRegistrationResponse,
  GIDX_REGISTATION_ENABLED,
} from 'common/gidx/gidx'

const ENDPOINT =
  'https://api.gidx-service.in/v3.0/api/DocumentLibrary/DocumentRegistration'
export const uploadDocument: APIHandler<'upload-document-gidx'> = async (
  props,
  auth
) => {
  if (!GIDX_REGISTATION_ENABLED)
    throw new APIError(400, 'GIDX registration is disabled')
  const { fileUrl, CategoryType, fileName } = props

  const form = new FormData()
  const fileBlob = await getBlobFromUrl(fileUrl)
  form.append('file', fileBlob, fileName)

  const body = {
    ...getGIDXStandardParams(),
    MerchantCustomerID: auth.uid,
    CategoryType,
    DocumentStatus: 1,
  }
  form.append('json', JSON.stringify(body))
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    throw new APIError(400, 'GIDX registration failed')
  }
  const data = (await res.json()) as DocumentRegistrationResponse
  if (data.ResponseCode !== 0) {
    throw new APIError(400, data.ResponseMessage)
  }
  const { Document } = data
  log(
    'Uploaded document to GIDX successfully',
    'userId',
    auth.uid,
    'DocumentID',
    Document.DocumentID,
    'FileName',
    Document.FileName
  )
  await deleteFileFromFirebase(fileUrl)
  const pg = createSupabaseDirectClient()
  await updateUser(pg, auth.uid, { kycStatus: 'pending' })
  return { status: 'success' }
}

const getBlobFromUrl = async (fileUrl: string): Promise<Blob> => {
  const response = await fetch(fileUrl)
  if (!response.ok) {
    throw new APIError(400, `Error retrieving file: ${response.status}`)
  }
  return await response.blob()
}

const deleteFileFromFirebase = async (fileUrl: string) => {
  const bucket = admin
    .storage()
    .bucket(
      isProd()
        ? PROD_CONFIG.firebaseConfig.privateBucket
        : DEV_CONFIG.firebaseConfig.privateBucket
    )
  const filePath = decodeURIComponent(fileUrl.split('/o/')[1].split('?')[0])
  const file = bucket.file(filePath)

  try {
    await file.delete()
    log(`Successfully deleted file: ${filePath}`)
  } catch (error) {
    log.error('Error deleting the file:', { error })
    throw new APIError(500, 'Error deleting identity file.')
  }
}
