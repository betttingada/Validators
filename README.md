# Bead, Bead Referral, Bet & Oracle contracts


## Building
go to 
```
cd ./aiken_workspace
```

## Configuring



write conditional environment modules under `env`.

```
use aiken/crypto.{VerificationKeyHash}
use aiken/primitive/string

pub const treasury: VerificationKeyHash =
  #"please change to final hash for treasury account"

pub const beadName: ByteArray = string.to_bytearray(@"BEAD PR")

pub const beadReferralName: ByteArray = string.to_bytearray(@"BEADR PR")

pub const beadPolicyId: ByteArray =
  #"policy id from validor"

pub const oraclePolicyId: ByteArray =
  #"policy id from validator"
```

## Testing

To run all tests, simply do:

```sh
aiken check
```

To run only tests matching the string `foo`, do:

```sh
aiken check -m foo
```


## compile and generate cbor contracts

```
aiken build --env preview
aiken blueprint policy  -m bead.bead.mint 
aiken build --env preview     
aiken blueprint convert  -m  bead.bead.mint > ./compiled/bead.signed.plutus
aiken blueprint convert  -m  bead.bet.mint > ./compiled/bet.signed.plutus
aiken blueprint convert  -m  bead.bet.spend > ./compiled/betpot.signed.plutus  
aiken blueprint convert  -m  bead.oracle.mint > ./compiled/oracle.signed.plutus
```

Run this and update the env file
```
echo "bead policyId: $(aiken blueprint policy  -m bead) "
echo "oracle policyId: $(aiken blueprint policy  -m oracle)"
```


## Validators Off chain code
go to 
```
cd ./offchain
```

## Testing

with deno
```
deno run -A --unstable-sloppy-imports  index.ts
```