# 🎓 Student Mentor AI - Advanced MVP

An intelligent AI-powered personal mentor system that monitors and supports students holistically across academics, sports, mental health, and personal development. Built for the Cloud Run Hackathon.

## 🌟 Overview

Student Mentor AI is more than just a chatbot—it's a comprehensive personal guide that:

- **Monitors Daily Progress**: Tracks student behavior across studies, sports, mental health, and social activities
- **Provides Personalized Guidance**: Adapts communication style based on student's age, maturity level, and personality
- **Supports Career Aspirations**: Guides students toward their dream careers with targeted advice
- **Generates Teacher Reports**: Provides educators with detailed insights into student well-being and performance
- **Ensures Holistic Development**: Balances academic excellence with mental health and physical fitness

## 🚀 Key Features

### 1. **Comprehensive Onboarding** 📝
- Multi-step profile creation capturing:
  - Basic info (name, age, grade)
  - Academic subjects, goals, and learning style
  - Career aspirations and dream job
  - Interests and hobbies
  - Sports and physical activities
  - Academic and personal challenges
  - Mental health considerations

### 2. **Intelligent Dashboard** 📊
- Real-time progress visualization
- Mood trend analysis
- Study hours tracking
- Homework completion rates
- Stress level monitoring
- Recent activity feed
- Achievement highlights

### 3. **Daily Check-In System** ✅
- Track mood and emotional state
- Log sleep hours and energy levels
- Record study sessions and subjects
- Monitor physical activity
- Capture achievements and challenges
- Build historical data for insights

### 4. **Advanced AI Chat** 💬
- Context-aware conversations using Gemini 2.0 Flash
- Age-appropriate communication style
- Personalized responses based on:
  - Student profile (goals, challenges, interests)
  - Recent check-ins and mood patterns
  - Activity history
  - Career aspirations
- Real-time streaming responses
- Automatic activity logging
- Quick prompt suggestions

### 5. **Teacher Report Generation** 📄
- Comprehensive student progress reports
- Academic performance analysis
- Mental health and well-being assessment
- Physical activity tracking
- Behavioral insights
- Actionable recommendations
- Downloadable and printable reports

### 6. **Smart Activity Logging** 📝
- Automatic categorization of interactions
- Sentiment analysis
- Pattern detection
- Historical tracking

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for responsive design
- **Google Generative AI SDK** for Gemini integration

### Data Management
- LocalStorage for client-side persistence
- Comprehensive TypeScript interfaces
- Real-time state management
- Automatic data synchronization

### AI Integration
- **Gemini 2.0 Flash Experimental** model
- Dynamic system instruction generation
- Context-aware prompting
- Streaming responses for better UX

## 📁 Project Structure

```
student-mentor-ai/
├── components/
│   ├── Onboarding.tsx          # 6-step profile creation
│   ├── Dashboard.tsx            # Progress visualization
│   ├── Chat.tsx                 # AI mentor chat interface
│   ├── DailyCheckIn.tsx         # Daily progress tracker
│   └── TeacherReport.tsx        # Comprehensive reports
├── utils/
│   └── aiHelpers.ts             # AI prompting & analytics
├── types.ts                     # TypeScript interfaces
├── App.tsx                      # Main app with navigation
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

This is a hackathon MVP. Future enhancements could include:
- Multi-language support
- Parent/guardian dashboard
- Integration with school management systems
- Peer mentoring features
- Gamification and rewards
- Mobile app version
- AI-powered study plans
- Video/voice chat capabilities

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