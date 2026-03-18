import dotenv from "dotenv";
import mongoose from "mongoose";

import DailyFact from "../models/DailyFact.js";
import Game from "../models/Game.js";
import Group from "../models/Group.js";
import Material from "../models/Material.js";
import NewsFeed from "../models/NewsFeed.js";
import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";
import User from "../models/User.js";

dotenv.config();

const pointsPerLevel = 50;

const mkQuestion = (questionText, options, correctAnswer, explanation, marks = 1) => ({
  questionText,
  options,
  correctAnswer,
  explanation,
  marks,
});

const buildResultPayload = (quiz, studentId, selectedAnswers, reasoningPrefix, reviewed = false, partialMarks = {}) => {
  const answers = quiz.questions.map((question, index) => {
    const selectedAnswer = selectedAnswers[index] || "";
    const isCorrect = selectedAnswer === question.correctAnswer;
    const fallbackMarks = isCorrect ? question.marks : 0;
    const explicitMarks = partialMarks[String(question._id)];
    const obtainedMarks = Number.isFinite(explicitMarks)
      ? Math.max(0, Math.min(explicitMarks, question.marks))
      : fallbackMarks;

    return {
      questionId: question._id,
      selectedAnswer,
      reasoning: `${reasoningPrefix} - Q${index + 1}`,
      isCorrect,
      obtainedMarks,
    };
  });

  const score = answers.reduce((sum, answer) => sum + (answer.obtainedMarks || 0), 0);
  const total = quiz.questions.reduce((sum, question) => sum + (question.marks || 0), 0);

  return {
    student: studentId,
    quiz: quiz._id,
    answers,
    score,
    total,
    reviewed,
  };
};

const seed = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Add it to backend/.env before running the seed.");
  }

  await mongoose.connect(mongoUri);

  console.log("Connected to MongoDB. Resetting collections...");

  await Promise.all([
    Result.deleteMany({}),
    Quiz.deleteMany({}),
    Group.deleteMany({}),
    Material.deleteMany({}),
    DailyFact.deleteMany({}),
    Game.deleteMany({}),
    NewsFeed.deleteMany({}),
    User.deleteMany({}),
  ]);

  const teacher = await User.create({
    name: "Aditi Sharma",
    email: "teacher@edunexus.demo",
    password: "Teacher@123",
    role: "teacher",
  });

  const mentor = await User.create({
    name: "Neel Deshmukh",
    email: "mentor@edunexus.demo",
    password: "Teacher@123",
    role: "teacher",
  });

  const students = await Promise.all([
    User.create({
      name: "Rahul Verma",
      email: "rahul@edunexus.demo",
      password: "Student@123",
      role: "student",
    }),
    User.create({
      name: "Priya Nair",
      email: "priya@edunexus.demo",
      password: "Student@123",
      role: "student",
    }),
    User.create({
      name: "Arjun Mehta",
      email: "arjun@edunexus.demo",
      password: "Student@123",
      role: "student",
    }),
    User.create({
      name: "Sana Khan",
      email: "sana@edunexus.demo",
      password: "Student@123",
      role: "student",
    }),
    User.create({
      name: "Dev Patel",
      email: "dev@edunexus.demo",
      password: "Student@123",
      role: "student",
    }),
  ]);

  const [rahul, priya, arjun, sana, dev] = students;

  const climateQuiz = await Quiz.create({
    title: "Climate Change Foundations",
    topic: "Environment",
    difficulty: "easy",
    level: "Grade 8",
    timeLimit: 10,
    createdBy: teacher._id,
    questions: [
      mkQuestion(
        "Which gas contributes the most to global warming?",
        ["Carbon dioxide", "Nitrogen", "Helium", "Hydrogen"],
        "Carbon dioxide",
        "CO2 released from fossil fuels is the largest human-driven greenhouse contributor.",
        1
      ),
      mkQuestion(
        "What is the main purpose of recycling?",
        ["Increase waste", "Save resources", "Burn plastics", "Reduce rainfall"],
        "Save resources",
        "Recycling reduces extraction of virgin raw materials and lowers landfill pressure.",
        1
      ),
      mkQuestion(
        "Which source is renewable?",
        ["Coal", "Solar", "Diesel", "Natural gas"],
        "Solar",
        "Solar energy is naturally replenished and does not run out at human timescales.",
        1
      ),
      mkQuestion(
        "Planting trees helps by...",
        ["Increasing CO2", "Absorbing CO2", "Creating plastic", "Heating oceans"],
        "Absorbing CO2",
        "Trees absorb atmospheric CO2 through photosynthesis.",
        1
      ),
    ],
  });

  const energyQuiz = await Quiz.create({
    title: "Renewable Energy Deep Dive",
    topic: "Energy",
    difficulty: "medium",
    level: "Grade 10",
    timeLimit: 18,
    createdBy: teacher._id,
    questions: [
      mkQuestion(
        "Which technology converts sunlight directly to electricity?",
        ["Wind turbine", "Photovoltaic cell", "Hydro dam", "Geothermal pump"],
        "Photovoltaic cell",
        "PV cells convert photons into electrical current.",
        2
      ),
      mkQuestion(
        "What is a key challenge of solar power?",
        ["No energy output", "Intermittency", "Infinite emissions", "Unstable voltage only"],
        "Intermittency",
        "Solar output changes by time of day and weather, requiring storage or balancing.",
        2
      ),
      mkQuestion(
        "Which storage system is commonly paired with solar plants?",
        ["Lead bricks", "Battery banks", "Gas flares", "Steam pipes"],
        "Battery banks",
        "Battery banks store surplus electricity for later usage.",
        2
      ),
      mkQuestion(
        "What improves wind farm output forecasting?",
        ["Weather models", "Paper maps", "Manual guesses", "River depth"],
        "Weather models",
        "Meteorological models help forecast generation with better reliability.",
        2
      ),
    ],
  });

  const sustainabilityQuiz = await Quiz.create({
    title: "Sustainability Strategy Challenge",
    topic: "Sustainability",
    difficulty: "hard",
    level: "Senior Secondary",
    timeLimit: 22,
    createdBy: mentor._id,
    questions: [
      mkQuestion(
        "Which metric compares total greenhouse gases over a product life cycle?",
        ["Water index", "Carbon footprint", "Biodiversity score", "Noise level"],
        "Carbon footprint",
        "Life cycle carbon footprint captures emissions from production to disposal.",
        3
      ),
      mkQuestion(
        "Circular economy aims to...",
        ["Discard faster", "Keep materials in use", "Increase mining", "Avoid repair"],
        "Keep materials in use",
        "Circular models prioritize reuse, repair, and regeneration.",
        3
      ),
      mkQuestion(
        "Best first step in school waste audit?",
        ["Buy bins", "Measure current waste streams", "Ban paper", "Close cafeteria"],
        "Measure current waste streams",
        "Baseline measurement guides effective intervention planning.",
        3
      ),
    ],
  });

  const additionalQuizzes = [
    {
      title: "Physics Basics: Motion and Force",
      topic: "Physics",
      difficulty: "easy",
      level: "Grade 9",
      timeLimit: 15,
      createdBy: teacher._id,
      questions: [
        mkQuestion("What is the standard unit of force?", ["Newton", "Joule", "Watt", "Pascal"], "Newton", "Force is measured in Newtons in the SI system.", 1),
        mkQuestion("Which law states 'For every action, there is an equal and opposite reaction'?", ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravitation"], "Newton's Third Law", "This is the definition of Newton's Third Law of Motion.", 1),
        mkQuestion("What is the acceleration due to gravity on Earth?", ["9.8 m/s^2", "10 m/s", "9.8 km/s", "8.9 m/s^2"], "9.8 m/s^2", "Standard gravity on Earth is approximately 9.8 m/s^2.", 1)
      ]
    },
    {
      title: "Advanced Mathematics: Calculus",
      topic: "Mathematics",
      difficulty: "hard",
      level: "Grade 12",
      timeLimit: 25,
      createdBy: mentor._id,
      questions: [
        mkQuestion("What is the derivative of x^2?", ["x", "2x", "x^3/3", "2x^2"], "2x", "Using the power rule, d/dx(x^2) = 2x.", 3),
        mkQuestion("What is the integral of 1/x?", ["x", "ln|x|", "e^x", "1/x^2"], "ln|x|", "The antiderivative of 1/x is the natural logarithm of absolute x.", 3)
      ]
    },
    {
      title: "World History: WWII",
      topic: "History",
      difficulty: "medium",
      level: "Grade 10",
      timeLimit: 20,
      createdBy: teacher._id,
      questions: [
        mkQuestion("In what year did World War II end?", ["1943", "1945", "1947", "1950"], "1945", "WWII ended in 1945 with the surrender of Germany and Japan.", 2),
        mkQuestion("Which of these countries was part of the Axis powers?", ["USA", "Soviet Union", "Japan", "Britain"], "Japan", "Germany, Italy, and Japan formed the core of the Axis powers.", 2)
      ]
    },
    {
      title: "Geographic Wonders",
      topic: "Geography",
      difficulty: "easy",
      level: "Grade 8",
      timeLimit: 10,
      createdBy: mentor._id,
      questions: [
        mkQuestion("What is the tallest mountain in the world?", ["K2", "Mount Everest", "Mount Kilimanjaro", "Denali"], "Mount Everest", "Mount Everest is the highest peak above sea level.", 1),
        mkQuestion("Which is the longest river in the world?", ["Amazon", "Nile", "Yangtze", "Mississippi"], "Nile", "The Nile is traditionally considered the longest river in the world.", 1)
      ]
    },
    {
      title: "Intro to Computer Science",
      topic: "Computer Science",
      difficulty: "medium",
      level: "Grade 11",
      timeLimit: 15,
      createdBy: teacher._id,
      questions: [
        mkQuestion("Which of these is not a programming language?", ["Python", "Java", "HTML", "C++"], "HTML", "HTML is a markup language, not a Turing-complete programming language.", 2),
        mkQuestion("What does CPU stand for?", ["Central Process Unit", "Computer Personal Unit", "Central Processing Unit", "Central Processor Unit"], "Central Processing Unit", "The CPU acts as the brain of the computer.", 2)
      ]
    },
    {
      title: "Human Anatomy",
      topic: "Biology",
      difficulty: "hard",
      level: "Grade 12",
      timeLimit: 20,
      createdBy: mentor._id,
      questions: [
        mkQuestion("What is the largest organ in the human body?", ["Liver", "Brain", "Heart", "Skin"], "Skin", "The skin is the largest organ by surface area and weight.", 3),
        mkQuestion("What part of the brain controls balance?", ["Cerebrum", "Cerebellum", "Brainstem", "Hypothalamus"], "Cerebellum", "The cerebellum is responsible for motor control and balance.", 3)
      ]
    },
    {
      title: "Chemical Reactions",
      topic: "Chemistry",
      difficulty: "medium",
      level: "Grade 10",
      timeLimit: 20,
      createdBy: teacher._id,
      questions: [
        mkQuestion("What is the chemical formula for water?", ["H2O2", "CO2", "H2O", "O2"], "H2O", "Water consists of two hydrogen atoms and one oxygen.", 2),
        mkQuestion("Which of these is a noble gas?", ["Oxygen", "Nitrogen", "Helium", "Chlorine"], "Helium", "Helium is a noble gas in Group 18 of the periodic table.", 2)
      ]
    },
    {
      title: "Shakespearean Literature",
      topic: "English",
      difficulty: "medium",
      level: "Grade 11",
      timeLimit: 15,
      createdBy: mentor._id,
      questions: [
        mkQuestion("Who wrote Hamlet?", ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], "William Shakespeare", "Hamlet is one of Shakespeare's most famous tragedies.", 2),
        mkQuestion("Which play features the character 'Puck'?", ["Macbeth", "Othello", "A Midsummer Night's Dream", "Romeo and Juliet"], "A Midsummer Night's Dream", "Puck is a mischievous fairy in this comedy.", 2)
      ]
    },
    {
      title: "Astronomy Basics",
      topic: "Science",
      difficulty: "easy",
      level: "Grade 8",
      timeLimit: 10,
      createdBy: teacher._id,
      questions: [
        mkQuestion("Which planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Saturn"], "Mars", "Mars appears red due to iron oxide on its surface.", 1),
        mkQuestion("What is the closest star to Earth?", ["Sirius", "Alpha Centauri", "The Sun", "Proxima Centauri"], "The Sun", "The Sun is our solar system's central star.", 1)
      ]
    }
  ];

  await Quiz.insertMany(additionalQuizzes);

  const partialMarksForPriya = {
    [String(energyQuiz.questions[1]._id)]: 1,
  };

  const results = await Result.insertMany([
    buildResultPayload(
      climateQuiz,
      rahul._id,
      ["Carbon dioxide", "Save resources", "Solar", "Absorbing CO2"],
      "Confident answer"
    ),
    buildResultPayload(
      climateQuiz,
      priya._id,
      ["Carbon dioxide", "Save resources", "Coal", "Absorbing CO2"],
      "I remembered this from class"
    ),
    buildResultPayload(
      climateQuiz,
      arjun._id,
      ["Nitrogen", "Save resources", "Solar", "Increasing CO2"],
      "Need revision"
    ),
    buildResultPayload(
      energyQuiz,
      rahul._id,
      ["Photovoltaic cell", "Intermittency", "Battery banks", "Weather models"],
      "Concept-based selection"
    ),
    buildResultPayload(
      energyQuiz,
      priya._id,
      ["Photovoltaic cell", "No energy output", "Battery banks", "Weather models"],
      "Used elimination logic",
      true,
      partialMarksForPriya
    ),
    buildResultPayload(
      sustainabilityQuiz,
      sana._id,
      ["Carbon footprint", "Keep materials in use", "Measure current waste streams"],
      "Practical project perspective"
    ),
    buildResultPayload(
      sustainabilityQuiz,
      dev._id,
      ["Carbon footprint", "Discard faster", "Measure current waste streams"],
      "Mostly sure"
    ),
  ]);

  const studentIds = students.map((student) => String(student._id));

  for (const studentId of studentIds) {
    const totalScore = results
      .filter((result) => String(result.student) === studentId)
      .reduce((sum, result) => sum + (result.score || 0), 0);

    const level = Math.max(1, Math.floor(totalScore / pointsPerLevel) + 1);
    const badges = [];

    if (totalScore >= 10) badges.push("Quiz Starter");
    if (totalScore >= 18) badges.push("Eco Learner");
    if (totalScore >= 25) badges.push("Climate Champ");

    await User.findByIdAndUpdate(studentId, {
      ecoPoints: totalScore,
      level,
      badges,
    });
  }

  await Material.insertMany([
    {
      title: "Climate Action Workbook",
      description: "Worksheet pack covering climate systems, emissions, and mitigation plans.",
      subject: "Science",
      gradeLevel: "Grade 8",
      uploadedBy: teacher._id,
      fileUrl: "https://example.org/materials/climate-action-workbook.pdf",
    },
    {
      title: "Renewable Energy Lab Guide",
      description: "Hands-on lab activities on solar and wind generation basics.",
      subject: "Physics",
      gradeLevel: "Grade 10",
      uploadedBy: mentor._id,
      fileUrl: "https://example.org/materials/renewable-lab-guide.pdf",
    },
    {
      title: "Sustainability Case Studies",
      description: "Real school case studies on zero-waste implementation and outcomes.",
      subject: "Environmental Studies",
      gradeLevel: "Senior Secondary",
      uploadedBy: teacher._id,
      fileUrl: "https://example.org/materials/sustainability-case-studies.pdf",
    },
  ]);

  await Group.insertMany([
    {
      name: "Green Innovators",
      createdBy: teacher._id,
      members: [teacher._id, rahul._id, priya._id, arjun._id],
      studyMaterials: [
        {
          title: "Weekly Reflection Template",
          type: "text",
          content: "1) What did we learn? 2) What confused us? 3) Next action item.",
          uploadedBy: teacher._id,
        },
      ],
    },
    {
      name: "Sustainable Cities Squad",
      createdBy: mentor._id,
      members: [mentor._id, sana._id, dev._id],
      studyMaterials: [
        {
          title: "Urban Waste Reduction Notes",
          type: "text",
          content: "Focus on segregation, composting pilots, and citizen participation.",
          uploadedBy: mentor._id,
        },
      ],
    },
  ]);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await DailyFact.insertMany([
    {
      factText: "Switching classroom lights to LEDs can cut lighting energy use by up to 50 percent.",
      category: "energy",
      createdBy: teacher._id,
      createdAt: today,
    },
    {
      factText: "Composting one kilogram of food waste can avoid methane emissions from landfills.",
      category: "waste",
      createdBy: mentor._id,
      createdAt: yesterday,
    },
  ]);

  const todayKey = today.toISOString().split("T")[0];
  const yesterdayKey = yesterday.toISOString().split("T")[0];

  await Game.insertMany([
    {
      type: "sudoku",
      content: {
        puzzle: "5 3 . | . 7 . | . . .\n6 . . | 1 9 5 | . . .\n. 9 8 | . . . | . 6 .\n---------------------\n8 . . | . 6 . | . . 3\n4 . . | 8 . 3 | . . 1\n7 . . | . 2 . | . . 6\n---------------------\n. 6 . | . . . | 2 8 .\n. . . | 4 1 9 | . . 5\n. . . | . 8 . | . 7 9",
        solution: "5 3 4 | 6 7 8 | 9 1 2\n6 7 2 | 1 9 5 | 3 4 8\n1 9 8 | 3 4 2 | 5 6 7\n---------------------\n8 5 9 | 7 6 1 | 4 2 3\n4 2 6 | 8 5 3 | 7 9 1\n7 1 3 | 9 2 4 | 8 5 6\n---------------------\n9 6 1 | 5 3 7 | 2 8 4\n2 8 7 | 4 1 9 | 6 3 5\n3 4 5 | 2 8 6 | 1 7 9"
      },
      date: todayKey,
    },
    {
      type: "scramble",
      content: { scrambled: "elcryce", answer: "recycle" },
      date: yesterdayKey,
    },
    {
      type: "riddle",
      content: {
        q: "I am full of holes but still hold water. What am I?",
        a: "A sponge",
      },
      date: yesterdayKey,
    },
  ]);

  await NewsFeed.insertMany([
    {
      title: "Schools launch student-led solar monitoring projects",
      description: "Districts are combining physics classes with rooftop solar analytics dashboards.",
      url: "https://example.org/news/solar-monitoring-schools",
      category: "general",
      publishedAt: today,
    },
    {
      title: "City expands school recycling hubs",
      description: "A new pilot links neighborhood recycling hubs with school sustainability clubs.",
      url: "https://example.org/news/recycling-hubs-pilot",
      category: "general",
      publishedAt: yesterday,
    },
    {
      title: "Student teams prototype low-cost air quality sensors",
      description: "Open-source sensor kits are helping classrooms run local environmental studies.",
      url: "https://example.org/news/student-air-sensors",
      category: "general",
      publishedAt: yesterday,
    },
  ]);

  console.log("\nSample data seeded successfully.\n");
  console.log("Demo login credentials:");
  console.log("Teacher  : teacher@edunexus.demo / Teacher@123");
  console.log("Teacher  : mentor@edunexus.demo / Teacher@123");
  console.log("Students : rahul|priya|arjun|sana|dev@edunexus.demo / Student@123");

  console.log("\nInserted records summary:");
  console.log(`Users      : ${await User.countDocuments()}`);
  console.log(`Quizzes    : ${await Quiz.countDocuments()}`);
  console.log(`Results    : ${await Result.countDocuments()}`);
  console.log(`Groups     : ${await Group.countDocuments()}`);
  console.log(`Materials  : ${await Material.countDocuments()}`);
  console.log(`Facts      : ${await DailyFact.countDocuments()}`);
  console.log(`Games      : ${await Game.countDocuments()}`);
  console.log(`News items : ${await NewsFeed.countDocuments()}`);
};

seed()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Sample seed failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  });
