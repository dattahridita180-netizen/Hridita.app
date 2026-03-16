import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  Home, 
  LayoutDashboard, 
  BookOpen, 
  TrendingUp, 
  Settings, 
  LogOut,
  ChevronRight,
  CheckCircle,
  ListTodo,
  CalendarDays,
  HeartPulse,
  Compass,
  AlertTriangle,
  History,
  Download,
  Printer,
  Zap,
  MessageSquare,
  Timer as TimerIcon,
  Code,
  Languages,
  Award,
  BookMarked,
  BrainCircuit,
  Calculator,
  Camera,
  LineChart,
  User,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MASTER_SYLLABUS } from './constants';
import { 
  generateStudyNote, 
  getAITutorResponse, 
  solveMathProblem,
  generateCQ,
  generateMCQ,
  generateFlashcards,
  generateQuiz,
  generateKaKha,
  analyzePerformance,
  predictVarsityChance,
  getCareerCounselling,
  generateAIPersonalizedRoutine,
  getCollegeQuestionPattern,
  generateSpecialExamNote,
  getBoardQuestions,
  getLanguageLabContent,
  startFeynmanTechnique,
  evaluateFeynmanExplanation,
  getPrivateTutorResponse
} from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { 
  LineChart as ReLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, language, setLanguage, onLogout }: any) => {
  const menuItems = [
    { id: 'home', icon: Home, label: language === 'en' ? 'Home' : 'হোম' },
    { id: 'dashboard', icon: LayoutDashboard, label: language === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড' },
    { id: 'subjects', icon: BookOpen, label: language === 'en' ? 'Subjects' : 'বিষয়সমূহ' },
    { id: 'tutor', icon: GraduationCap, label: language === 'en' ? 'Private Tutor' : 'প্রাইভেট টিউটর' },
    { id: 'feynman', icon: BrainCircuit, label: language === 'en' ? 'Feynman Technique' : 'ফাইনম্যান টেকনিক' },
    { id: 'languages', icon: Languages, label: language === 'en' ? 'Language Lab' : 'ল্যাঙ্গুয়েজ ল্যাব' },
    { id: 'qbank', icon: BookMarked, label: language === 'en' ? 'Question Bank' : 'প্রশ্ন ব্যাংক' },
    { id: 'coding', icon: Code, label: language === 'en' ? 'Coding Academy' : 'কোডিং একাডেমি' },
    { id: 'analysis', icon: TrendingUp, label: language === 'en' ? 'Varsity Analysis' : 'ভার্সিটি অ্যানালাইসিস' },
    { id: 'routine', icon: CalendarDays, label: language === 'en' ? 'AI Routine' : 'এআই রুটিন' },
    { id: 'counselling', icon: HeartPulse, label: language === 'en' ? 'AI Counselling' : 'এআই কাউন্সেলিং' },
    { id: 'settings', icon: Settings, label: language === 'en' ? 'Settings' : 'সেটিংস' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-sidebar transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-screen p-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="text-white w-6 h-6 fill-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Study<span className="text-blue-400">holic</span></h1>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-white/50 hover:text-white">
              <ChevronRight className="rotate-180" size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-white/10 text-white shadow-lg' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between px-4">
              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{language === 'en' ? 'Language' : 'ভাষা'}</span>
              <div className="flex bg-white/5 rounded-lg p-1">
                <button 
                  onClick={() => setLanguage('bn')}
                  className={`px-2 py-1 text-[10px] font-bold rounded ${language === 'bn' ? 'bg-blue-600 text-white' : 'text-white/50'}`}
                >
                  BN
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 text-[10px] font-bold rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'text-white/50'}`}
                >
                  EN
                </button>
              </div>
            </div>
            <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 text-white/50 hover:text-red-400 transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const SubjectCard = ({ name, color, onClick }: { name: string, color: string, onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.02, translateY: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="glass-card p-6 text-left group relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
      <BookOpen className="text-white" size={24} />
    </div>
    <h3 className="text-xl font-bold mb-2">{name}</h3>
    <p className="text-white/50 text-sm">Master your {name} syllabus with AI-powered notes and practice.</p>
    <div className="mt-4 flex items-center text-blue-400 text-sm font-semibold group-hover:gap-2 transition-all">
      Start Learning <ChevronRight size={16} />
    </div>
  </motion.button>
);

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4 text-white/50 uppercase tracking-widest text-xs font-bold">
        <TimerIcon size={14} /> Focus Timer
      </div>
      <div className="text-5xl font-mono font-bold mb-6 tracking-tighter">
        {formatTime(timeLeft)}
      </div>
      <div className="flex gap-3">
        <button 
          onClick={() => setIsActive(!isActive)}
          className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors font-semibold"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={() => { setTimeLeft(25 * 60); setIsActive(false); }}
          className="px-6 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-semibold"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

const AIChat = ({ language }: { language: string }) => {
  const [messages, setMessages] = useState<{role: string, text: string}[]>(() => {
    const saved = localStorage.getItem('sh_chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'ai', text: language === 'bn' ? 'পিকা! হ্যালো! আমি তোমার এআই স্টাডি বাডি। আজ আমরা কী পড়ব?' : 'Pika! Hello! I am your AI Study Buddy. What are we studying today?' }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('sh_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    
    try {
      const response = await getAITutorResponse(userMsg, "General chat", newMessages, language);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: language === 'bn' ? "পিকা... কিছু ভুল হয়েছে। আবার চেষ্টা করি!" : "Pika... something went wrong. Let's try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card flex flex-col h-[500px]">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs">P</div>
        <div>
          <h3 className="font-bold text-sm">Pikachu AI Tutor</h3>
          <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Online</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white/10 text-white/90 rounded-tl-none'
            }`}>
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {m.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="text-white/30 text-xs animate-pulse">Pikachu is thinking...</div>}
      </div>
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
        />
        <button 
          onClick={handleSend}
          className="p-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors"
        >
          <Zap size={20} />
        </button>
      </div>
    </div>
  );
};

const FloatingPikachu = ({ language }: { language: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>(() => {
    const saved = localStorage.getItem('sh_floating_chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'ai', text: language === 'bn' ? 'পিকা! আমি সবসময় সাহায্য করতে প্রস্তুত! তোমার পড়ালেখা নিয়ে যেকোনো কিছু জিজ্ঞাসা করো।' : 'Pika! I am always here to help! Ask me anything about your studies.' }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('sh_floating_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    
    try {
      const response = await getAITutorResponse(userMsg, "Floating chat", newMessages, language);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Pika... something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] max-w-[calc(100vw-48px)] glass-card flex flex-col h-[500px] shadow-2xl border-blue-500/30"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-yellow-400/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-lg shadow-yellow-400/20">P</div>
                <div>
                  <h3 className="font-bold text-sm">Pikachu AI Tutor</h3>
                  <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Active Now</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <ChevronRight className="rotate-90" size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
                  }`}>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {m.text}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && <div className="text-white/30 text-xs animate-pulse flex items-center gap-2">
                <div className="w-1 h-1 bg-white/30 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-white/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-white/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                Pikachu is thinking...
              </div>}
            </div>
            <div className="p-4 border-t border-white/10 flex gap-2">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Pikachu..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
              />
              <button 
                onClick={handleSend}
                className="p-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
              >
                <Zap size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-400/40 relative group"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#050505] rounded-full" />
        <Zap className="text-black w-8 h-8 fill-black" />
        <div className="absolute right-20 bg-white text-black px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Chat with Pikachu!
        </div>
      </motion.button>
    </div>
  );
};

// --- New Components ---

const TodoList = ({ todos, setTodos }: any) => {
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((t: any) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t: any) => t.id !== id));
  };

  return (
    <div className="glass-card p-6">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <ListTodo size={18} className="text-blue-400" /> Daily To-Do List
      </h3>
      <div className="flex gap-2 mb-4">
        <input 
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a task..." 
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
        />
        <button onClick={addTodo} className="p-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors">
          <Zap size={18} />
        </button>
      </div>
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
        {todos.map((todo: any) => (
          <div key={todo.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group">
            <button 
              onClick={() => toggleTodo(todo.id)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                todo.completed ? 'bg-green-500 border-green-500' : 'border-white/20'
              }`}
            >
              {todo.completed && <CheckCircle size={12} className="text-white" />}
            </button>
            <span className={`flex-1 text-sm ${todo.completed ? 'text-white/30 line-through' : 'text-white/80'}`}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
              <LogOut size={14} className="rotate-90" />
            </button>
          </div>
        ))}
        {todos.length === 0 && <p className="text-center text-white/20 text-xs py-4">No tasks for today. Add one!</p>}
      </div>
    </div>
  );
};

const Navigator = ({ warnings }: { warnings: string[] }) => {
  return (
    <AnimatePresence>
      {warnings.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed top-24 right-6 z-[90] w-72"
        >
          <div className="glass-card p-4 border-red-500/30 bg-red-500/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="text-red-400" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-red-400">Study Navigator</h4>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">Warning Message</p>
              </div>
            </div>
            <div className="space-y-2">
              {warnings.map((w, i) => (
                <p key={i} className="text-xs text-white/80 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
                  {w}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StudentID = ({ performance, user }: { performance: any, user: FirebaseUser | null }) => {
  const avatars = [
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', // Pikachu
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',  // Charmander
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',  // Bulbasaur
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',  // Squirtle
  ];
  
  const [avatarIndex, setAvatarIndex] = useState(0);

  return (
    <div className="glass-card p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16" />
      <div className="flex items-center gap-6">
        <div className="relative">
          <motion.div 
            key={avatarIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 p-2 border border-white/10"
          >
            <img 
              src={user?.photoURL || avatars[avatarIndex]} 
              alt="Avatar" 
              className="w-full h-full object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          {!user?.photoURL && (
            <button 
              onClick={() => setAvatarIndex((avatarIndex + 1) % avatars.length)}
              className="absolute -bottom-2 -right-2 p-1.5 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 transition-colors"
            >
              <User size={14} />
            </button>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{user?.displayName || 'Student'}</h3>
              <p className="text-white/50 text-xs font-mono uppercase tracking-widest">ID: SH-NEW-001</p>
            </div>
            <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
              New Student
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase">
              <span>XP Progress</span>
              <span>0 / 1000</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="w-[0%] h-full bg-gradient-to-r from-blue-500 to-purple-600" />
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-2">
            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <p className="text-[8px] text-white/30 uppercase font-bold">Strongest</p>
              <p className="text-xs font-bold text-emerald-400">{performance.strongest || 'N/A'}</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
              <p className="text-[8px] text-white/30 uppercase font-bold">Weakest</p>
              <p className="text-xs font-bold text-red-400">{performance.weakest || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpacedRepetition = () => {
  const schedules = [
    { day: 1, label: '1 Day Later', status: 'Due' },
    { day: 3, label: '3 Days Later', status: 'Upcoming' },
    { day: 7, label: '7 Days Later', status: 'Upcoming' },
    { day: 15, label: '15 Days Later', status: 'Upcoming' },
    { day: 30, label: '1 Month Later', status: 'Upcoming' },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <History size={18} className="text-purple-400" /> Spaced Repetition Schedule (Feynman)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {schedules.map((s, i) => (
          <div key={i} className={`p-4 rounded-xl border ${s.status === 'Due' ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/10 opacity-50'}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">{s.label}</p>
            <p className="text-sm font-bold">{s.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LandingPage = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-[#050505] overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-16">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20"
          >
            <Zap className="text-white w-12 h-12 fill-white" />
          </motion.div>
          <h1 className="text-6xl font-bold tracking-tighter">Welcome to <span className="gradient-text">Studyholic</span></h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">The ultimate AI-powered learning ecosystem designed specifically for HSC students in Bangladesh.</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogin}
            className="mt-8 px-8 py-4 bg-white text-black rounded-full font-bold text-lg shadow-xl shadow-white/10 hover:bg-gray-200 transition-colors flex items-center gap-3 mx-auto"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
            Sign in with Google
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-8 space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Zap className="text-yellow-400" size={24} /> Why Studyholic?
            </h3>
            <ul className="space-y-3 text-white/70">
              <li className="flex gap-3"><CheckCircle className="text-green-400 shrink-0" size={18} /> AI-Generated Study Notes & CQs</li>
              <li className="flex gap-3"><CheckCircle className="text-green-400 shrink-0" size={18} /> Personalized Study Routines</li>
              <li className="flex gap-3"><CheckCircle className="text-green-400 shrink-0" size={18} /> Varsity Chance Prediction (BUET, Medical)</li>
              <li className="flex gap-3"><CheckCircle className="text-green-400 shrink-0" size={18} /> Feynman Technique Integration</li>
            </ul>
          </div>
          <div className="glass-card p-8 space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Award className="text-blue-400" size={24} /> What Makes Us Special?
            </h3>
            <p className="text-white/70 leading-relaxed">
              Unlike other apps, Studyholic uses advanced AI to act as your personal tutor. It doesn't just give you notes; it asks you to explain concepts back (Feynman Technique) to ensure you've truly mastered the material.
            </p>
          </div>
        </div>

        <div className="glass-card p-10 text-center space-y-8 border-blue-500/30 bg-blue-500/5">
          <h2 className="text-3xl font-bold">Ready to transform your studies?</h2>
          <p className="text-white/50">Join thousands of students and start your journey to success today.</p>
          <button 
            onClick={onLogin}
            className="px-12 py-4 bg-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const LanguageLabTab = ({ language }: { language: string }) => {
  const [lang, setLang] = useState('English');
  const [type, setType] = useState<'speaking' | 'writing' | 'listening' | 'reading'>('speaking');
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await getLanguageLabContent(lang, type);
      setContent(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold gradient-text">AI Language Lab</h2>
          <p className="text-white/50">Master English and other languages with AI-powered sessions.</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none"
          >
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
            <option value="Japanese">Japanese</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {[
            { id: 'speaking', label: 'Speaking Session', icon: MessageSquare },
            { id: 'writing', label: 'Writing Practice', icon: BookOpen },
            { id: 'listening', label: 'Listening Lab', icon: HeartPulse },
            { id: 'reading', label: 'Reading Corner', icon: BookMarked },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setType(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${
                type === item.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              <item.icon size={20} />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full btn-primary mt-4"
          >
            {loading ? 'Generating...' : 'Start Session'}
          </button>
        </div>

        <div className="lg:col-span-3">
          {content ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 prose prose-invert max-w-none"
            >
              <ReactMarkdown>{content}</ReactMarkdown>
            </motion.div>
          ) : (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center text-white/30">
              <Languages size={48} className="mb-4 opacity-20" />
              <p>Select a session type and click "Start Session" to begin your language journey.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeynmanTab = ({ language }: { language: string }) => {
  const [topic, setTopic] = useState('');
  const [aiQuestion, setAiQuestion] = useState<string | null>(null);
  const [explanation, setExplanation] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await startFeynmanTechnique(topic, language);
      setAiQuestion(res);
      setFeedback(null);
      setExplanation('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const res = await evaluateFeynmanExplanation(topic, explanation, language);
      setFeedback(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold gradient-text">Feynman Technique</h2>
        <p className="text-white/50">The best way to learn is to teach. Explain a topic to our AI student.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <label className="text-xs font-bold text-white/30 uppercase tracking-widest block">What topic do you want to master?</label>
            <div className="flex gap-2">
              <input 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Quantum Mechanics, Photosynthesis..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
              />
              <button 
                onClick={handleStart}
                disabled={loading || !topic}
                className="btn-primary"
              >
                {loading ? '...' : 'Start'}
              </button>
            </div>
          </div>

          {aiQuestion && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 border-yellow-400/30 bg-yellow-400/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs">AI</div>
                <h4 className="font-bold text-sm">AI Student says:</h4>
              </div>
              <p className="text-white/80 italic">"{aiQuestion}"</p>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          {aiQuestion && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 space-y-4"
            >
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest block">Your Explanation (Explain like I'm 5)</label>
              <textarea 
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                rows={6}
                placeholder="Type your explanation here..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
              />
              <button 
                onClick={handleEvaluate}
                disabled={loading || !explanation}
                className="w-full btn-primary"
              >
                {loading ? 'Evaluating...' : 'Submit Explanation'}
              </button>
            </motion.div>
          )}

          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border-green-500/30 bg-green-500/5 prose prose-invert max-w-none"
            >
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-green-400" size={20} />
                <h4 className="font-bold text-sm m-0">Tutor Feedback</h4>
              </div>
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const PrivateTutorTab = ({ language }: { language: string }) => {
  const [messages, setMessages] = useState<{role: string, text: string}[]>(() => {
    const saved = localStorage.getItem('sh_tutor_chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'ai', text: language === 'bn' ? 'পিকা! আমি মাস্টার পিকা। আমি তোমাকে ধাপে ধাপে শিখাব। আজ আমরা কোন টপিক দিয়ে শুরু করব?' : 'Pika! I am Master Pika. I will teach you step-by-step. What topic should we start with today?' }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('sh_tutor_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    
    try {
      const response = await getPrivateTutorResponse(userMsg, newMessages, language);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: language === 'bn' ? "পিকা... কানেকশন হারিয়ে গেছে। আবার চেষ্টা করি!" : "Pika... I lost my connection. Let's try that again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 h-[calc(100vh-200px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Private AI Tutor</h2>
          <p className="text-white/50">Step-by-step learning with Master Pika.</p>
        </div>
        <button 
          onClick={() => {
            if(confirm('Clear chat history?')) {
              setMessages([{ role: 'ai', text: 'Pika! Let\'s start fresh. What topic should we start with today?' }]);
            }
          }}
          className="p-2 bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 rounded-lg transition-all"
        >
          <History size={20} />
        </button>
      </div>

      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === 'user' ? 'bg-blue-600' : 'bg-yellow-400 text-black'
                }`}>
                  {m.role === 'user' ? <User size={16} /> : <GraduationCap size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5 shadow-xl'
                }`}>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {m.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black animate-bounce">
                  <GraduationCap size={16} />
                </div>
                <div className="text-white/30 text-xs animate-pulse">Master Pika is explaining...</div>
              </div>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex gap-3">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Tell me what you want to learn..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-4 bg-blue-600 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              <Zap size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionBankTab = ({ language }: { language: string }) => {
  const categories = [
    { title: 'HSC Board Questions', count: '500+', icon: BookMarked, color: 'text-blue-400' },
    { title: 'Top College Tests', count: '1200+', icon: Award, color: 'text-purple-400' },
    { title: 'Medical Admission', count: '300+', icon: BrainCircuit, color: 'text-red-400' },
    { title: 'Engineering Admission', count: '450+', icon: Code, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold gradient-text">Question Bank</h2>
        <p className="text-white/50">Access thousands of previous year questions and model tests.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <div key={i} className="glass-card p-6 hover:bg-white/5 transition-all cursor-pointer">
            <cat.icon className={`${cat.color} mb-4`} size={28} />
            <h3 className="font-bold mb-1">{cat.title}</h3>
            <p className="text-xs text-white/30">{cat.count} Questions</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="font-bold mb-4">Recent Question Papers</h3>
        <div className="space-y-3">
          {[
            'Dhaka Board 2023 - Physics 1st Paper',
            'Rajshahi Board 2023 - Chemistry 2nd Paper',
            'BUET Admission Test 2022-23',
            'Medical Admission Test 2023',
          ].map((paper, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-sm">{paper}</span>
              <button className="text-xs font-bold text-blue-400">View PDF</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const ProgressChart = () => {
  const data = [
    { name: 'Sat', hours: 4 },
    { name: 'Sun', hours: 6 },
    { name: 'Mon', hours: 3 },
    { name: 'Tue', hours: 8 },
    { name: 'Wed', hours: 5 },
    { name: 'Thu', hours: 7 },
    { name: 'Fri', hours: 2 },
  ];

  return (
    <div className="glass-card p-6 h-[300px]">
      <h3 className="font-bold mb-6 flex items-center gap-2">
        <LineChart size={18} className="text-blue-400" /> Study Activity
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff20', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const CounsellingTab = ({ performance, language }: any) => {
  const [passion, setPassion] = useState('');
  const [hobby, setHobby] = useState('');
  const [mood, setMood] = useState('Happy');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCounselling = async () => {
    setLoading(true);
    try {
      const res = await getCareerCounselling({ passion, hobby, mood, performance }, language);
      setAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold gradient-text">AI Career Counselling</h2>
        <p className="text-white/50">Discover your path based on your passion, mood, and performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 block">Your Passion</label>
              <input 
                value={passion}
                onChange={e => setPassion(e.target.value)}
                placeholder="e.g. Physics, Art, Coding..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 block">Your Hobby</label>
              <input 
                value={hobby}
                onChange={e => setHobby(e.target.value)}
                placeholder="e.g. Reading, Gaming, Sports..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 block">Current Mood</label>
              <select 
                value={mood}
                onChange={e => setMood(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 appearance-none"
              >
                <option value="Happy">Happy</option>
                <option value="Stressed">Stressed</option>
                <option value="Lazy">Lazy</option>
                <option value="Motivated">Motivated</option>
                <option value="Tired">Tired</option>
              </select>
            </div>
            <button 
              onClick={handleCounselling}
              disabled={loading || !passion || !hobby}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Get AI Guidance'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {analysis ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 prose prose-invert max-w-none"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <Compass className="text-blue-400" />
                <h3 className="text-xl font-bold m-0">AI Career Roadmap</h3>
              </div>
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </motion.div>
          ) : (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center text-white/30">
              <Compass size={48} className="mb-4 opacity-20" />
              <p>Fill in your details to receive personalized career and academic guidance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RoutineTab = ({ examDate, setExamDate, performance, language }: any) => {
  const [dailyHours, setDailyHours] = useState('6');
  const [routine, setRoutine] = useState<string | null>(localStorage.getItem('sh_routine'));
  const [loading, setLoading] = useState(false);

  const handleGenerateRoutine = async () => {
    setLoading(true);
    try {
      const res = await generateAIPersonalizedRoutine(examDate, performance.scores, dailyHours, language);
      setRoutine(res);
      localStorage.setItem('sh_routine', res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold gradient-text">AI Study Routine</h2>
        <p className="text-white/50">Personalized plans based on your exam date and current progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 block">Exam Date</label>
              <input 
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 block">Daily Study Commitment (Hours)</label>
              <input 
                type="number"
                value={dailyHours}
                onChange={e => setDailyHours(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <button 
              onClick={handleGenerateRoutine}
              disabled={loading || !examDate}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Create My Routine'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {routine ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 prose prose-invert max-w-none"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <CalendarDays className="text-blue-400" />
                <h3 className="text-xl font-bold m-0">Your Personalized Routine</h3>
              </div>
              <ReactMarkdown>{routine}</ReactMarkdown>
            </motion.div>
          ) : (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center text-white/30">
              <CalendarDays size={48} className="mb-4 opacity-20" />
              <p>Set your exam date and daily hours to generate a custom study plan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VarsityAnalysisTab = ({ performance, language }: any) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async () => {
    setLoading(true);
    try {
      const res = await predictVarsityChance(performance, language);
      setAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Varsity Chance Analysis</h2>
          <p className="text-white/50">AI-powered prediction for BUET, Medical, and top Universities.</p>
        </div>
        <button 
          onClick={handleAnalysis}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Analyzing...' : 'Refresh Analysis'}
        </button>
      </div>

      {analysis ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 prose prose-invert max-w-none"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <TrendingUp className="text-blue-400" />
            <h3 className="text-xl font-bold m-0">Admission Probability Report</h3>
          </div>
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </motion.div>
      ) : (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center text-white/30">
          <TrendingUp size={48} className="mb-4 opacity-20" />
          <p>Click "Refresh Analysis" to see your admission chances based on current performance.</p>
        </div>
      )}
    </div>
  );
};
const QuickAccessCard = ({ title, desc, icon: Icon, color, onClick }: any) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="glass-card p-6 text-left group relative overflow-hidden border-white/10 hover:border-white/20 transition-all"
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
      <Icon className="text-white" size={24} />
    </div>
    <h3 className="text-lg font-bold mb-1">{title}</h3>
    <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-400">
      Explore Now <ChevronRight size={14} />
    </div>
  </motion.button>
);

const CodingTab = () => {
  const courses = [
    { title: 'Python for Beginners', level: 'Easy', duration: '12h', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { title: 'C Programming Masterclass', level: 'Medium', duration: '20h', icon: Code, color: 'from-emerald-500 to-teal-500' },
    { title: 'Web Development (HTML/CSS)', level: 'Easy', duration: '15h', icon: LayoutDashboard, color: 'from-orange-500 to-red-500' },
    { title: 'Data Structures with Java', level: 'Hard', duration: '30h', icon: BrainCircuit, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Coding Academy</h2>
          <p className="text-white/50">Master the languages of the future with structured courses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course, i) => (
          <div key={i} className="glass-card p-6 group cursor-pointer hover:bg-white/5 transition-all">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-4 shadow-lg`}>
              <course.icon className="text-white" size={24} />
            </div>
            <h3 className="font-bold mb-1">{course.title}</h3>
            <div className="flex items-center gap-3 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <span>{course.level}</span>
              <span>•</span>
              <span>{course.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'bn'>(localStorage.getItem('sh_lang') as any || 'en');
  const [showLanding, setShowLanding] = useState(!localStorage.getItem('sh_visited'));
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [cq, setCq] = useState<string | null>(null);
  const [mcq, setMcq] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<string | null>(null);
  const [contentTab, setContentTab] = useState('note');
  const [customTopic, setCustomTopic] = useState('');
  const [loadingNote, setLoadingNote] = useState(false);
  const [todos, setTodos] = useState<any[]>(() => {
    const saved = localStorage.getItem('sh_todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [performance, setPerformance] = useState({
    strongest: '-',
    weakest: '-',
    scores: { Physics: 0, Chemistry: 0, Math: 0, Biology: 0, ICT: 0, Bangla: 0, English: 0 }
  });
  const [warnings, setWarnings] = useState<string[]>([]);
  const [kaKha, setKaKha] = useState<string | null>(null);
  const [collegePattern, setCollegePattern] = useState<string | null>(null);
  const [routine, setRoutine] = useState<string | null>(localStorage.getItem('sh_routine'));
  const [examDate, setExamDate] = useState(localStorage.getItem('sh_exam_date') || '');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) {
        setShowLanding(true);
      } else {
        setShowLanding(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      localStorage.setItem('sh_visited', 'true');
      setShowLanding(false);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    localStorage.setItem('sh_todos', JSON.stringify(todos));
    
    // Check for incomplete tasks to show warnings
    const incomplete = todos.filter(t => !t.completed);
    if (incomplete.length > 3) {
      setWarnings(['You have many incomplete tasks! Please finish them to maintain your routine.']);
    } else {
      setWarnings([]);
    }
  }, [todos]);

  useEffect(() => {
    if (examDate) localStorage.setItem('sh_exam_date', examDate);
  }, [examDate]);

  const subjects = [
    { name: 'Physics', color: 'from-blue-500 to-cyan-500' },
    { name: 'Chemistry', color: 'from-emerald-500 to-teal-500' },
    { name: 'Higher Math', color: 'from-purple-500 to-pink-500' },
    { name: 'Biology', color: 'from-orange-500 to-red-500' },
    { name: 'ICT', color: 'from-indigo-500 to-blue-500' },
    { name: 'Bangla', color: 'from-yellow-500 to-orange-500' },
    { name: 'English', color: 'from-sky-500 to-indigo-500' },
  ];

  const handleGenerateNote = async (topic: string) => {
    if (!selectedSubject || !selectedChapter || !topic) return;
    setLoadingNote(true);
    setContentTab('note');
    
    // Scroll to content area on mobile
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }

    try {
      const [noteRes, cqRes, mcqRes, flashRes, quizRes, kaKhaRes] = await Promise.all([
        generateStudyNote(selectedSubject, selectedChapter, topic, language),
        generateCQ(selectedSubject, selectedChapter, topic, language),
        generateMCQ(selectedSubject, selectedChapter, topic, language),
        generateFlashcards(selectedSubject, selectedChapter, topic, language),
        generateQuiz(selectedSubject, selectedChapter, topic, language),
        generateKaKha(selectedSubject, selectedChapter, language)
      ]);
      setNote(noteRes);
      setCq(cqRes);
      setMcq(mcqRes);
      setFlashcards(flashRes);
      setQuiz(quizRes);
      setKaKha(kaKhaRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNote(false);
    }
  };

  const handleStartApp = () => {
    localStorage.setItem('sh_visited', 'true');
    setShowLanding(false);
  };

  useEffect(() => {
    localStorage.setItem('sh_lang', language);
  }, [language]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      {authLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <AnimatePresence>
            {showLanding && <LandingPage onLogin={handleLogin} />}
          </AnimatePresence>

          <div className="flex">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              isOpen={isSidebarOpen} 
              setIsOpen={setIsSidebarOpen}
              language={language}
              setLanguage={setLanguage}
              onLogout={handleLogout}
            />

      <Navigator warnings={warnings} />
      
      <main className="flex-1 p-4 sm:p-8 lg:p-12 relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white/5 rounded-xl border border-white/10"
          >
            <Zap className="text-blue-400" size={24} />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Study<span className="text-blue-400">holic</span></h1>
          <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden">
            <img src={user?.photoURL || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"} alt="User" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>

        <header className="hidden lg:flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, <span className="gradient-text">{user?.displayName || 'Student'}</span>!</h2>
            <p className="text-white/50">You've completed 0% of your weekly goal. Keep it up!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">Level 1</p>
              <div className="w-32 h-2 bg-white/10 rounded-full mt-1 overflow-hidden">
                <div className="w-[0%] h-full bg-blue-500" />
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5">
              <img 
                src={user?.photoURL || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-8">
                <StudentID performance={performance} user={user} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <QuickAccessCard 
                    title="Coding Courses" 
                    desc="Learn Python, C, Web Dev and more with mobile-friendly practice."
                    icon={Code}
                    color="from-blue-500 to-purple-600"
                    onClick={() => setActiveTab('coding')}
                  />
                  <QuickAccessCard 
                    title="Language Learning" 
                    desc="Master English, French, Japanese and more with AI partners."
                    icon={Languages}
                    color="from-emerald-500 to-teal-500"
                    onClick={() => setActiveTab('languages')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <TodoList todos={todos} setTodos={setTodos} />
                  <div className="space-y-6">
                    <div className="glass-card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Award className="text-yellow-400" />
                        <h4 className="font-bold">Daily Streak</h4>
                      </div>
                      <p className="text-3xl font-bold">0 Days</p>
                      <p className="text-white/50 text-sm mt-1">Start learning to build a streak!</p>
                    </div>
                    <div className="glass-card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <BookMarked className="text-blue-400" />
                        <h4 className="font-bold">Topics Mastered</h4>
                      </div>
                      <p className="text-3xl font-bold">48 / 120</p>
                      <p className="text-white/50 text-sm mt-1">8 new topics this week</p>
                    </div>
                  </div>
                </div>

                <ProgressChart />
              </div>

              <div className="space-y-8">
                <PomodoroTimer />
                <div className="hidden lg:block">
                  <AIChat language={language} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'subjects' && (
            <motion.div 
              key="subjects"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {!selectedSubject ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map((sub) => (
                    <SubjectCard 
                      key={sub.name} 
                      name={sub.name} 
                      color={sub.color} 
                      onClick={() => setSelectedSubject(sub.name)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  <button 
                    onClick={() => { setSelectedSubject(null); setSelectedChapter(null); setNote(null); }}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                  >
                    <ChevronRight className="rotate-180" size={16} /> Back to Subjects
                  </button>
                  
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-1/3 space-y-4">
                      <h3 className="text-2xl font-bold gradient-text">{selectedSubject}</h3>
                      
                      <div className="glass-card p-4 space-y-2 max-h-[400px] lg:max-h-[600px] overflow-y-auto">
                        {Object.entries((MASTER_SYLLABUS as any)[selectedSubject] || {}).map(([paper, chapters]: [string, any]) => (
                          <div key={paper}>
                            <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 px-2">{paper}</h4>
                            {Object.entries(chapters).map(([chapter, topics]: [string, any]) => (
                              <div key={chapter} className="mb-4">
                                <div className="flex items-center justify-between gap-2">
                                  <button 
                                    onClick={() => setSelectedChapter(chapter)}
                                    className={`flex-1 text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                                      selectedChapter === chapter ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5'
                                    }`}
                                  >
                                    {chapter}
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      setSelectedChapter(chapter);
                                      setLoadingNote(true);
                                      setContentTab('kakha');
                                      const res = await generateKaKha(selectedSubject, chapter, language);
                                      setKaKha(res);
                                      setLoadingNote(false);
                                    }}
                                    className="p-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
                                    title="Generate Ka/Kha Questions"
                                  >
                                    <MessageSquare size={14} />
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      setSelectedChapter(chapter);
                                      setLoadingNote(true);
                                      setContentTab('college');
                                      const res = await getCollegeQuestionPattern("Top Colleges", selectedSubject);
                                      setCollegePattern(res);
                                      setLoadingNote(false);
                                    }}
                                    className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-colors"
                                    title="College Question Pattern"
                                  >
                                    <Compass size={14} />
                                  </button>
                                </div>
                                {selectedChapter === chapter && (
                                  <div className="ml-4 mt-2 space-y-3 border-l border-white/10 pl-4">
                                    {/* Custom Topic Input for this Chapter */}
                                    <div className="flex gap-2 mb-4">
                                      <input 
                                        value={customTopic}
                                        onChange={(e) => setCustomTopic(e.target.value)}
                                        placeholder="Specific topic..." 
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] focus:outline-none focus:border-blue-500/50"
                                      />
                                      <button 
                                        onClick={() => handleGenerateNote(customTopic)}
                                        disabled={!customTopic || loadingNote}
                                        className="p-1.5 bg-blue-600 rounded-lg disabled:opacity-50"
                                      >
                                        <Zap size={12} />
                                      </button>
                                    </div>

                                    {topics.map((topic: string) => (
                                      <button 
                                        key={topic}
                                        onClick={() => {
                                          setSelectedChapter(chapter);
                                          handleGenerateNote(topic);
                                        }}
                                        className="w-full text-left py-1 text-xs text-white/50 hover:text-white transition-colors"
                                      >
                                        {topic}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1">
                      {loadingNote ? (
                        <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-6">
                          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                          <div>
                            <h4 className="text-xl font-bold">AI is generating your note...</h4>
                            <p className="text-white/50">This will take about 10-15 seconds.</p>
                          </div>
                        </div>
                      ) : note ? (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-6"
                        >
                          {/* Content Tabs */}
                          <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                            {[
                              { id: 'note', label: 'Study Note', icon: BookOpen },
                              { id: 'kakha', label: 'Ka/Kha Qs', icon: MessageSquare },
                              { id: 'college', label: 'College Pattern', icon: Compass },
                              { id: 'cq', label: 'Creative (CQ)', icon: Award },
                              { id: 'mcq', label: 'MCQs', icon: Calculator },
                              { id: 'quiz', label: 'Mock Test', icon: TimerIcon },
                              { id: 'flash', label: 'Flashcards', icon: Zap },
                            ].map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() => setContentTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                  contentTab === tab.id 
                                    ? 'bg-blue-600 text-white shadow-lg' 
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <tab.icon size={14} />
                                {tab.label}
                              </button>
                            ))}
                          </div>

                          <div className="glass-card p-4 sm:p-8 prose prose-invert max-w-none">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-white/10 gap-4">
                              <div>
                                <h3 className="text-2xl font-bold m-0">{selectedChapter}</h3>
                                <p className="text-white/50 m-0">
                                  {contentTab === 'note' && 'Study Note'}
                                  {contentTab === 'kakha' && 'Ka & Kha Questions'}
                                  {contentTab === 'college' && 'College Question Pattern'}
                                  {contentTab === 'cq' && 'Creative Questions'}
                                  {contentTab === 'mcq' && 'Multiple Choice Questions'}
                                  {contentTab === 'quiz' && 'Mock Test / Quiz'}
                                  {contentTab === 'flash' && 'Flashcards'}
                                  • Generated by AI
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                <button 
                                  onClick={() => window.print()}
                                  className="flex-1 sm:flex-none px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors"
                                >
                                  Download PDF
                                </button>
                                <button 
                                  onClick={() => setActiveTab('tutor')}
                                  className="flex-1 sm:flex-none px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                >
                                  <GraduationCap size={16} />
                                  Ask Tutor
                                </button>
                              </div>
                            </div>
                            <div className="markdown-body overflow-x-auto">
                              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {contentTab === 'note' ? note : 
                                 contentTab === 'kakha' ? kaKha :
                                 contentTab === 'college' ? collegePattern :
                                 contentTab === 'cq' ? cq :
                                 contentTab === 'mcq' ? mcq :
                                 contentTab === 'quiz' ? quiz :
                                 flashcards}
                              </ReactMarkdown>
                            </div>

                            <div className="mt-12 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                              <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="text-red-400" />
                                <h4 className="font-bold text-red-400">Mandatory Daily Practice</h4>
                              </div>
                              <p className="text-sm text-white/70 mb-6">You must complete at least one MCQ set and one Quiz for this topic today to maintain your streak!</p>
                              <div className="flex flex-wrap gap-3">
                                <button onClick={() => setContentTab('mcq')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/10 transition-colors">Practice MCQs</button>
                                <button onClick={() => setContentTab('quiz')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/10 transition-colors">Take Mock Test</button>
                                <button onClick={() => setContentTab('cq')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/10 transition-colors">Solve CQs</button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="glass-card p-12 flex flex-col items-center justify-center text-center text-white/30">
                          <BookOpen size={48} className="mb-4 opacity-20" />
                          <p>Select a topic from the sidebar to generate a comprehensive study note.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analysis' && (
            <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VarsityAnalysisTab performance={performance} />
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div 
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                  <h4 className="text-white/50 text-sm font-bold uppercase mb-2">Total Study Time</h4>
                  <p className="text-4xl font-bold">0h</p>
                  <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                    <TrendingUp size={14} /> Start studying!
                  </p>
                </div>
                <div className="glass-card p-6">
                  <h4 className="text-white/50 text-sm font-bold uppercase mb-2">Quiz Accuracy</h4>
                  <p className="text-4xl font-bold">0%</p>
                  <p className="text-blue-400 text-sm mt-2">Take quizzes to see accuracy</p>
                </div>
                <div className="glass-card p-6">
                  <h4 className="text-white/50 text-sm font-bold uppercase mb-2">Global Rank</h4>
                  <p className="text-4xl font-bold">Unranked</p>
                  <p className="text-purple-400 text-sm mt-2">Complete tasks to rank up</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ProgressChart />
                <div className="glass-card p-6">
                  <h3 className="font-bold mb-6">Subject Proficiency</h3>
                  <div className="space-y-6">
                    {subjects.slice(0, 4).map(s => (
                      <div key={s.name}>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{s.name}</span>
                          <span className="text-white/50">85%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${s.color}`} style={{ width: '85%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'coding' && <CodingTab />}
          {activeTab === 'languages' && <LanguageLabTab language={language} />}
          {activeTab === 'feynman' && <FeynmanTab language={language} />}
          {activeTab === 'tutor' && <PrivateTutorTab language={language} />}
          {activeTab === 'qbank' && <QuestionBankTab language={language} />}
          {activeTab === 'analysis' && <VarsityAnalysisTab performance={performance} language={language} />}

          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Study Time', value: '0h', color: 'text-blue-400' },
                  { label: 'Notes Generated', value: '0', color: 'text-purple-400' },
                  { label: 'Streak', value: '0 Days', color: 'text-orange-400' },
                  { label: 'XP Points', value: '0', color: 'text-emerald-400' },
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-4">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                  <h3 className="font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { action: 'Generated Physics Note', time: '2 hours ago', icon: BookOpen },
                      { action: 'Completed Pomodoro Session', time: '4 hours ago', icon: TimerIcon },
                      { action: 'Updated Daily Journal', time: 'Yesterday', icon: MessageSquare },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <item.icon size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.action}</p>
                          <p className="text-xs text-white/30">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <ProgressChart />
                <SpacedRepetition />
              </div>
            </motion.div>
          )}

          {activeTab === 'routine' && (
            <motion.div key="routine" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <RoutineTab examDate={examDate} setExamDate={setExamDate} performance={performance} language={language} />
            </motion.div>
          )}

          {activeTab === 'counselling' && (
            <motion.div key="counselling" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CounsellingTab performance={performance} language={language} />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold mb-6">Profile Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-blue-500/20 border border-white/10 flex items-center justify-center overflow-hidden">
                      <img src={user?.photoURL || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"} alt="Avatar" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">Change Avatar</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/30 uppercase">Display Name</label>
                      <input defaultValue={user?.displayName || "Student"} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/30 uppercase">Email</label>
                      <input defaultValue={user?.email || "student@studyholic.com"} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm" disabled />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold mb-6">App Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Dark Mode', desc: 'Always on for better focus', active: true },
                    { label: 'AI Assistance', desc: 'Pikachu chatbot availability', active: true },
                    { label: 'Notifications', desc: 'Daily study reminders', active: false },
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div>
                        <p className="font-bold text-sm">{pref.label}</p>
                        <p className="text-xs text-white/30">{pref.desc}</p>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${pref.active ? 'bg-blue-600' : 'bg-white/10'}`}>
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${pref.active ? 'right-1' : 'left-1'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tools' && (
            <motion.div 
              key="tools"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { icon: Calculator, label: 'Unit Converter', desc: 'Quickly convert between different units for Physics and Chemistry.', color: 'text-blue-400' },
                { icon: Camera, label: 'Error Bank', desc: 'Scan and save difficult problems to revise later.', color: 'text-purple-400' },
                { icon: Code, label: 'Coding Sandbox', desc: 'Practice C, Python, and HTML for your ICT syllabus.', color: 'text-emerald-400' },
                { icon: Languages, label: 'IELTS Prep', desc: 'Improve your English speaking and listening skills with AI.', color: 'text-orange-400' },
              ].map((tool, i) => (
                <div key={i} className="glass-card p-6 hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors" />
                  <tool.icon className={`${tool.color} mb-4`} size={32} />
                  <h3 className="text-xl font-bold mb-2">{tool.label}</h3>
                  <p className="text-white/50 text-sm">{tool.desc}</p>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Coming Soon</span>
                    <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-20 pt-8 border-t border-white/10 text-center text-white/30 text-sm">
          <p className="font-bold text-white/50 mb-1">Made by Hridita Datta</p>
          <p>© 2026 Studyholic • Version 2.1.0</p>
        </footer>
      </main>
      </div>

      <FloatingPikachu language={language} />
      </>
      )}
    </div>
  );
}
