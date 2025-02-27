import { Constructor, UTxO, Unit } from "@lucid-evolution/lucid";


export async function getUtxosWithRef(va: UTxO[], tokenUnit: Unit): Promise<number> {
    let total: number = 0;

    try {



        va.forEach(obj => {

            try {
                total += parseInt(obj.assets[tokenUnit].toString());
            } catch (error) {

            }

        })

    } catch (error) {

    }

    return (total);
}

export function valueWon(totalWinners: number, totalPot: number, myBet: number): number {
    console.log("valueWon", totalWinners, totalPot, myBet);
    console.log("valueWon", fixedPointDivision(myBet, totalWinners, 20) * totalPot);
  //  return fixedPointDivision(mine, max, 9) * total;
 // aposta / soma dos vencedores * total
    return Math.trunc(((myBet / totalWinners) * totalPot))
}

export function fixedPointDivision(numerator: number, denominator: number, precision: number): number {
    const scaleFactor = Math.pow(10, precision);
    return Math.trunc((numerator * scaleFactor) / denominator) / scaleFactor;
}

export function AdaToLovelace(ada: number): number {
    return ada * 1000000;
}