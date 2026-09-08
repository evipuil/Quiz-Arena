export type Question = {
  category: string;
  prompt: string;
  answer: string;
  accepted: string[];
};

export const QUESTIONS: Question[] = [
  { category: 'Science', prompt: 'What organelle is known as the powerhouse of the cell?', answer: 'Mitochondria', accepted: ['mitochondria', 'mitochondrion'] },
  { category: 'History', prompt: 'Which treaty formally ended World War I?', answer: 'Treaty of Versailles', accepted: ['treaty of versailles', 'versailles'] },
  { category: 'Literature', prompt: 'Who wrote the novel “Things Fall Apart”?', answer: 'Chinua Achebe', accepted: ['chinua achebe', 'achebe'] },
  { category: 'Mathematics', prompt: 'What is the value of pi rounded to two decimal places?', answer: '3.14', accepted: ['3.14'] },
  { category: 'Geography', prompt: 'What is the longest river in South America?', answer: 'Amazon River', accepted: ['amazon', 'amazon river', 'the amazon'] },
  { category: 'Art', prompt: 'Which artist painted “The Persistence of Memory”?', answer: 'Salvador Dalí', accepted: ['salvador dali', 'dali', 'dalí'] },
  { category: 'Science', prompt: 'What is the chemical symbol for gold?', answer: 'Au', accepted: ['au'] },
  { category: 'History', prompt: 'Which civilization built Machu Picchu?', answer: 'The Inca', accepted: ['inca', 'incas', 'the inca', 'inca civilization'] },
  { category: 'Literature', prompt: 'In Greek mythology, who flew too close to the sun?', answer: 'Icarus', accepted: ['icarus'] },
  { category: 'Geography', prompt: 'What is the capital city of New Zealand?', answer: 'Wellington', accepted: ['wellington'] },
];

export function isCorrectAnswer(question: Question, response: string) {
  const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/[.,!?]/g, '');
  return question.accepted.some((answer) => normalize(answer) === normalize(response));
}
