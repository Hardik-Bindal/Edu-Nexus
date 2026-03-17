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
      type: "scramble",
      content: { scrambled: "elcryce", answer: "recycle" },
      date: todayKey,
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
