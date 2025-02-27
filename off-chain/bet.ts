import { Address, applyDoubleCborEncoding, applyParamsToScript, Assets, Data, fromText, LucidEvolution, MintingPolicy, mintingPolicyToId, PolicyId, Redeemer, SpendingValidator, Unit, validatorToAddress } from "@lucid-evolution/lucid";
import betMintingContract from "./compiled/bet.signed.plutus.json" with { type: "json" };
import betPotContract from "./compiled/betpot.signed.plutus.json" with { type: "json" };
import oracleContract from "./compiled/oracle.signed.plutus.json" with { type: "json" };
import beadContract from "./compiled/bead.signed.plutus.json" with { type: "json" };
import * as t from "./types";


const oracleMintScript: MintingPolicy = {
    script: applyDoubleCborEncoding(oracleContract.cborHex),
    type: "PlutusV3"
}



const beadMintScript: MintingPolicy = {
    script: applyDoubleCborEncoding(beadContract.cborHex),
    type: "PlutusV3"
}

export async function BetInGane(
    seedPhrase: any,
    buyerAddress: Address,
    game: number,
    gameName: string,
    gameDate: number,
    result: number,
    betAda: number,
    betBead: number,
    lucid: LucidEvolution,
) {
    lucid.selectWallet.fromSeed(seedPhrase);
    console.log("bet:", game, result, gameName, gameDate, betAda, betBead);
    const beadPolicyId: PolicyId = mintingPolicyToId(beadMintScript);

    const unitBead: Unit = beadPolicyId + fromText("BEAD PR");
    console.log("unitBead", unitBead);

    const betMintingScript: MintingPolicy = {
        type: "PlutusV3",
        script: applyParamsToScript(
            betMintingContract.cborHex,
            [BigInt(game), fromText(gameName), BigInt(gameDate)] // Parameters
        ),
    };

    const betPolicyId: PolicyId = mintingPolicyToId(betMintingScript);

    const potScript: SpendingValidator = {
        type: "PlutusV3",
        script: applyParamsToScript(
            betPotContract.cborHex,
            [BigInt(game), fromText(gameName), BigInt(gameDate)] // Parameters
        ),
    };
    const betPotAddress = validatorToAddress(lucid.config().network, potScript);
    console.log("betPotAddress", betPotAddress)
    const gRedeemer1: t.BetMintingRedeemer =
    {

        result: BigInt(result),
        action: 0n

    };
    const txRedeemer: Redeemer = Data.to<t.BetMintingRedeemer>(gRedeemer1, t.BetMintingRedeemer);

    const betTokenName: string = result + gameName;
    console.log("betTokenName", betTokenName);
    const unitBet: Unit = betPolicyId + fromText(betTokenName);
    console.log("betPolicyId", betPolicyId);
    console.log("betPolicyAssetName", fromText(betTokenName))
    console.log("unitbet", unitBet);

    const assetsToBuyer: Assets = {
        [unitBet]: totalBet(betAda, betBead)
    }
    console.log("assets", assetsToBuyer);

    if (betBead > 0) {

        console.log("### without bead ###")
    } else { console.log("### with bead ###") }
    const tx = lucid
        .newTx()
        .mintAssets(assetsToBuyer, txRedeemer)
        .attach.MintingPolicy(betMintingScript)
        .pay.ToAddress(buyerAddress, assetsToBuyer)
        .pay.ToAddressWithData(betPotAddress, { kind: "inline", value: txRedeemer }, { lovelace: BigInt(betAda * 1_000_000) })
        .validTo(gameDate)
        .addSigner(buyerAddress);

    if (betBead > 0) {
        const burnRedeemer = {
            goal: 3n,

        };
        const txBurnRedeemer: Redeemer = Data.to<t.BeadRedeemer>(burnRedeemer, t.BeadRedeemer);
        const beadToBurn: Assets = {
            [unitBead]: BigInt(betBead * -1)
        }
        tx
            .mintAssets(beadToBurn, txBurnRedeemer)
            .attach.MintingPolicy(beadMintScript);
    }

    const signedTx = await (await tx.complete()).sign.withWallet().complete();
    console.log("signed");
    const txHash = await signedTx.submit();
    console.log("buy without referral tid: " + txHash);



}

function totalBet(betAda: number, betBead: number): bigint {
    return BigInt((betAda * 1_000_000 + betBead * 1_000_000));
}

// validate