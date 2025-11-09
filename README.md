# 🎓 Student Mentor AI - Advanced MVP

An intelligent AI-powered personal mentor system that monitors and supports students holistically across academics, sports, mental health, and personal development. Built for the Cloud Run Hackathon.

## 🌟 Overview

Student Mentor AI is more than just a chatbot—it's a comprehensive personal guide that:

- **Monitors Daily Progress**: Tracks student behavior across studies, sports, mental health, and social activities
- **Provides Personalized Guidance**: Adapts communication style based on student's age, maturity level, and personality
- **Supports Career Aspirations**: Guides students toward their dream careers with targeted advice
- **Enables Peer Collaboration**: Connect with classmates and teachers for homework help and discussions
- **Smart Task Management**: Track homework and upcoming tests with intelligent reminders
- **AI-Powered Alerts**: Automatically notifies teachers when students need extra support
- **Generates Teacher Reports**: Provides educators with detailed insights into student well-being and performance
- **Ensures Holistic Development**: Balances academic excellence with mental health and physical fitness

## 🚀 Key Features

### 1. **Comprehensive Onboarding** 📝
- Multi-step profile creation capturing:
  - Basic info (name, age, grade)
  - Academic subjects, goals, and learning style
  - Career aspirations and dream job (editable anytime)
  - Interests and hobbies (dynamic updates)
  - Sports and physical activities
  - Academic and personal challenges
  - Mental health considerations
- **Note**: Personalization data is used by AI but NOT shown in dashboard

### 2. **Dynamic Goals Management** 🎯
- **Current Goals**: Active focus areas
- **Short-term Goals**: 3-6 month objectives
- **Long-term Goals**: 1+ year aspirations
- **Career Aspirations**: Updated as interests evolve
- **Interests**: Add/remove hobbies anytime
- All goals are editable from user profile menu

### 3. **Homework & To-Do List** 📚
- View all assigned homework from teachers
- Filter by status: All, Pending, Completed
- Sort by due date or priority
- Priority levels: Low, Medium, High, Urgent
- Mark as in-progress, completed, or submitted
- Overdue warnings with visual indicators
- Estimated time tracking
- Subject and teacher information

### 4. **Upcoming Tests & Exams** 📝
- Complete test schedule from teachers
- View tests by: Upcoming, Today, This Week, All
- Test importance: Quiz, Unit Test, Midterm, Final, Board Exam
- Syllabus topics for each test
- Preparation status tracking
- Study materials and resources
- Personal notes for each test
- Days-until countdown

### 5. **Peer & Teacher Chat** 👥
- Real-time messaging with classmates
- Direct communication with teachers
- Online status indicators
- Message read receipts
- Subject-specific teacher contacts
- Conversation history
- Unread message counters

### 6. **AI Teacher Alerts** 🔔
- Automatic detection of struggling students
- Mental health crisis warnings
- Academic difficulty patterns
- Severity levels: Low, Medium, High, Urgent
- AI-generated insights and recommendations
- Suggested interventions
- Beta version for teacher notification

### 7. **Intelligent Dashboard** 📊
- Real-time progress visualization
- Mood trend analysis
- Study hours tracking
- Homework completion rates
- Stress level monitoring
- Recent activity feed
- Achievement highlights
- **Note**: Personal aspirations hidden from dashboard

### 8. **Daily Check-In System** ✅
- Track mood and emotional state
- Log sleep hours and energy levels
- Record study sessions and subjects
- Monitor physical activity
- Capture achievements and challenges
- Build historical data for insights

### 9. **Advanced AI Chat** 💬
- Context-aware conversations using Gemini 2.0 Flash
- Age-appropriate communication style
- Personalized responses based on all profile data
- Considers current goals, not hardcoded aspirations
- Real-time streaming responses
- Automatic activity logging
- **AI Alert Triggers**: Detects when student needs teacher intervention
- Quick prompt suggestions

### 10. **Teacher Report Generation** 📄
- Comprehensive student progress reports
- Academic performance analysis
- Mental health and well-being assessment
- Physical activity tracking
- Behavioral insights
- Actionable recommendations
- Downloadable and printable reports

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for responsive design
- **Google Generative AI SDK** for Gemini integration

### Data Management
- LocalStorage for client-side persistence
- Comprehensive TypeScript interfaces (9+ models)
- Real-time state management
- Automatic data synchronization

### AI Integration
- **Gemini 2.0 Flash Experimental** model
- Dynamic system instruction generation
- Context-aware prompting with full student history
- Streaming responses for better UX
- Intelligent alert detection

## 📁 Project Structure

```
student-mentor-ai/
├── components/
│   ├── Login.tsx                # Authentication UI
│   ├── Onboarding.tsx          # 6-step profile creation
│   ├── Dashboard.tsx            # Progress visualization
│   ├── GoalsEditor.tsx          # Dynamic goals management
│   ├── HomeworkList.tsx         # Homework tracking
│   ├── TestsList.tsx            # Test management
│   ├── PeerChat.tsx             # Peer/teacher messaging
│   ├── Chat.tsx                 # AI mentor with alerts
│   ├── DailyCheckIn.tsx         # Daily progress tracker
│   ├── TeacherAlerts.tsx        # Alert display
│   └── TeacherReport.tsx        # Comprehensive reports
├── utils/
│   └── aiHelpers.ts             # AI prompting & analytics
├── types.ts                     # 15+ TypeScript interfaces
├── authTypes.ts                 # Authentication models
├── App.tsx                      # Main app with routing
└── vite.config.ts              # Build configuration
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone or navigate to the project**:
   ```bash
   cd student-mentor-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Key**:
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to `http://localhost:3000`

## 🎯 Usage Guide

### For Students

1. **Complete Onboarding**:
   - Fill in all 6 steps of profile creation
   - Be honest about challenges and goals
   - Add interests and aspirations

2. **Daily Check-In**:
   - Complete daily check-in to track progress
   - Log mood, sleep, study hours, and activities
   - Record achievements

3. **Chat with AI Mentor**:
   - Ask questions about studies
   - Seek career guidance
   - Discuss challenges and concerns
   - Get personalized study strategies

4. **Monitor Progress**:
   - View dashboard for insights
   - Track mood trends
   - Review study patterns
   - See activity history

### For Teachers/Parents

1. **Generate Reports**:
   - Click "Report" button in navigation
   - Review comprehensive student analysis
   - Download or print for records
   - Use recommendations for intervention

## 💡 Key Differentiators

### What Makes This MVP Advanced?

1. **Holistic Monitoring**: Unlike simple chatbots, tracks multiple dimensions of student life
2. **Adaptive AI**: Communication style adapts to age and maturity level
3. **Actionable Insights**: Generates specific, data-driven recommendations
4. **Multi-Stakeholder**: Serves students, teachers, and parents
5. **Privacy-Focused**: Data stored locally, confidential by design
6. **Career-Oriented**: Connects daily activities to long-term aspirations

## 🔧 Configuration Options

### Customizing AI Behavior

Edit `utils/aiHelpers.ts` to modify:
- Age-based communication styles
- System instruction templates
- Insight generation rules
- Mood analysis thresholds

### Styling

The app uses Tailwind CSS. Customize colors in:
- `index.css` for global styles
- Component-level className attributes

## 📊 Data Models

### StudentProfile
Complete student information including academics, aspirations, interests, sports, and challenges.

### DailyCheckIn
Daily tracking of mood, sleep, study hours, physical activity, and achievements.

### ActivityLog
Timestamped log of all student interactions and activities.

### TeacherReport
Comprehensive analysis with academic metrics, well-being assessment, and recommendations.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Cloud Run
Follow [Google Cloud Run deployment guide](https://cloud.google.com/run/docs/quickstarts/build-and-deploy)

## 🔐 Privacy & Security

- All data stored locally in browser
- No server-side storage of student information
- API keys secured via environment variables
- Conversations are private and encrypted in transit
- Teachers can only access reports generated by students

## 🎓 Use Cases

1. **Academic Support**: Help with homework, study strategies, exam preparation
2. **Career Guidance**: Advice on pursuing dream careers
3. **Mental Health**: Emotional support, stress management
4. **Time Management**: Balancing studies, sports, and personal life
5. **Goal Setting**: Breaking down aspirations into actionable steps
6. **Progress Tracking**: Monitoring growth across multiple dimensions

## 🤝 Contributing

This is a hackathon MVP. See "Upcoming Features" section below for planned enhancements.

## 🔮 Upcoming Features

### Phase 1 - Enhanced Communication
- [ ] **Group Study Rooms**: Create virtual study sessions with multiple students
- [ ] **Video/Voice Chat**: Real-time video calls with teachers and peers
- [ ] **Screen Sharing**: Share screens for collaborative problem-solving
- [ ] **File Attachments**: Send and receive study materials, notes, PDFs

### Phase 2 - Advanced Analytics
- [ ] **Predictive Performance**: AI predicts exam performance based on preparation
- [ ] **Learning Style Optimization**: Personalized study recommendations
- [ ] **Time Management AI**: Smart scheduling based on workload and deadlines
- [ ] **Comparison Analytics**: Anonymous peer performance benchmarking

### Phase 3 - Gamification & Rewards
- [ ] **Achievement Badges**: Earn badges for study streaks, goals, improvements
- [ ] **Leaderboards**: Friendly competition with classmates
- [ ] **XP System**: Gain experience points for completing tasks
- [ ] **Virtual Rewards**: Unlock themes, avatars, study tools

### Phase 4 - Parent/Guardian Features
- [ ] **Parent Dashboard**: View child's progress and well-being
- [ ] **Weekly Reports**: Automated summary emails
- [ ] **Concern Alerts**: Notifications for academic/mental health issues
- [ ] **Parent-Teacher Communication**: Direct messaging channel

### Phase 5 - School Integration
- [ ] **LMS Integration**: Connect with Canvas, Google Classroom, Moodle
- [ ] **Grade Sync**: Automatic grade import from school systems
- [ ] **Calendar Integration**: Sync with school calendars
- [ ] **Attendance Tracking**: Monitor and report attendance patterns

### Phase 6 - AI Enhancements
- [ ] **Study Plan Generator**: AI creates personalized study schedules
- [ ] **Doubt Solver**: AI explains concepts with step-by-step solutions
- [ ] **Practice Problem Generator**: Auto-generate practice questions
- [ ] **Essay Reviewer**: AI feedback on writing assignments
- [ ] **Voice AI Mentor**: Voice-based interactions for accessibility

### Phase 7 - Wellness Features
- [ ] **Meditation & Mindfulness**: Guided sessions for stress relief
- [ ] **Break Reminders**: Smart notifications to take study breaks
- [ ] **Sleep Tracker**: Monitor and optimize sleep patterns
- [ ] **Nutrition Tips**: Healthy eating advice for students
- [ ] **Exercise Challenges**: Physical fitness goals and tracking

### Phase 8 - Career Development
- [ ] **Career Aptitude Tests**: AI-powered career assessments
- [ ] **Industry Mentorship**: Connect with professionals in dream fields
- [ ] **College Planning**: Application guidance and deadlines
- [ ] **Skill Development Paths**: Curated learning tracks for career goals
- [ ] **Internship Finder**: Opportunities matching student interests

### Phase 9 - Content Library
- [ ] **Video Tutorials**: Recorded lessons for all subjects
- [ ] **Practice Tests**: Mock exams with detailed explanations
- [ ] **Study Notes**: Community-contributed study materials
- [ ] **Formula Sheets**: Quick reference guides
- [ ] **Past Papers**: Previous exam papers with solutions

### Phase 10 - Advanced Features
- [ ] **Multi-language Support**: Interface in student's native language
- [ ] **Offline Mode**: Access key features without internet
- [ ] **Mobile Apps**: Native iOS and Android applications
- [ ] **Smart Watch Integration**: Quick check-ins and reminders
- [ ] **AR Study Tools**: Augmented reality for interactive learning
- [ ] **Blockchain Certificates**: Verified achievement credentials
- [ ] **AI Tutor Network**: Connect with specialized AI tutors

### Phase 11 - Teacher Tools
- [ ] **Class Management**: Bulk homework and test assignments
- [ ] **Automated Grading**: AI-assisted assignment evaluation
- [ ] **Attendance Dashboard**: Visual attendance tracking
- [ ] **Performance Predictions**: Early warning system for at-risk students
- [ ] **Lesson Planning AI**: Curriculum suggestions and resources

### Phase 12 - Community Features
- [ ] **Study Groups**: Form groups based on subjects/interests
- [ ] **Peer Tutoring Marketplace**: Students help each other
- [ ] **Discussion Forums**: Subject-wise Q&A communities
- [ ] **Resource Sharing**: Exchange notes, summaries, tips
- [ ] **Event Calendar**: School events, deadlines, competitions

## 💭 Feature Suggestions

Have ideas for new features? We'd love to hear them! The system is designed to be extensible and can accommodate:

- **Custom Integrations**: Connect with your school's specific tools
- **Specialized Subjects**: Advanced courses, languages, vocational training
- **Regional Adaptations**: Country-specific curricula and exam boards
- **Accessibility Features**: Screen readers, dyslexia-friendly modes, etc.
- **Cultural Customization**: Respect local education systems and values

---

## 📝 License

This project is created for the Cloud Run Hackathon.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language model
- **React Team** for excellent framework
- **Vite** for fast development experience
- **Tailwind CSS** for beautiful styling

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Ensure API key is correctly configured
3. Verify all dependencies are installed
4. Check browser compatibility (modern browsers required)

---

**Built with ❤️ for empowering students and supporting their holistic development**

### 🌟 Why This System Matters

Traditional education focuses on grades, but student success requires:
- Mental well-being
- Physical health
- Social development
- Career preparation
- Personal growth

Student Mentor AI provides the comprehensive support system that students need to thrive in all these areas, while keeping teachers and parents informed.

---

**Ready to transform student mentoring? Start with `npm run dev`** 🚀