export const conditions = ['Diabetes', 'Hypertension', 'Asthma', 'Cardiovascular Disease', 'Chronic Kidney Disease', 'Sickle Cell'];

export const articles = [
  // Diabetes
  { id: 1,  condition: 'Diabetes', title: 'Managing Blood Sugar Daily', summary: 'Practical tips for keeping your glucose levels stable throughout the day, including meal timing and portion control.', readTime: '4 min' },
  { id: 2,  condition: 'Diabetes', title: 'Diet and Diabetes in Africa', summary: 'How to adapt traditional African diets — including ugali, fufu, and jollof rice — for better diabetes management.', readTime: '6 min' },
  { id: 3,  condition: 'Diabetes', title: 'Exercise and Blood Sugar Control', summary: 'How regular physical activity improves insulin sensitivity and helps maintain healthy glucose levels.', readTime: '5 min' },

  // Hypertension
  { id: 4,  condition: 'Hypertension', title: 'Understanding High Blood Pressure', summary: 'What hypertension means, why it is called the silent killer, and how lifestyle changes can help.', readTime: '5 min' },
  { id: 5,  condition: 'Hypertension', title: 'Salt, Stress & Blood Pressure', summary: 'The role of sodium intake and chronic stress in hypertension and practical ways to reduce both.', readTime: '4 min' },
  { id: 6,  condition: 'Hypertension', title: 'Medications for Hypertension', summary: 'A guide to common blood pressure medications, how they work, and why consistency matters.', readTime: '5 min' },

  // Asthma
  { id: 7,  condition: 'Asthma', title: 'Asthma Triggers to Avoid', summary: 'Common environmental and lifestyle triggers — dust, smoke, cold air — and how to manage exposure.', readTime: '3 min' },
  { id: 8,  condition: 'Asthma', title: 'Using Your Inhaler Correctly', summary: 'Step-by-step guidance on proper inhaler technique to ensure you get the full dose every time.', readTime: '4 min' },
  { id: 9,  condition: 'Asthma', title: 'Asthma and the Rainy Season', summary: 'Why humid and rainy conditions worsen asthma symptoms and how to prepare your action plan.', readTime: '3 min' },

  // Cardiovascular Disease
  { id: 10, condition: 'Cardiovascular Disease', title: 'Heart Health Basics', summary: 'Key daily habits that protect your heart and significantly reduce cardiovascular risk over time.', readTime: '5 min' },
  { id: 11, condition: 'Cardiovascular Disease', title: 'Reading Your Heart Rate', summary: 'What your resting heart rate tells you about your cardiovascular health and when to seek help.', readTime: '4 min' },
  { id: 12, condition: 'Cardiovascular Disease', title: 'Heart-Healthy Eating in Africa', summary: 'Choosing local foods that support heart health while staying true to your cultural food traditions.', readTime: '6 min' },

  // Chronic Kidney Disease
  { id: 13, condition: 'Chronic Kidney Disease', title: 'Protecting Your Kidneys Daily', summary: 'Simple habits — hydration, diet, and medication adherence — that slow the progression of CKD.', readTime: '5 min' },
  { id: 14, condition: 'Chronic Kidney Disease', title: 'Diet and CKD', summary: 'Foods to limit and foods to embrace when managing chronic kidney disease in an African context.', readTime: '6 min' },
  { id: 15, condition: 'Chronic Kidney Disease', title: 'Understanding Kidney Function Tests', summary: 'What creatinine, GFR, and other kidney markers mean and how to track them over time.', readTime: '5 min' },

  // Sickle Cell
  { id: 16, condition: 'Sickle Cell', title: 'Living Well with Sickle Cell', summary: 'Practical strategies for managing pain crises, fatigue, and daily life with sickle cell disease.', readTime: '6 min' },
  { id: 17, condition: 'Sickle Cell', title: 'Preventing Sickle Cell Crises', summary: 'How hydration, temperature, stress management, and infection prevention reduce crisis frequency.', readTime: '5 min' },
  { id: 18, condition: 'Sickle Cell', title: 'Sickle Cell and Mental Health', summary: 'Addressing the emotional and psychological impact of living with a chronic painful condition.', readTime: '4 min' },
];

export const communityPosts = [
  { id: 1, author: 'Amara K.', condition: 'Diabetes', time: '2h ago', content: 'Just hit 30 days of consistent blood sugar logging! Small wins matter 💪', likes: 14, comments: 3 },
  { id: 2, author: 'Chidi O.', condition: 'Hypertension', time: '5h ago', content: 'Anyone else find morning walks really help with BP? My readings have improved a lot.', likes: 9, comments: 5 },
  { id: 3, author: 'Fatima M.', condition: 'Asthma', time: '1d ago', content: 'Rainy season is tough for my asthma. Keeping my inhaler close and staying indoors more.', likes: 7, comments: 2 },
];

export const mockReminders = [
  { id: 1, title: 'Take morning medication', time: '08:00 AM', type: 'medication', active: true },
  { id: 2, title: 'Log blood pressure', time: '09:00 AM', type: 'tracking', active: true },
  { id: 3, title: 'Evening walk (30 min)', time: '06:00 PM', type: 'exercise', active: true },
  { id: 4, title: 'Take evening medication', time: '08:00 PM', type: 'medication', active: false },
];

// Nudge reminders shown to caregivers — keyed by patient id, driven by patient logs
export const mockPatientNudges = {
  1: [
    { id: 1,  type: 'wellbeing',   text: "Amara logged fatigue in her last two well-being check-ins. Check on her today — she may need some encouragement.", time: 'This morning', done: false },
    { id: 2,  type: 'tracking',    text: "Amara hasn't logged her blood sugar yet today. A gentle reminder could help keep her streak going.", time: '10:00 AM', done: false },
    { id: 3,  type: 'appointment', text: "Amara has a follow-up with her endocrinologist on Friday. Make sure she's prepared and has her recent logs ready.", time: 'Upcoming', done: false },
    { id: 4,  type: 'support',     text: "Amara reported feeling tired and a mild headache. She might need someone to talk to — reach out and let her know you're there.", time: 'Anytime', done: true },
  ],
  2: [
    { id: 5,  type: 'alert',       text: "Kwame's blood pressure was logged at 148/92 mmHg yesterday — well above his target. Follow up with him urgently.", time: '07:30 AM', done: false },
    { id: 6,  type: 'support',     text: "Kwame has been reporting stress and poor sleep this week. He may need emotional support — consider checking in with a call.", time: 'Anytime', done: false },
    { id: 7,  type: 'appointment', text: "Kwame's medication review is due next week. Remind him to bring his BP log to the appointment.", time: 'Upcoming', done: false },
    { id: 8,  type: 'tracking',    text: "Kwame's logging streak has dropped to 3 days. Encourage him to stay consistent — it helps you monitor him better.", time: '09:00 AM', done: false },
    { id: 9,  type: 'wellbeing',   text: "Kwame logged 'Low' mood twice this week. He might not be feeling well — please be there and provide emotional support.", time: 'Today', done: false },
  ],
  3: [
    { id: 10, type: 'wellbeing',   text: "Fatima is doing great — her mood has been 'Great' for 4 of the last 5 days. A quick word of encouragement will go a long way.", time: 'Anytime', done: false },
    { id: 11, type: 'appointment', text: "Fatima's routine asthma review is coming up next month. Remind her to track her peak flow daily until then.", time: 'Upcoming', done: false },
    { id: 12, type: 'tracking',    text: "Fatima hasn't logged her peak flow this afternoon. A gentle nudge to keep her 7-day streak alive.", time: '03:00 PM', done: true },
  ],
};
