const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

let requestCount = 0;

const skillScoreMap = {
  Beginner: 20,
  Intermediate: 40,
  Advanced: 50,
};

let courses = [
  { id: 1, name: "Data Structures", seats: 30 },
  { id: 2, name: "Operating Systems", seats: 25 },
];

let astronauts = [
  { name: "Ayesha Khan", specialization: "Pilot", skillLevel: "Advanced" },
  {
    name: "Omar Malik",
    specialization: "Robotics Engineer",
    skillLevel: "Intermediate",
  },
  { name: "Sara Ahmed", specialization: "Medical Officer", skillLevel: "Advanced" },
  { name: "Ali Raza", specialization: "Systems Engineer", skillLevel: "Beginner" },
];

let missions = [];

let books = [
  { id: 1, title: "Clean Code", author: "Robert Martin" },
  { id: 2, title: "Introduction to Algorithms", author: "CLRS" },
];

function countRequests(req, res, next) {
  requestCount += 1;
  next();
}

function addRequestTime(req, res, next) {
  req.requestTime = new Date().toISOString();
  next();
}

function validateMission(req, res, next) {
  const { missionName, crew } = req.body;

  if (!missionName || !crew) {
    return res.status(400).send("Invalid Request: Required fields missing");
  }

  if (!Array.isArray(crew) || crew.length === 0) {
    return res.status(400).json({ message: "Crew must be a non-empty array" });
  }

  next();
}

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function parseId(value) {
  return Number.parseInt(value, 10);
}

function findCourse(id) {
  return courses.find((course) => course.id === id);
}

function findBook(id) {
  return books.find((book) => book.id === id);
}

function calculateMissionCapabilityScore(crewNames) {
  return crewNames.reduce((total, crewMemberName) => {
    const astronaut = astronauts.find((member) => member.name === crewMemberName);
    return total + (skillScoreMap[astronaut.skillLevel] || 0);
  }, 0);
}

function findMissionByAstronaut(astronautName) {
  return missions.find((mission) => mission.crew.includes(astronautName));
}

function animalTypeCheck(req, res, next) {
  const { animalType } = req.body;
  const supportedAnimalTypes = {
    bird: "use lightweight capture equipment",
    mammal: "prepare reinforced transport and sedation support",
    reptile: "use reptile-safe containment tools",
  };

  if (!animalType || !supportedAnimalTypes[animalType]) {
    return next(createError(400, "Invalid animal type"));
  }

  req.rescueMission = {
    animalType,
    strategy: supportedAnimalTypes[animalType],
  };

  next();
}

function severityLevelCheck(req, res, next) {
  const { severity } = req.body;
  const severityConfig = {
    mild: { difficulty: 1, extraResources: { teamMembers: 0, vehicles: 0, equipment: 0 } },
    moderate: { difficulty: 2, extraResources: { teamMembers: 1, vehicles: 0, equipment: 1 } },
    severe: { difficulty: 3, extraResources: { teamMembers: 2, vehicles: 1, equipment: 2 } },
  };

  if (!severity || !severityConfig[severity]) {
    return next(createError(400, "Invalid severity level"));
  }

  req.rescueMission.severity = severity;
  req.rescueMission.difficulty = severityConfig[severity].difficulty;
  req.rescueMission.extraResources = severityConfig[severity].extraResources;

  next();
}

function resourceAvailabilityCheck(req, res, next) {
  const defaultResources = { teamMembers: 4, vehicles: 2, equipment: 4 };
  const availableResources = {
    ...defaultResources,
    ...(req.body.resources || {}),
  };

  const animalResourceMap = {
    bird: { teamMembers: 1, vehicles: 1, equipment: 1 },
    mammal: { teamMembers: 2, vehicles: 1, equipment: 2 },
    reptile: { teamMembers: 2, vehicles: 1, equipment: 1 },
  };

  const baseRequirement = animalResourceMap[req.rescueMission.animalType];
  const totalRequirement = {
    teamMembers:
      baseRequirement.teamMembers + req.rescueMission.extraResources.teamMembers,
    vehicles: baseRequirement.vehicles + req.rescueMission.extraResources.vehicles,
    equipment: baseRequirement.equipment + req.rescueMission.extraResources.equipment,
  };

  const shortages = Object.keys(totalRequirement).reduce((result, key) => {
    const shortage = totalRequirement[key] - availableResources[key];
    if (shortage > 0) {
      result[key] = shortage;
    }
    return result;
  }, {});

  req.rescueMission.availableResources = availableResources;
  req.rescueMission.requiredResources = totalRequirement;
  req.rescueMission.shortages = shortages;

  next();
}

function determineMissionOutcome(req, res) {
  const shortageCount = Object.values(req.rescueMission.shortages).reduce(
    (total, shortage) => total + shortage,
    0
  );

  let outcome = "success";

  if (shortageCount > 1 || req.rescueMission.severity === "severe") {
    outcome = shortageCount === 0 ? "success" : "unsuccessful due to lack of resources";
  } else if (shortageCount === 1) {
    outcome = "delayed";
  }

  res.json({
    message: "Rescue mission processed",
    outcome,
    strategy: req.rescueMission.strategy,
  });
}

app.use(countRequests);
app.use(express.json());

app.get("/courses", (req, res) => {
  res.json(courses);
});

app.get("/courses/:id", (req, res) => {
  const course = findCourse(parseId(req.params.id));

  if (!course) {
    return res.status(404).send("Course not found");
  }

  res.json(course);
});

app.post("/courses", (req, res) => {
  const { id, name, seats } = req.body;

  if (id === undefined || !name || seats === undefined) {
    return res.status(400).json({ message: "Invalid Request: Required fields missing" });
  }

  if (findCourse(id)) {
    return res.status(400).json({ message: "Course with this id already exists" });
  }

  const newCourse = { id, name, seats };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});

app.put("/courses/:id", (req, res) => {
  const course = findCourse(parseId(req.params.id));

  if (!course) {
    return res.status(404).send("Course not found");
  }

  if (req.body.seats === undefined) {
    return res.status(400).json({ message: "Invalid Request: Required fields missing" });
  }

  course.seats = req.body.seats;
  res.json(course);
});

app.delete("/courses/:id", (req, res) => {
  const courseId = parseId(req.params.id);
  const courseIndex = courses.findIndex((course) => course.id === courseId);

  if (courseIndex === -1) {
    return res.status(404).send("Course not found");
  }

  const deletedCourse = courses.splice(courseIndex, 1)[0];
  res.json({ message: "Course deleted successfully", course: deletedCourse });
});

app.get("/astronauts", (req, res) => {
  res.json(astronauts);
});

app.post("/missions", validateMission, (req, res) => {
  const { missionName, crew } = req.body;

  if (missions.find((mission) => mission.missionName === missionName)) {
    return res.status(400).json({ message: "Mission already exists" });
  }

  const selectedAstronauts = crew.map((name) =>
    astronauts.find((astronaut) => astronaut.name === name)
  );

  if (selectedAstronauts.includes(undefined)) {
    const missingAstronaut = crew.find(
      (name) => !astronauts.some((astronaut) => astronaut.name === name)
    );
    return res.status(404).json({ message: `Astronaut "${missingAstronaut}" not found` });
  }

  const alreadyAssigned = crew.find((name) => findMissionByAstronaut(name));
  if (alreadyAssigned) {
    const assignedMission = findMissionByAstronaut(alreadyAssigned);
    return res.status(400).json({
      message: `Astronaut "${alreadyAssigned}" is already assigned to mission "${assignedMission.missionName}"`,
    });
  }

  const newMission = {
    missionName,
    crew,
    missionCapabilityScore: calculateMissionCapabilityScore(crew),
  };

  missions.push(newMission);
  res.status(201).json(newMission);
});

app.get("/missions/:missionName", (req, res) => {
  const mission = missions.find(
    (entry) => entry.missionName.toLowerCase() === req.params.missionName.toLowerCase()
  );

  if (!mission) {
    return res.status(404).json({ message: "Mission not found" });
  }

  res.json({
    missionName: mission.missionName,
    crew: mission.crew,
    missionCapabilityScore: calculateMissionCapabilityScore(mission.crew),
  });
});

app.delete("/missions/:missionName", (req, res) => {
  const missionIndex = missions.findIndex(
    (entry) => entry.missionName.toLowerCase() === req.params.missionName.toLowerCase()
  );

  if (missionIndex === -1) {
    return res.status(404).json({ message: "Mission not found" });
  }

  const [deletedMission] = missions.splice(missionIndex, 1);
  res.send(`Mission "${deletedMission.missionName}" has been successfully cancelled.`);
});

app.get("/stats", (req, res) => {
  res.send(`Total API Requests: ${requestCount}`);
});

app.get("/request-time", addRequestTime, (req, res) => {
  res.send(`This request was received at: ${req.requestTime}`);
});

app.post(
  "/rescue-mission",
  animalTypeCheck,
  severityLevelCheck,
  resourceAvailabilityCheck,
  determineMissionOutcome
);

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const book = findBook(parseId(req.params.id));

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
});

app.post("/books", (req, res) => {
  const { id, title, author } = req.body;

  if (id === undefined || !title || !author) {
    return res.status(400).json({ message: "Invalid Request: Required fields missing" });
  }

  if (findBook(id)) {
    return res.status(400).json({ message: "Book with this id already exists" });
  }

  const newBook = { id, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const book = findBook(parseId(req.params.id));

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const { title, author } = req.body;
  if (!title && !author) {
    return res.status(400).json({ message: "Invalid Request: Required fields missing" });
  }

  if (title) {
    book.title = title;
  }

  if (author) {
    book.author = author;
  }

  res.json(book);
});

app.delete("/books/:id", (req, res) => {
  const bookId = parseId(req.params.id);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];
  res.json({ message: "Book deleted successfully", book: deletedBook });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { app };
