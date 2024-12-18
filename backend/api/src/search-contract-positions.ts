import { constructPrefixTsQuery } from 'shared/helpers/search'
import {
  from,
  join,
  limit,
  orderBy,
  renderSql,
  select,
  where,
} from 'shared/supabase/sql-builder'
import { type APIHandler } from './helpers/endpoint'
import { createSupabaseDirectClient } from 'shared/supabase/init'

export const searchContractPositions: APIHandler<
  'search-contract-positions'
> = async (props) => {
  const { term, contractId, limit } = props
  const pg = createSupabaseDirectClient()
  const query = getSearchUserSQL(term, limit, contractId)
  const users = await pg.manyOrNone(query)
  return users
}

function getSearchUserSQL(term: string, lim: number, contractId: string) {
  const search = renderSql(
    select(
      `users.id, name, username, users.data->>'avatarUrl' as "avatarUrl", users.data->'isBannedFromPosting' as "isBannedFromPosting"`
    ),
    from('users'),
    term
      ? [
          where(
            `name_username_vector @@ websearch_to_tsquery('english', $1)
             or name_username_vector @@ to_tsquery('english', $2)`,
            [term, constructPrefixTsQuery(term)]
          ),

          orderBy(
            `ts_rank(name_username_vector, websearch_to_tsquery($1)) desc,
             users.data->>'lastBetTime' desc nulls last`,
            [term]
          ),
        ]
      : orderBy(`users.data->'creatorTraders'->'allTime' desc nulls last`),

    join('user_contract_metrics ucm on ucm.user_id = users.id'),
    where('ucm.contract_id = $1', [contractId]),
    where('ucm.has_shares = true'),
    where('ucm.answer_id is null'),
    limit(lim)
  )
  return search
}
