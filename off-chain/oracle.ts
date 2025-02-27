import { Data, Address, LucidEvolution, MintingPolicy, applyParamsToScript, fromText, SpendingValidator, PolicyId, mintingPolicyToId, validatorToAddress, Unit, Redeemer, Assets, applyDoubleCborEncoding } from "@lucid-evolution/lucid";
import { accountA, AccountsList } from "./index";
import { getUtxosWithRef } from "./utils";
import * as t from "./types";
import oracleContract from "./compiled/oracle.signed.plutus.json" with { type: "json" };
import beadContract from "./compiled/bead.signed.plutus.json" with { type: "json" };
import betMintingContract from "./compiled/bet.signed.plutus.json" with { type: "json" };
import betPotContract from "./compiled/betpot.signed.plutus.json" with { type: "json" };

const oracleMintScript: MintingPolicy = {
    script: applyDoubleCborEncoding(oracleContract.cborHex),
    type: "PlutusV3"
}

const beadMintScript: MintingPolicy = {
    script: applyDoubleCborEncoding(beadContract.cborHex),
    type: "PlutusV3"
}




export async function SetResultGame(
    seedPhrase: any,
    treasuryAddress: Address,
    game: number,
    gameName: string,
    gameDate: number,
    result: number,
    goals: string,
    lucid: LucidEvolution,
) {

    lucid.selectWallet.fromSeed(seedPhrase);

    const betMintingScript: MintingPolicy = {
        type: "PlutusV3",
        script: applyParamsToScript(
            betMintingContract.cborHex,
            [BigInt(game), fromText(gameName), BigInt(gameDate)] // Parameters
        ),
    };

    const potScript: SpendingValidator = {
        type: "PlutusV3",
        script: applyParamsToScript(
            betPotContract.cborHex,
            [BigInt(game), fromText(gameName), BigInt(gameDate)] // Parameters
        ),
    };

    const betPolicyId: PolicyId = mintingPolicyToId(betMintingScript);
    const oraclePolicyId: PolicyId = mintingPolicyToId(oracleMintScript);

    const betPotAddress = validatorToAddress(lucid.config().network, potScript);
    const unitHome: Unit = betPolicyId + fromText("1" + gameName);
    const unitTie: Unit = betPolicyId + fromText("0" + gameName);
    const unitAway: Unit = betPolicyId + fromText("2" + gameName);
    const [tieBets, homeBets, awayBets] = await GetBets(lucid, unitHome, unitTie, unitAway);
    const lovelacesInAddress = await lucid.utxosAtWithUnit(betPotAddress, "lovelace");
    const totalLovelaces = lovelacesInAddress.reduce((sum, utxo) => sum + Number(utxo.assets.lovelace), 0);

    let totalWinnings;
    switch (result) {
        case 0:
            totalWinnings = tieBets;
            break;
        case 1:
            totalWinnings = homeBets;
            break;
        case 2:
            totalWinnings = awayBets;
            break;
        default:
            console.error("Invalid result");
            totalWinnings = 0;
    }

    const oracleDatum: t.OracleDatum = { game: BigInt(game), winner: BigInt(result), gamePolicyId: betPolicyId, totalAda: BigInt(totalLovelaces), totalWinnings: BigInt(totalWinnings) };
    console.log("oracleDatum", oracleDatum);
    const txOracleDatum: Redeemer = Data.to<t.OracleDatum>(oracleDatum, t.OracleDatum);

    const unitOracle: Unit = oraclePolicyId + fromText(goals);
    console.log("unitOracle", unitOracle);
    const assetsOracle: Assets = {
        [unitOracle]: 1n
    }
    const tx = await lucid
        .newTx()
        .mintAssets(assetsOracle, Data.void())
        .attach.MintingPolicy(oracleMintScript)
        .pay.ToAddress(accountA.address,  { lovelace: 2_000_000n }, )
        .pay.ToAddressWithData(betPotAddress, { kind: "inline", value: txOracleDatum }, assetsOracle, )
        .addSigner(treasuryAddress)
        .complete({ localUPLCEval: false });
    const signedTx = await tx.sign.withWallet().complete();
    console.log("signed");
    const txHash = await signedTx.submit();
    console.log("oracle tid: " + txHash);

}


async function GetBets(lucid: LucidEvolution, unitHome: Unit, unitTie: Unit, unitAway: Unit): Promise<[number, number, number]> {
    let home: number = 0;
    let tie: number = 0;
    let away: number = 0;

    for (let index = 0; index < AccountsList.length; index++) {
        const element = AccountsList[index];

        let utxo = await lucid.utxosAt(element.address);
        home += (await getUtxosWithRef(utxo, unitHome));
        tie += (await getUtxosWithRef(utxo, unitTie));
        away += (await getUtxosWithRef(utxo, unitAway));
    }

    return [tie, home, away];


}
