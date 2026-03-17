import Game from "../models/Game.js";

// utility: random pick
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Sample generators
const generateSudoku = () => {
  return {
    puzzle: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
    solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
  };
};

const generateRiddle = () => {
  const riddles = [
    { q: "I speak without a mouth and hear without ears. What am I?", a: "An echo" },
    { q: "What has to be broken before you can use it?", a: "An egg" },
    { q: "The more you take, the more you leave behind. What are they?", a: "Footsteps" },
  ];
  return pickRandom(riddles);
};

const generateWordScramble = () => {
  const words = ["planet", "sustain", "recycle", "biodiversity", "climate"];
  const word = pickRandom(words);
  const scrambled = word.split("").sort(() => Math.random() - 0.5).join("");
  return { scrambled, answer: word };
};

// 🎮 Get or Create Daily Game
export const getDailyGame = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    let game = await Game.findOne({ date: today });

    if (!game) {
      // randomly decide type
      const type = pickRandom(["sudoku", "riddle", "scramble"]);

      let content;
      if (type === "sudoku") content = generateSudoku();
      if (type === "riddle") content = generateRiddle();
      if (type === "scramble") content = generateWordScramble();

      game = await Game.create({
        type,
        content,
        date: today
      });
    }

    res.json(game);
  } catch (err) {
    res.status(501).json({ error: err.message });
  }
};
