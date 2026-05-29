import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({
      happyStudents: 1,
      resumesCreated: 0,
      supportLocations: 1,
      successfulPlacements: 1,
      weeklyActivities: 1,
    });
  }

  try {
    // 1. Get the actual user registration count from Firestore
    const usersSnapshot = await adminDb.collection('users').count().get();
    const totalUsers = usersSnapshot.data().count || 0;

    // 2. Get the global stats document for resume download count
    const statsDocRef = adminDb.collection('stats').doc('global');
    const statsDocSnap = await statsDocRef.get();
    
    let resumesCreated = 0;
    let supportLocations = 1;
    let successfulPlacements = 1;
    let weeklyActivities = 3;
    
    if (statsDocSnap.exists) {
      const data = statsDocSnap.data();
      resumesCreated = data?.resumesCreated || 0;
      supportLocations = data?.supportLocations || 1;
      successfulPlacements = data?.successfulPlacements || 1;
      weeklyActivities = data?.weeklyActivities || 3;
    } else {
      // Initialize if it doesn't exist
      await statsDocRef.set({ resumesCreated: 0, supportLocations: 1, successfulPlacements: 1, weeklyActivities: 3 });
    }

    return NextResponse.json({
      happyStudents: totalUsers,
      resumesCreated: resumesCreated,
      supportLocations: supportLocations,
      successfulPlacements: successfulPlacements,
      weeklyActivities: weeklyActivities,
    });
  } catch (error: any) {
    console.error('[API Stats] Error fetching real metrics:', error);
    // Secure fallback defaults matching real baseline data
    return NextResponse.json({
      happyStudents: 1,
      resumesCreated: 0,
      supportLocations: 1,
      successfulPlacements: 1,
      weeklyActivities: 1,
    });
  }
}

export async function POST() {
  if (!adminDb) {
    return NextResponse.json({ success: false, message: 'Database offline/build mode' });
  }

  try {
    // Increment the resume downloaded counter globally
    const statsDocRef = adminDb.collection('stats').doc('global');
    await adminDb.runTransaction(async (transaction) => {
      const sfDoc = await transaction.get(statsDocRef);
      if (!sfDoc.exists) {
        transaction.set(statsDocRef, { resumesCreated: 1, supportLocations: 1 });
      } else {
        const newCount = (sfDoc.data()?.resumesCreated || 0) + 1;
        transaction.update(statsDocRef, { resumesCreated: newCount });
      }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API Stats] Error incrementing resume count:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
