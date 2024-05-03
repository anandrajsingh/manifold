import { createBountyAddedNotification } from 'shared/create-notification'
import { runAddBountyTxn } from 'shared/txn/run-bounty-txn'
import { getContract } from 'shared/utils'
import { type APIHandler } from './helpers/endpoint'

export const addBounty: APIHandler<'market/:contractId/add-bounty'> = async (
  props,
  auth
) => {
  const { contractId, amount } = props

  // run as transaction to prevent race conditions
  const txn = await runAddBountyTxn({
    fromId: auth.uid,
    fromType: 'USER',
    toId: contractId,
    toType: 'CONTRACT',
    amount,
    token: 'M$',
    category: 'BOUNTY_ADDED',
  })

  const contract = await getContract(contractId)
  if (contract && contract.creatorId !== auth.uid) {
    await createBountyAddedNotification(
      contract.creatorId,
      contract,
      auth.uid,
      amount
    )
  }

  return txn
}
