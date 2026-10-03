import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { User } from '../models/User';
import { Task } from '../models/Task';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore
}

dotenv.config();

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/modulus_todo_app';
    await mongoose.connect(mongoURI);
    console.log('[Seeder] Connected to database');

    // Clean existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('[Seeder] Cleared previous data');

    // Create demo user
    const demoUser = await User.create({
      name: 'Alex Vance',
      email: 'alex@example.com',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    });

    console.log(`[Seeder] Created demo user: ${demoUser.email} (Password: password123)`);

    const now = new Date();

    const sampleTasks = [
      {
        user: demoUser._id,
        title: 'Submit React Native Assignment to Modulus Seventeen',
        description: 'Complete the React Native CLI To-Do application with MongoDB backend, JWT auth, and Smart Urgency algorithm.',
        dateTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        deadline: new Date(now.getTime() + 4 * 60 * 60 * 1000), // Due in 4 hours (Urgent!)
        priority: 'urgent',
        category: 'work',
        tags: ['Interview', 'Assignment', 'React Native'],
        isCompleted: false,
        color: '#EF4444',
        reminderEnabled: true,
        subtasks: [
          { id: 'st-1', title: 'Implement Auth with JWT', isCompleted: true },
          { id: 'st-2', title: 'Build UI with Dark Glassmorphism', isCompleted: true },
          { id: 'st-3', title: 'Verify Smart Urgency Algorithm', isCompleted: false },
        ],
      },
      {
        user: demoUser._id,
        title: 'Complete Mobile UI Design Review',
        description: 'Check typography hierarchy, neon accents, and smooth animations across Android viewports.',
        dateTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        deadline: new Date(now.getTime() - 3 * 60 * 60 * 1000), // Overdue by 3 hours
        priority: 'high',
        category: 'project',
        tags: ['UI/UX', 'Design', 'Mobile'],
        isCompleted: false,
        color: '#F59E0B',
        reminderEnabled: true,
        subtasks: [
          { id: 'st-4', title: 'Verify responsive paddings', isCompleted: true },
          { id: 'st-5', title: 'Check contrast ratios', isCompleted: false },
        ],
      },
      {
        user: demoUser._id,
        title: 'Gym Workout - Upper Body & Cardio',
        description: '45 mins chest and back supersets followed by 20 mins HIIT cardio session.',
        dateTime: new Date(now.getTime() + 8 * 60 * 60 * 1000),
        deadline: new Date(now.getTime() + 10 * 60 * 60 * 1000),
        priority: 'medium',
        category: 'health',
        tags: ['Fitness', 'Workout'],
        isCompleted: false,
        color: '#10B981',
        reminderEnabled: false,
        subtasks: [],
      },
      {
        user: demoUser._id,
        title: 'Study TypeScript Generics and Utility Types',
        description: 'Read documentation on Conditional Types, Mapped Types, and Template Literal Types.',
        dateTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        deadline: new Date(now.getTime() + 48 * 60 * 60 * 1000),
        priority: 'low',
        category: 'study',
        tags: ['TypeScript', 'Learning'],
        isCompleted: false,
        color: '#6366F1',
        reminderEnabled: false,
        subtasks: [],
      },
      {
        user: demoUser._id,
        title: 'Monthly Cloud Infrastructure Review & Budgeting',
        description: 'Audit AWS / MongoDB Atlas clusters and adjust auto-scaling thresholds.',
        dateTime: new Date(now.getTime() - 48 * 60 * 60 * 1000),
        deadline: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        priority: 'medium',
        category: 'finance',
        tags: ['DevOps', 'Cloud', 'Finance'],
        isCompleted: true,
        completedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
        color: '#8B5CF6',
        reminderEnabled: false,
        subtasks: [],
      },
    ];

    await Task.insertMany(sampleTasks);
    console.log(`[Seeder] Inserted ${sampleTasks.length} sample tasks successfully!`);

    await mongoose.disconnect();
    console.log('[Seeder] Done!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
