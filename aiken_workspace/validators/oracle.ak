use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction}
use env
use util.{signed_by}

validator oracle {
  mint(_redeemer: Data, _policy_id: PolicyId, self: Transaction) {
    signed_by(env.treasury, self.extra_signatories)
  }

  else(_) {
    fail
  }
}
