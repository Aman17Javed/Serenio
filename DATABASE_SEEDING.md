# Database Seeding Guide

This guide explains how to populate the Serenio database with sample data for testing and review purposes.

## Quick Start

To seed the database with sample data, run:

```bash
npm run seed
```

## What Data is Created

The seeding script creates comprehensive sample data for the user `aman@example.com`:

### Users
- **Main User**: `aman@example.com` (password: `password123`)
- **Psychologists**: 3 psychologist accounts with different specializations
- **Admin**: `admin@example.com` (password: `password123`)

### Psychologists
1. **Dr. Sarah Johnson** - Cognitive Behavioral Therapy (4.8★, 127 reviews)
2. **Dr. Michael Chen** - Anxiety and Stress Management (4.6★, 89 reviews)
3. **Dr. Emily Rodriguez** - Depression and Mood Disorders (4.9★, 156 reviews)

### Appointments
- 4 appointments for `aman@example.com`:
  - 2 completed sessions
  - 2 upcoming sessions
  - Different psychologists and time slots

### Payments
- 3 payment records:
  - 2 successful payments (JazzCash, EasyPaisa)
  - 1 pending payment (Manual)

### Mood Logs
- 10 mood entries over 10 days
- Mix of positive, neutral, and negative sentiments
- Realistic progression showing mood tracking

### Chat Logs
- 4 chat session entries
- Sample conversations about anxiety and sleep issues
- Responses from the chatbot

### Feedback
- 2 feedback entries with ratings and comments
- Linked to specific chat sessions

## Database Schema Overview

### Collections Created:
- `users` - User accounts and authentication
- `psychologists` - Psychologist profiles and specializations
- `appointments` - Booking and session management
- `payments` - Payment transactions
- `moodlogs` - Daily mood tracking
- `chatlogs` - Chatbot conversation history
- `feedback` - User feedback and ratings

## Login Credentials

### Main User Account:
- **Email**: `aman@example.com`
- **Password**: `password123`
- **Role**: User

### Admin Account:
- **Email**: `admin@example.com`
- **Password**: `password123`
- **Role**: Admin

### Psychologist Accounts:
- **Dr. Sarah Johnson**: `sarah.johnson@example.com`
- **Dr. Michael Chen**: `michael.chen@example.com`
- **Dr. Emily Rodriguez**: `emily.rodriguez@example.com`
- **Password**: `password123` (for all)

## Features to Test

With this sample data, you can test:

1. **User Dashboard** - View appointments, mood history, and profile
2. **Appointment Booking** - Book sessions with different psychologists
3. **Payment Processing** - Test payment flows and status updates
4. **Mood Tracking** - View mood trends and analytics
5. **Chatbot** - Test conversation history and responses
6. **Admin Panel** - Manage users, appointments, and system data
7. **Psychologist Dashboard** - View bookings and patient data

## Data Relationships

The seeding script creates proper relationships between:
- Users → Appointments → Payments
- Users → Mood Logs
- Users → Chat Logs → Feedback
- Psychologists → Appointments

## Resetting Data

The script automatically clears existing data before seeding. If you need to reset the database:

```bash
npm run seed
```

This will remove all existing data and create fresh sample data.

## Environment Variables

Make sure your `.env` file contains:
```
MONGODB_URI=your_mongodb_connection_string
```

## Troubleshooting

If the seeding fails:
1. Check your MongoDB connection
2. Ensure all required environment variables are set
3. Verify that the database is accessible
4. Check the console output for specific error messages

## Customization

To modify the sample data, edit `scripts/seedDatabase.js`:
- Change user details in the `mainUser` object
- Modify appointment dates and times
- Adjust mood log patterns
- Update psychologist information
- Modify payment amounts and methods 