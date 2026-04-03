import { db } from '../config/firebase.js';
import logger from '../config/logger.js';

// Helper to parse Firestore appointment date ("YYYY-MM-DD") and time ("10:00 AM") into a JS Date
function parseAppointmentDateTime(dateStr, timeStr) {
  if (!dateStr) return null;

  const [year, month, day] = dateStr.split('-').map(Number);

  let hours = 10;
  let minutes = 0;

  if (timeStr) {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      hours = Number(match[1]);
      minutes = Number(match[2]);
      const period = match[3]?.toUpperCase();
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
    }
  }

  // Construct date in local timezone
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

async function createNotificationForUser({ userId, role, appointmentId, title, body }) {
  if (!userId) return;

  const notification = {
    userId,
    role: role || null,
    appointmentId,
    title,
    body,
    createdAt: new Date().toISOString(),
    read: false,
    type: 'appointment-reminder'
  };

  await db.collection('notifications').add(notification);
}

async function processUpcomingAppointments() {
  const now = new Date();

  // Look ahead 4 hours to catch 3, 2, 1 hour windows
  const windowEnd = new Date(now.getTime() + 4 * 60 * 60 * 1000);

  try {
    const snapshot = await db
      .collection('appointments')
      .where('status', '==', 'scheduled')
      .get();

    if (snapshot.empty) return;

    const batch = db.batch();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const appointmentDateTime = parseAppointmentDateTime(data.date, data.time);
      if (!appointmentDateTime) return;

      // Only consider appointments between now and windowEnd
      if (appointmentDateTime < now || appointmentDateTime > windowEnd) return;

      const msUntil = appointmentDateTime.getTime() - now.getTime();
      const hoursUntil = msUntil / (60 * 60 * 1000);

      const reminders = [
        { label: '3h', hours: 3, field: 'reminder3hSent' },
        { label: '2h', hours: 2, field: 'reminder2hSent' },
        { label: '1h', hours: 1, field: 'reminder1hSent' },
      ];

      for (const reminder of reminders) {
        const alreadySent = data[reminder.field];
        const diff = Math.abs(hoursUntil - reminder.hours);

        // Fire within ~10 minutes window around each target hour (to tolerate 5-min polling)
        if (!alreadySent && diff <= 10 / 60) {
          const apptTimeStr = `${data.date || ''} ${data.time || ''}`.trim();
          const title = `Appointment in ${reminder.hours} hour${reminder.hours === 1 ? '' : 's'}`;
          const body = `You have an appointment scheduled at ${apptTimeStr}. Please be prepared in advance.`;

          // Patient notification
          createNotificationForUser({
            userId: data.patientId,
            role: 'patient',
            appointmentId: doc.id,
            title,
            body,
          }).catch((err) =>
            logger.error(`Failed to create patient reminder notification: ${err.message}`),
          );

          // Doctor notification
          createNotificationForUser({
            userId: data.doctorId,
            role: 'doctor',
            appointmentId: doc.id,
            title,
            body,
          }).catch((err) =>
            logger.error(`Failed to create doctor reminder notification: ${err.message}`),
          );

          batch.update(doc.ref, { [reminder.field]: true, updatedAt: new Date().toISOString() });
        }
      }
    });

    await batch.commit();
  } catch (error) {
    if (error?.code === 5 || `${error?.message || ''}`.includes('NOT_FOUND')) {
      const disableOnNotFound = process.env.APPOINTMENT_REMINDER_DISABLE_ON_NOT_FOUND === 'true';
      const message =
        'Firestore project/database not found. Verify FIREBASE_PROJECT_ID and that Firestore is created in Firebase Console.';

      if (disableOnNotFound) {
        disableScheduler(message);
      } else {
        logger.error(`Appointment reminder scheduler retrying: ${message}`);
      }
      return;
    }

    logger.error(`Error processing appointment reminders: ${error.message}`);
  }
}

let intervalHandle = null;
let schedulerDisabled = false;

function disableScheduler(reason) {
  if (schedulerDisabled) return;
  schedulerDisabled = true;
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
  logger.error(`Appointment reminder scheduler disabled: ${reason}`);
}

export function startAppointmentReminderScheduler() {
  if (process.env.APPOINTMENT_REMINDER_ENABLED === 'false') {
    logger.info('Appointment reminder scheduler is disabled via APPOINTMENT_REMINDER_ENABLED=false');
    return;
  }

  if (intervalHandle) return;

  logger.info('Starting appointment reminder scheduler (runs every 5 minutes)');

  // Run immediately on startup, then every 5 minutes
  processUpcomingAppointments();
  intervalHandle = setInterval(processUpcomingAppointments, 5 * 60 * 1000);
}

