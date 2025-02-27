import { Data } from "@lucid-evolution/lucid";

export const BeadRedeemerShape = Data.Object({
    goal: Data.Integer({ minimum: 0, maximum: 3 }),

});
export type BeadRedeemer = Data.Static<typeof BeadRedeemerShape>;
export const BeadRedeemer = BeadRedeemerShape as unknown as BeadRedeemer;

export const BetMintingRedeemerShape = Data.Object({
    result: Data.Integer({ minimum: 0, maximum: 3 }),
    action: Data.Integer({ minimum: 0, maximum: 3 }),
});
export type BetMintingRedeemer = Data.Static<typeof BetMintingRedeemerShape>;
export const BetMintingRedeemer = BetMintingRedeemerShape as unknown as BetMintingRedeemer;



export const BetSpendRedeenerShape = Data.Object({
    action: Data.Integer({ minimum: 0, maximum: 3 }),
});
export type BetSpendRedeener = Data.Static<typeof BetSpendRedeenerShape>;
export const BetSpendRedeener = BetSpendRedeenerShape as unknown as BetSpendRedeener;



export const OracleDatumShape = Data.Object({
    game: Data.Integer(),
    winner: Data.Integer({ minimum: 0, maximum: 3 }),
    gamePolicyId: Data.Bytes(),
    totalAda: Data.Integer(),
    totalWinnings: Data.Integer(),

});
export type OracleDatum = Data.Static<typeof OracleDatumShape>;
export const OracleDatum = OracleDatumShape as unknown as OracleDatum;
