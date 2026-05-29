'use client';

import { motion } from 'framer-motion';
import { Users, Calendar, MapPin, Briefcase, GraduationCap, Heart, Search, Filter, ArrowRight, UserPlus, CheckCircle2, Globe, Clock, IndianRupee } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [stats, setStats] = useState({
    activeMembers: '1+',
    weeklyActivities: '1+',
    successfulPlacements: '1+'
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats({
          activeMembers: `${Math.max(1, data.happyStudents || 1)}+`,
          weeklyActivities: `${Math.max(1, data.weeklyActivities || 1)}+`,
          successfulPlacements: `${Math.max(1, data.successfulPlacements || 1)}+`
        });
      })
      .catch(err => console.error('Error fetching community stats:', err));
  }, []);

  const activities = [
    { id: 1, name: 'Support Circle Meetup', type: 'Meetup', icon: Users, date: 'Every Saturday, 4:00 PM', location: 'Online', joined: 24, theme: 'blue' },
    { id: 2, name: 'Daily Study Group', type: 'Study', icon: GraduationCap, date: 'Every Day, 6:00 PM', location: 'Online', joined: 12, theme: 'emerald' },
    { id: 3, name: 'Weekend Football Mock', type: 'Sports', icon: Heart, date: 'Sunday, 7:00 AM', location: 'Local Park (Near You)', joined: 18, theme: 'amber' },
  ];

  const opportunities = [
    { title: 'Graphic Design Intern', company: 'Creative Souls', type: 'Internship', stipend: '₹5,000/mo', location: 'Remote', icon: Briefcase },
    { title: 'Community Volunteer', company: 'Social Uplift NGO', type: 'Volunteering', stipend: 'Unpaid (Certificate)', location: 'Mumbai / On-site', icon: Heart },
    { title: 'Junior Data Entry', company: 'TechSolutions', type: 'Full-time', stipend: '₹15,000/mo', location: 'Remote', icon: Briefcase },
  ];

  const filters = ['All', 'This Week', 'Near Me', 'Online', 'Free'];

  return (
    <div className="min-h-screen bg-stone-50/50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-stone-900"
          >
            Our Community
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-stone-500 font-medium"
          >
            Connect with people like you, join fun activities, and find life-changing opportunities. You are not alone.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeFilter === filter 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-stone-500 border border-stone-100 hover:bg-stone-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Weekly Activities */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                Weekly Activities
              </h2>
              <button className="text-blue-600 text-sm font-bold hover:underline">View Calendar</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 space-y-6 hover-lift border-0 shadow-lg shadow-stone-200/50 group"
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-4 rounded-2xl bg-${activity.theme}-50 text-${activity.theme}-600`}>
                      <activity.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{activity.type}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-blue-600 transition-colors">{activity.name}</h3>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex items-center gap-3 text-stone-500 text-sm font-medium">
                        <Clock className="w-4 h-4 text-stone-300" /> {activity.date}
                      </div>
                      <div className="flex items-center gap-3 text-stone-500 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-stone-300" /> {activity.location}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="w-8 h-8 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-400">
                            +
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-stone-400">{activity.joined} people joined</span>
                    </div>
                    <button className="btn-primary !px-5 !py-2 !text-xs !rounded-xl">Join Now</button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State/Newsletter */}
            <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100 flex flex-col md:flex-row items-center gap-8">
              <div className="p-4 bg-white rounded-2xl shadow-sm">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl font-bold text-stone-900">Don't see what you like?</h3>
                <p className="text-stone-500 font-medium">Suggest an activity or start your own community group.</p>
              </div>
              <button className="btn-secondary !bg-white whitespace-nowrap md:ml-auto">Start a Group</button>
            </div>
          </div>

          {/* Right: Opportunities */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-emerald-600" />
              Opportunities
            </h2>

            <div className="space-y-4">
              {opportunities.map((opp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 hover-lift border-0 shadow-md group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-stone-50 rounded-xl group-hover:bg-emerald-50 text-stone-400 group-hover:text-emerald-600 transition-colors">
                      <opp.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-stone-900 group-hover:text-emerald-600 transition-colors">{opp.title}</h4>
                      <p className="text-sm text-stone-400 font-bold">{opp.company}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-stone-500 text-[11px] font-bold uppercase tracking-wider">
                      <IndianRupee className="w-3 h-3" /> {opp.stipend}
                    </div>
                    <div className="flex items-center gap-2 text-stone-500 text-[11px] font-bold uppercase tracking-wider">
                      <Globe className="w-3 h-3" /> {opp.location}
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 border border-stone-100 rounded-xl text-stone-600 text-sm font-bold group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all flex items-center justify-center gap-2">
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
              
              <Link href="/roadmap" className="block text-center p-4 bg-white border border-stone-100 rounded-2xl text-stone-400 text-sm font-bold hover:text-blue-600 hover:border-blue-100 transition-all">
                See all opportunities
              </Link>
            </div>
          </div>

        </div>

        {/* Global Community Numbers */}
        <section className="bg-white rounded-[32px] p-12 border border-stone-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-extrabold text-blue-600">{stats.activeMembers}</p>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Active Members</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-extrabold text-emerald-600">{stats.weeklyActivities}</p>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Weekly Activities</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-extrabold text-amber-600">{stats.successfulPlacements}</p>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Successful Placements</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
