import { readFileSync, type PathLike } from "node:fs";

type Game = { hand: string; bid: number };
type CardsType =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

type HandType =
  | "Five of a kind"
  | "Four of a kind"
  | "Full House"
  | "Three of a kind"
  | "Two Pair"
  | "One Pair"
  | "High Card";

const cardStrengthMap: Record<CardsType, number> = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  "9": 8,
  "8": 7,
  "7": 6,
  "6": 5,
  "5": 4,
  "4": 3,
  "3": 2,
  "2": 1,
};

const handStrengthMap: Record<HandType, number> = {
  "Five of a kind": 7,
  "Four of a kind": 6,
  "Full House": 5,
  "Three of a kind": 4,
  "Two Pair": 3,
  "One Pair": 2,
  "High Card": 1,
};

// Result is: 250058342
function getWinnings(filePath: PathLike) {
  function getHandType(hand: string): HandType {
    const freqMap: Record<string, number> = {};
    for (const card of hand) {
      if (!freqMap[card]) freqMap[card] = 0;
      freqMap[card]++;
    }
    const val = Object.values(freqMap)
      .sort((a, b) => a - b)
      .reduce((acc, item) => acc + item, "");

    let handType: HandType;
    switch (val) {
      case "5":
        handType = "Five of a kind";
        break;
      case "14":
        handType = "Four of a kind";
        break;
      case "113":
        handType = "Three of a kind";
        break;
      case "23":
        handType = "Full House";
        break;
      case "122":
        handType = "Two Pair";
        break;
      case "1112":
        handType = "One Pair";
        break;
      default:
        handType = "High Card";
        break;
    }

    return handType;
  }

  function compareHandsStrength(hand1: string, hand2: string): -1 | 1 | 0 {
    const hand1Type = getHandType(hand1);
    const hand2Type = getHandType(hand2);
    if (handStrengthMap[hand1Type] > handStrengthMap[hand2Type]) {
      return 1;
    } else if (handStrengthMap[hand1Type] < handStrengthMap[hand2Type]) {
      return -1;
    } else {
      let start = 0;
      // a hand consists of 5 cards
      while (start < 5) {
        const card1 = hand1[start] as CardsType;
        const card2 = hand2[start] as CardsType;
        if (card1 !== card2) {
          if (cardStrengthMap[card1] > cardStrengthMap[card2]) return 1;
          else return -1;
        }
        ++start;
      }
    }
    return 0;
  }

  function insertionSort(games: Game[]) {
    for (let i = 1; i < games.length; i++) {
      let currGame = games[i];
      let currHand = currGame.hand;
      let j = i - 1;
      while (j >= 0 && compareHandsStrength(currHand, games[j].hand) === -1) {
        games[j + 1] = games[j];
        j--;
      }
      games[j + 1] = currGame;
    }
    return games;
  }

  const games = readFileSync(filePath, { encoding: "utf-8" })
    .split("\n")
    .filter((item) => item.length)
    .reduce<Game[]>((acc, item) => {
      const game = item.split(" ").filter((item) => item.length);
      const curr = {} as Game;
      curr.hand = game[0];
      curr.bid = +game[1];
      acc.push(curr);
      return acc;
    }, []);

  const rankedGames = insertionSort(games);

  let res = 0;
  for (let index = 0; index < rankedGames.length; ++index) {
    const game = rankedGames[index];
    const bid = game.bid;
    const rank = index + 1;
    res += rank * bid;
  }

  return res;
}

const res = getWinnings("./input.txt");
console.log("Result is: ", res);
