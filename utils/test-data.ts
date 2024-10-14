
const questionsHavingChoices = [
  {
    id: 1,
    description: 'quest 1 for dist 1',
    choices: [
      {
        id: 1,
        description: 'choice 1 for ques 1',
        question: { href: 'http://localhost:4000/api/questions/1' },
        party: 'democrate',
        votes: 3
      },
      {
        id: 2,
        description: 'choice 2 for ques 1',
        question: { href: 'http://localhost:4000/api/questions/1' },
        party: 'republican',
        votes: 0
      },
      {
        id: 3,
        description: 'choice 3 for ques 1',
        question: { href: 'http://localhost:4000/api/questions/1' },
        party: 'republican',
        votes: 1
      },
      {
        id: 5,
        description: 'choice 4 for quest 1',
        question: { href: 'http://localhost:4000/api/questions/1' },
        party: 'democrate',
        votes: 0
      }
    ],
    district: { href: 'http://localhost:4000/api/districts/1' }
  },
  {
    id: 23,
    description: 'quest 23 for dist 1',
    choices: [
      {
        id: 14,
        description: 'choice 1 for quest 3 - dist 1',
        question: { href: 'http://localhost:4000/api/questions/23' },
        party: 'republican',
        votes: 3
      },
      {
        id: 15,
        description: 'choice 2 for quest 3 - dist 1',
        question: { href: 'http://localhost:4000/api/questions/23' },
        party: 'democrate',
        votes: 0
      }
    ],
    district: { href: 'http://localhost:4000/api/districts/1' }
  },
  {
    id: 24,
    description: 'quest 4 for dist 1',
    choices: [
      {
        id: 16,
        description: 'choice 1 for question 24',
        question: { href: 'http://localhost:4000/api/questions/24' },
        party: 'republican',
        votes: 0
      }
    ],
    district: { href: 'http://localhost:4000/api/districts/1' }
  }
]


const choices = [
  { id: 10, party: "Repub", votes: 2 }, { id: 11, party: "Democ", votes: 2 }, { id: 12, party: "Repub", votes: 3 }, 
  { id: 13, party: "Repub", votes: 10 }, { id: 14, party: "Democ", votes: 2 }, { id: 15, party: "Repub", votes: 30 },
]