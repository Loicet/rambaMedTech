# RambaMedTech

A chronic disease management platform built for African communities, connecting patients, caregivers, and healthcare administrators in one place.

---

## What it does

RambaMedTech helps people living with chronic conditions like Diabetes, Hypertension, Asthma, Cardiovascular Disease, Chronic Kidney Disease, and Sickle Cell manage their health day to day. It also gives caregivers meaningful, patient-driven insights so they can provide better support.

### For Patients
- Log health vitals (blood sugar, blood pressure, heart rate, weight, peak flow, oxygen saturation)
- Daily well-being check-ins with mood tracking and symptom reporting
- Personalized health tips based on their condition
- Health education articles tailored to their diagnosis
- Community forum to connect with others managing similar conditions
- Personal reminders for medication, tracking, and exercise
- Invite caregivers and control exactly what data they can see

### For Caregivers
- Patient-driven nudges based on what patients actually log — mood, vitals, missed logs, upcoming appointments
- Full patient health overview including vitals, emotional well-being, health insights, and suggested actions
- Direct messaging with patients
- Clinical resources and guidelines
- Privacy-respecting — only sees what the patient has allowed

### For Admins
- Platform overview with live stats
- User management with search, filter, view, and edit
- Content management for health education articles
- Reports and analytics
- System health monitoring

---

## Tech stack

- **React 18** with React Router v6
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** as the build tool

> The current version uses in-memory mock data. No backend or database is connected yet — see Next Steps below.

---

## Getting started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```


## Key features

- **OTP verification on sign up** — 6-digit code step before accessing the dashboard (demo code shown on screen)
- **Role-based dashboards** — patients, caregivers, and admins each get a completely different experience
- **Caregiver nudges** — reminders based on patient logs, not generic alerts
- **Consent controls** — patients choose exactly what their caregiver can see
- **Invite system** — patients generate a code, caregivers redeem it to link accounts
- **Bilingual** — English and Kinyarwanda (rw) supported throughout
- **Fully responsive** — mobile-first with bottom tab navigation, desktop sidebar layout

---

## Project structure

```
src/
├── components/       # Navbar, Layout, LangToggle, RambaLogo
├── context/          # Auth, Health, Language, Consent, Invite
├── data/             # Mock data (users, articles, reminders, nudges)
├── i18n/             # English and Kinyarwanda translations
├── pages/            # All page components by role
│   ├── Patient       # Dashboard, Tracker, Wellbeing, Education, Community, Notifications
│   ├── Caregiver     # Dashboard, Overview, Messages, Resources
│   └── Admin         # Dashboard, Users, Content, Reports, System
└── App.jsx           # Routes
```

---

## Next steps

- [ ] Wire up actual OTP delivery via email or SMS
- [ ] Appointment scheduling between patients and caregivers
- [ ] Health data charts and trend visualization
- [ ] Push notifications for caregiver nudges and patient reminders
- [ ] Onboarding flow for new users after sign up

---

## Conditions supported

Diabetes · Hypertension · Asthma · Cardiovascular Disease · Chronic Kidney Disease · Sickle Cell

---

*Built with care for African health communities.*
