import { createSupabaseClient } from 'shared/supabase/init'
import { APIError, APIHandler } from '../helpers/endpoint'
import { createLoveLikeNotification } from 'shared/create-love-notification'
import { runLikePurchaseTxn } from 'shared/txn/run-like-purchase-txn'
import { getHasFreeLike } from './has-free-like'
import { createAnswerCpmmMain } from 'api/create-answer-cpmm'
import { addTargetToUserMarket } from 'shared/love/love-markets'
import { LOVE_MARKET_COST } from 'common/love/constants'
import { log } from 'shared/utils'

export const likeLover: APIHandler<'like-lover'> = async (props, auth) => {
  const { targetUserId, remove } = props
  const creatorId = auth.uid

  const db = createSupabaseClient()

  if (remove) {
    const { error } = await db
      .from('love_likes')
      .delete()
      .eq('creator_id', creatorId)
      .eq('target_id', targetUserId)

    if (error) {
      throw new APIError(500, 'Failed to remove like: ' + error.message)
    }
    return { status: 'success' }
  }

  // Check if like already exists
  const existing = await db
    .from('love_likes')
    .select()
    .eq('creator_id', creatorId)
    .eq('target_id', targetUserId)

  if (existing.data?.length) {
    log('Like already exists, do nothing')
    return { status: 'success' }
  }

  const hasFreeLike = await getHasFreeLike(creatorId)

  if (!hasFreeLike) {
    // Charge for like.
    await runLikePurchaseTxn(creatorId, targetUserId)
  }

  // Insert the new like
  const { data, error } = await db
    .from('love_likes')
    .insert({
      creator_id: creatorId,
      target_id: targetUserId,
    })
    .select()
    .single()

  if (error) {
    throw new APIError(500, 'Failed to add like: ' + error.message)
  }

  const continuation = async () => {
    const createAnswer = (
      contractId: string,
      creatorId: string,
      targetUserId: string,
      text: string
    ) =>
      createAnswerCpmmMain(contractId, text, creatorId, {
        overrideAddAnswersMode: 'ONLY_CREATOR',
        specialLiquidityPerAnswer: LOVE_MARKET_COST,
        loverUserId: targetUserId,
      })

    await createLoveLikeNotification(data)
    await addTargetToUserMarket(creatorId, targetUserId, createAnswer)
    await addTargetToUserMarket(targetUserId, creatorId, createAnswer)
  }

  return {
    result: { status: 'success' },
    continue: continuation,
  }
}
