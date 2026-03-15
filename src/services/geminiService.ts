import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateStudyNote = async (subject: string, chapter: string, topic: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `You are an expert HSC tutor. Please provide a detailed study note on the topic: '${topic}' from chapter '${chapter}' of '${subject}'.
    
    Language: ${language === 'bn' ? 'Bengali (with English terms in brackets)' : 'English'}
    
    Structure the note as follows:
    1. Introduction (What is it?)
    2. Key Concepts (Bullet points)
    3. Important Formulas/Definitions (Use LaTeX for math)
    4. HSC Exam Tips (Shortcut or trick if possible)
    
    Make it modern, easy to understand, and use clear formatting.`,
  });

  const response = await model;
  return response.text;
};

export const generateCQ = async (subject: string, chapter: string, topic: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Generate 2 Creative Questions (CQ) for HSC level on the topic: '${topic}' from chapter '${chapter}' of '${subject}'.
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}
    
    Each CQ should have:
    - A Stimulus (Uddipok)
    - Questions (a, b, c, d)
    - Detailed answers for each.`,
  });
  const response = await model;
  return response.text;
};

export const generateMCQ = async (subject: string, chapter: string, topic: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Generate 10 Multiple Choice Questions (MCQ) for HSC level on the topic: '${topic}' from chapter '${chapter}' of '${subject}'.
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}
    
    Include 4 options for each and highlight the correct answer.`,
  });
  const response = await model;
  return response.text;
};

export const generateFlashcards = async (subject: string, chapter: string, topic: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Generate 5 Flashcards (Question on front, Answer on back) for HSC level on the topic: '${topic}' from chapter '${chapter}' of '${subject}'.
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}
    
    Format as:
    Front: [Question]
    Back: [Answer]`,
  });
  const response = await model;
  return response.text;
};

export const generateQuiz = async (subject: string, chapter: string, topic: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Generate a short mock test/quiz for HSC level on the topic: '${topic}' from chapter '${chapter}' of '${subject}'.
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}
    
    Include a mix of short questions and conceptual questions.`,
  });
  const response = await model;
  return response.text;
};

export const generateKaKha = async (subject: string, chapter: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Generate a list of important 'Ka' (Knowledge-based) and 'Kha' (Comprehension-based) questions and answers for HSC level for the chapter: '${chapter}' of '${subject}'.
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}
    
    Format them clearly as:
    Ka Questions:
    1. [Question] - [Answer]
    Kha Questions:
    1. [Question] - [Answer]`,
  });
  const response = await model;
  return response.text;
};

export const analyzePerformance = async (scores: any, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Analyze this student's performance data: ${JSON.stringify(scores)}.
    Identify:
    1. Strongest subjects/skills.
    2. Weakest areas needing improvement.
    3. Specific advice for each subject (including Coding and Languages).
    4. Motivation message.
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}`,
  });
  const response = await model;
  return response.text;
};

export const predictVarsityChance = async (performance: any, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Based on this student's performance: ${JSON.stringify(performance)}, predict their chances for:
    - BUET/Engineering
    - Medical
    - Dhaka University (DU)
    - Other top universities.
    Provide percentage chances and specific requirements they need to focus on.
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}`,
  });
  const response = await model;
  return response.text;
};

export const getCareerCounselling = async (data: { passion: string, hobby: string, mood: string, performance: any }, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Provide a career counselling session.
    Student Data:
    - Passion: ${data.passion}
    - Hobby: ${data.hobby}
    - Current Mood: ${data.mood}
    - Performance: ${JSON.stringify(data.performance)}
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}
    
    Analyze which occupation would be best for them and provide a motivating roadmap.`,
  });
  const response = await model;
  return response.text;
};

export const generateAIPersonalizedRoutine = async (examDate: string, currentProgress: any, dailyCommitment: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Create a personalized HSC study routine.
    - Exam Date: ${examDate}
    - Current Progress: ${JSON.stringify(currentProgress)}
    - Daily Study Hours: ${dailyCommitment}
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}
    
    Include specific time slots, subjects to focus on, and mandatory daily practice (MCQ, CQ, Quiz).`,
  });
  const response = await model;
  return response.text;
};

export const getCollegeQuestionPattern = async (collegeName: string, subject: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Provide information about the question pattern and frequently asked questions for '${subject}' at '${collegeName}' (HSC level in Bangladesh).
    Include tips on what the teachers there usually focus on.
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}`,
  });
  const response = await model;
  return response.text;
};

export const generateSpecialExamNote = async (subject: string, chapter: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Generate a 'Special Common Note' for the chapter: '${chapter}' of '${subject}' for HSC exams.
    Focus on topics that are most likely to appear in the board exams. 
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}
    
    Include:
    1. Most Important Topics (Common topics)
    2. Critical Formulas/Concepts
    3. Likely CQ/MCQ patterns.
    Make it concise and high-yield.`,
  });
  const response = await model;
  return response.text;
};

export const getBoardQuestions = async (subject: string, board: string, year: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Provide a list of important board questions for '${subject}' from '${board}' board for the year '${year}' (HSC level).
    If exact questions are not available, provide highly similar model questions based on that year's pattern.
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}`,
  });
  const response = await model;
  return response.text;
};

export const getLanguageLabContent = async (language: string, type: 'speaking' | 'writing' | 'listening' | 'reading') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Generate a ${type} exercise for learning ${language}.
    - If speaking: Provide a dialogue script and pronunciation tips.
    - If writing: Provide a prompt and a model answer.
    - If listening: Provide a transcript of a scenario and comprehension questions.
    - If reading: Provide a short story/article and questions.
    Make it interactive and suitable for students. Response should be in ${language === 'English' ? 'English' : 'Bengali'}.`,
  });
  const response = await model;
  return response.text;
};

export const startFeynmanTechnique = async (topic: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `You are an AI student who wants to learn about '${topic}'. 
    Ask the user (the teacher) a specific, slightly challenging question about '${topic}' to see if they can explain it simply.
    Your tone should be curious and respectful.
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}`,
  });
  const response = await model;
  return response.text;
};

export const evaluateFeynmanExplanation = async (topic: string, explanation: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `The student (user) explained '${topic}' as follows: '${explanation}'.
    As an AI tutor, evaluate if this explanation is accurate, simple, and clear (Feynman Technique).
    If it's good, praise them. If it's missing something or too complex, ask a follow-up question to help them simplify it.
    
    Language: ${language === 'bn' ? 'Bengali' : 'English'}`,
  });
  const response = await model;
  return response.text;
};

export const getAITutorResponse = async (message: string, context: string, history: any[], language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `You are 'Pikachu', a friendly and highly intelligent AI Study Tutor for HSC students in Bangladesh. 
    Current context: ${context}
    Chat History: ${JSON.stringify(history)}
    User message: ${message}
    
    Language Preference: ${language === 'bn' ? 'Bengali (with English technical terms)' : 'English'}
    
    Respond in a helpful, motivating, and slightly playful way. If the user is feeling lazy, motivate them!`,
  });

  const response = await model;
  return response.text;
};

export const getPrivateTutorResponse = async (message: string, history: any[], language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `You are 'Master Pika', a dedicated private tutor for HSC students. 
    Your goal is to teach the student step-by-step.
    
    Language Preference: ${language === 'bn' ? 'Bengali (ধীরে ধীরে এবং ধরে ধরে শিখানো)' : 'English (Slow and steady teaching)'}
    
    Guidelines:
    1. Break down complex topics into small, digestible parts.
    2. After explaining a small part, ask the student a question to check their understanding.
    3. Do not move to the next part until the student understands the current one.
    4. Be extremely patient and encouraging.
    
    Chat History: ${JSON.stringify(history)}
    User message: ${message}`,
  });

  const response = await model;
  return response.text;
};

export const solveMathProblem = async (problem: string) => {
  const model = ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: `Solve this HSC level math problem step-by-step in Bengali:
    Problem: ${problem}
    
    Provide:
    1. The core formula used.
    2. Step-by-step breakdown.
    3. Final answer clearly highlighted.
    4. A similar practice problem.`,
  });

  const response = await model;
  return response.text;
};
