import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { db } from '../config/firebase.js';

const router = express.Router();

// Initialize Razorpay
// Wrapping inside a function or standard instantiating.
// If keys are missing, we don't want it to crash the server immediately, but it will fail on order creation.
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
  });
};

// POST /api/payments/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Expect amount in rupees and we will convert to paise or assume paise? We'll pass paise directly or convert. Let's assume frontend just asks for fixed 500 amount.
    // Consultation fee default is 500 INR = 50000 paise
    const paymentAmount = amount ? amount * 100 : 50000; 

    const options = {
      amount: paymentAmount, // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: 'Could not create order' });
  }
});

// POST /api/payments/verify-payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentData
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return res.status(500).json({ success: false, message: 'Server configuration error: missing Razorpay secret' });
    }

    // Creating hash to verify
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    // Compare signatures securely
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Payment is verified. Now safely save the appointment out of the client's reach
    const { patientId, doctorId, doctorName, date, time, type, notes } = appointmentData;
    
    // Generate a unique room ID for video consultation
    const roomId = `telehealth-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newAppointment = {
      patientId,
      doctorId,
      doctorName,
      date,
      time: time || '10:00',
      type: type || 'video',
      status: 'scheduled',
      notes: notes || '',
      roomId,
      paymentId: razorpay_payment_id, // Attaching the validated payment ID
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('appointments').add(newAppointment);

    res.json({
      success: true,
      message: 'Payment verified and appointment booked successfully',
      appointment: { id: docRef.id, ...newAppointment }
    });

  } catch (error) {
    console.error('Error verifying payment or saving appointment:', error);
    res.status(500).json({ success: false, message: 'Internal server error while processing verification' });
  }
});

export default router;
