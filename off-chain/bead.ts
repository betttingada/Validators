import { Address, applyDoubleCborEncoding, Assets, Data, fromText, LucidEvolution, MintingPolicy, mintingPolicyToId, PolicyId, Redeemer, Unit, UTxO } from "@lucid-evolution/lucid";
import beadContract from "./compiled/bead.signed.plutus.json" with { type: "json" };
import * as u from "./utils";


const BeadRedeemerShape = Data.Object({
    goal: Data.Integer({ minimum: 0, maximum: 3 }),

});
type BeadRedeemer = Data.Static<typeof BeadRedeemerShape>;
const BeadRedeemer = BeadRedeemerShape as unknown as BeadRedeemer;

const beadMintScript: MintingPolicy = {
    script: applyDoubleCborEncoding(beadContract.cborHex),
    type: "PlutusV3"
}




export async function BuyWithReferral(
    seedPhrase: any,
    buyerAddress: Address,
    referralAddress: Address,
    treasuryAddress: Address,
    lovelaces: bigint,
    lucid: LucidEvolution,
    hunter: Address) {
    console.log("With Referral")

    lucid.selectWallet.fromSeed(seedPhrase);

    const beadPolicyId: PolicyId = mintingPolicyToId(beadMintScript);
    console.log("bead policyId", beadPolicyId)

    const unitBead: Unit = beadPolicyId + fromText("BEAD PR");
    const unitBeadReferral: Unit = beadPolicyId + fromText("BEADR PR");


    const buyingWithoutReferralRedeemer = {
        goal: 1n,

    };
    const txRedeemer: Redeemer = Data.to<BeadRedeemer>(buyingWithoutReferralRedeemer, BeadRedeemer);

    const assetsToBuyer: Assets = {

        [unitBead]: CalcBeadFromInvested(lovelaces),
        [unitBeadReferral]: CalcBeadReferralFromInvested(lovelaces)
    }

    const va: UTxO[] = await lucid.utxosAtWithUnit(referralAddress, unitBeadReferral)
    console.log(va);

    const refQt = await u.getUtxosWithRef(va, unitBeadReferral);
    console.log("refQt", refQt)

    const distribution = CalculatePercentageAda(parseInt(lovelaces.toString()), refQt);
    console.log("ratio", distribution);

    const tx = await lucid
        .newTx()
        .readFrom(va)
        .mintAssets(assetsToBuyer, txRedeemer)
        .attach.MintingPolicy(beadMintScript)
        .pay.ToAddress(buyerAddress, assetsToBuyer)
        .pay.ToAddress(treasuryAddress, { lovelace: BigInt(distribution[0]) })
        .pay.ToAddress(referralAddress, { lovelace: BigInt(distribution[1]) })
        .addSigner(buyerAddress)
        .complete();

    const signedTx = await tx.sign.withWallet().complete();
    console.log("signed");
    const txHash = await signedTx.submit();
    console.log("buy with referral tid: " + txHash);

}

export async function BuyWithoutReferral(
    seedPhrase: any,
    buyerAddress: Address,
    treasuryAddress: Address,
    lovelaces: bigint,
    lucid: LucidEvolution) {
    console.log("Without Referral")
    lucid.selectWallet.fromSeed(seedPhrase);

    const beadPolicyId: PolicyId = mintingPolicyToId(beadMintScript);
    console.log("bead policyId", beadPolicyId)

    const unitBead: Unit = beadPolicyId + fromText("BEAD PR");
    const unitBeadReferral: Unit = beadPolicyId + fromText("BEADR PR");


    const buyingWithoutReferralRedeemer = {
        goal: 1n,

    };
    const txRedeemer: Redeemer = Data.to<BeadRedeemer>(buyingWithoutReferralRedeemer, BeadRedeemer);

    const assetsToBuyer: Assets = {

        [unitBead]: CalcBeadFromInvested(lovelaces),
        [unitBeadReferral]: CalcBeadReferralFromInvested(lovelaces)
    }


    const tx = await lucid
        .newTx()
        .mintAssets(assetsToBuyer, txRedeemer)
        .attach.MintingPolicy(beadMintScript)
        .pay.ToAddress(buyerAddress, assetsToBuyer)
        .pay.ToAddress(treasuryAddress, { lovelace: lovelaces })
        .addSigner(buyerAddress)
        .complete();

    const signedTx = await tx.sign.withWallet().complete();
    console.log("signed");
    const txHash = await signedTx.submit();
    console.log("buy without referral tid: " + txHash);
}


export function CalculatePercentageAda(ada: number, beadReferral: number): [number, number] {
    try {
        if (beadReferral > 50) beadReferral = 50;
        const referral: number = (((ada / 100) * beadReferral));
        const treasury: number = (ada) - referral
        console.log("treasury", treasury);
        return [(treasury), (referral)];
    }
    catch (e) {
        console.log("Incorrect Calculation Ada");

    }
    return [0, 0];
}

function CalcBeadFromInvested(lovelaces: BigInt): bigint {

    switch (lovelaces) {
        case BigInt(200_000_000):
            return BigInt(1000);
        case BigInt(400_000_000):
            return BigInt(2040);
        case BigInt(600_000_000):
            return BigInt(3090);
        case BigInt(800_000_000):
            return BigInt(4060);
        case BigInt(1000_000_000):
            return BigInt(5250);
        case BigInt(2000_000_000):
            return BigInt(10500)
        default:
            throw new Error("Incorrect Ada");
    }
}
function CalcBeadReferralFromInvested(lovelaces: BigInt): bigint {

    switch (lovelaces) {
        case BigInt(200_000_000):
            return BigInt(5);
        case BigInt(400_000_000):
            return BigInt(10);
        case BigInt(600_000_000):
            return BigInt(15);
        case BigInt(800_000_000):
            return BigInt(20);
        case BigInt(1_000_000_000):
            return BigInt(25);
        case BigInt(2_000_000_000):
            return BigInt(50);
        default:
            throw new Error("Incorrect Ada");
    }
}