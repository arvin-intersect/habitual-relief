import { Timer, Music, BookOpen, Lightbulb, Trophy, Sparkles, Target, Flame } from "lucide-react";
import { Card } from "./ui/card";

const activities = [
  {
    icon: Timer,
    title: "Pomodoro Power",
    description: "Stay focused with 25-minute work intervals",
    reward: "Earn Focus Flames",
    color: "bg-orange-100",
    iconColor: "text-orange-600",
    accentColor: "border-orange-200",
    emoji: "🍅"
  },
  {
    icon: Music,
    title: "Mindful Melodies",
    description: "Curated playlists to enhance concentration",
    reward: "Unlock Sound Badges",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    accentColor: "border-purple-200",
    emoji: "🎵"
  },
  {
    icon: BookOpen,
    title: "Reading Rituals",
    description: "Replace scrolling with meaningful reading time",
    reward: "Collect Book Marks",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    accentColor: "border-blue-200",
    emoji: "📚"
  },
  {
    icon: Lightbulb,
    title: "Creative Challenges",
    description: "Daily prompts to spark your imagination",
    reward: "Gain Idea Sparks",
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
    accentColor: "border-yellow-200",
    emoji: "💡"
  },
  {
    icon: Target,
    title: "Goal Streaks",
    description: "Set daily targets and build consistency",
    reward: "Extend Your Streak",
    color: "bg-green-100",
    iconColor: "text-green-600",
    accentColor: "border-green-200",
    emoji: "🎯"
  },
  {
    icon: Flame,
    title: "Screen-Free Zones",
    description: "Designate digital detox periods each day",
    reward: "Build Energy Points",
    color: "bg-red-100",
    iconColor: "text-red-600",
    accentColor: "border-red-200",
    emoji: "🔥"
  },
  {
    icon: Sparkles,
    title: "Gratitude Journal",
    description: "Reflect on positive moments daily",
    reward: "Unlock Peace Stars",
    color: "bg-pink-100",
    iconColor: "text-pink-600",
    accentColor: "border-pink-200",
    emoji: "✨"
  },
  {
    icon: Trophy,
    title: "Weekly Wins",
    description: "Celebrate your progress with achievements",
    reward: "Earn Champion Crowns",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
    accentColor: "border-amber-200",
    emoji: "🏆"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-orange-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-blue-200 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block">
            <span className="text-4xl mb-4 block">🎮</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-light text-slate-900">
            Turn Screen Time into Me Time
          </h2>
          <p className="text-lg md:text-xl font-sans text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Track your digital habits, complete fun activities, and earn rewards while building a healthier relationship with technology
          </p>
        </div>

        {/* How it Works - Simple Flow */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-20 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 bg-white rounded-2xl px-8 py-4 shadow-lg border-2 border-slate-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
              📱
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Track</h3>
              <p className="text-sm text-slate-600">Monitor screen time</p>
            </div>
          </div>
          
          <div className="hidden md:block text-3xl text-slate-400">→</div>
          
          <div className="flex items-center gap-4 bg-white rounded-2xl px-8 py-4 shadow-lg border-2 border-slate-200">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
              ✅
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Complete</h3>
              <p className="text-sm text-slate-600">Do fun activities</p>
            </div>
          </div>
          
          <div className="hidden md:block text-3xl text-slate-400">→</div>
          
          <div className="flex items-center gap-4 bg-white rounded-2xl px-8 py-4 shadow-lg border-2 border-slate-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl">
              🏅
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Earn</h3>
              <p className="text-sm text-slate-600">Collect rewards</p>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {activities.map((activity, index) => (
            <Card 
              key={index} 
              className={`relative p-6 ${activity.color} border-2 ${activity.accentColor} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group rounded-3xl overflow-hidden`}
            >
              {/* Decorative corner emoji */}
              <div className="absolute top-4 right-4 text-3xl opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                {activity.emoji}
              </div>

              <div className="space-y-4">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${activity.color} border-2 ${activity.accentColor} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                  <activity.icon className={`w-8 h-8 ${activity.iconColor}`} strokeWidth={2.5} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {activity.title}
                  </h3>
                  <p className="font-sans text-sm text-slate-700 leading-relaxed mb-3">
                    {activity.description}
                  </p>
                  
                  {/* Reward Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200">
                    <Sparkles className={`w-4 h-4 ${activity.iconColor}`} />
                    <span className="text-xs font-semibold text-slate-700">
                      {activity.reward}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-white rounded-3xl px-10 py-6 shadow-2xl border-2 border-orange-200">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🎯</span>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Start Your Journey Today</h3>
                <p className="text-sm text-slate-600">Join thousands building better digital habits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
