import { calculateSmartScore, sortTasksSmartly } from '../utils/priorityAlgorithm';
import { TaskPriority } from '../models/Task';

/**
 * Unit & Integration Test Suite for Priority Mix Algorithm and Business Logic
 */
async function runTests() {
  console.log('🧪 Starting Test Suite: Modulus Seventeen Priority Mix Algorithm & Validation\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  };

  const now = new Date();

  // Test 1: Completed tasks should have the lowest score (-1000)
  const completedTask = {
    title: 'Completed Item',
    priority: 'urgent' as TaskPriority,
    isCompleted: true,
  };
  const compResult = calculateSmartScore(completedTask, now);
  assert(compResult.score === -1000, 'Completed tasks receive -1000 score penalty');
  assert(compResult.urgencyLevel === 'COMPLETED', 'Completed task urgencyLevel is COMPLETED');

  // Test 2: Overdue task should rank higher than far-future urgent task
  const overdueTask = {
    title: 'Overdue High Priority Task',
    priority: 'high' as TaskPriority,
    deadline: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours overdue
    isCompleted: false,
  };
  const futureUrgentTask = {
    title: 'Future Urgent Task',
    priority: 'urgent' as TaskPriority,
    deadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days away
    isCompleted: false,
  };

  const overdueScore = calculateSmartScore(overdueTask, now);
  const futureScore = calculateSmartScore(futureUrgentTask, now);
  assert(
    overdueScore.score > futureScore.score,
    `Overdue task (${overdueScore.score}) ranks above distant future urgent task (${futureScore.score})`
  );
  assert(overdueScore.overdue === true, 'Overdue flag is correctly set to true');

  // Test 3: Imminent deadline (<6h) gets critical boost
  const imminentTask = {
    title: 'Task due in 2 hours',
    priority: 'medium' as TaskPriority,
    deadline: new Date(now.getTime() + 2 * 60 * 60 * 1000),
    isCompleted: false,
  };
  const distantTask = {
    title: 'Task due in 14 days',
    priority: 'medium' as TaskPriority,
    deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
    isCompleted: false,
  };
  const imminentScore = calculateSmartScore(imminentTask, now);
  const distantScore = calculateSmartScore(distantTask, now);
  assert(
    imminentScore.score > distantScore.score,
    `Imminent task (${imminentScore.score}) scores higher than distant task (${distantScore.score})`
  );

  // Test 4: Smart sorting array order
  const taskList = [
    { title: 'T1: Low distant', priority: 'low' as TaskPriority, deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), isCompleted: false },
    { title: 'T2: Urgent due in 1h', priority: 'urgent' as TaskPriority, deadline: new Date(now.getTime() + 1 * 60 * 60 * 1000), isCompleted: false },
    { title: 'T3: Completed urgent', priority: 'urgent' as TaskPriority, isCompleted: true },
    { title: 'T4: Overdue medium', priority: 'medium' as TaskPriority, deadline: new Date(now.getTime() - 4 * 60 * 60 * 1000), isCompleted: false },
  ];

  const sorted = sortTasksSmartly(taskList, now);
  assert(sorted[0].title === 'T4: Overdue medium' || sorted[0].title === 'T2: Urgent due in 1h', 'Top task is overdue or urgent imminent');
  assert(sorted[sorted.length - 1].title === 'T3: Completed urgent', 'Last task is completed item');

  console.log(`\n📊 Test Summary: ${passed} Passed, ${failed} Failed\n`);
  if (failed > 0) process.exit(1);
}

runTests();
