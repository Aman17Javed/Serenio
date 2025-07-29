# Appointment Logic Fixes and Improvements

## Issues Fixed

### 1. **User ID Extraction Error** ✅
**Problem**: In `routes/appointment.js`, the code was trying to access `req.user.id` but the authentication middleware sets `req.user.userId`.

**Fix**: Changed `req.user.id` to `req.user.userId` in the booking endpoint.

**Location**: `routes/appointment.js` line 15

### 2. **Missing checkReminders Function** ✅
**Problem**: `test-reminders.js` was trying to import a non-existent `checkReminders` function.

**Fix**: Removed the invalid function call and updated the test file with proper documentation.

**Location**: `test-reminders.js`

### 3. **No Duplicate Booking Validation** ✅
**Problem**: The booking logic didn't check if time slots were already booked.

**Fix**: Added validation to check for existing appointments before booking:
- Checks if psychologist already has an appointment at that time
- Checks if user already has an appointment at that time
- Returns appropriate error messages

**Location**: `routes/appointment.js` lines 18-35

### 4. **Hardcoded Available Slots** ✅
**Problem**: Available slots were hardcoded with future dates.

**Fix**: Implemented dynamic available slots endpoint that:
- Takes `psychologistId` and `date` as query parameters
- Queries the database for booked appointments
- Returns available time slots (9 AM to 5 PM)
- Shows both available and booked slots

**Location**: `routes/appointment.js` lines 37-65

## New Features Added

### 1. **Enhanced Appointment Endpoints** ✅
- `GET /api/appointments/my-appointments` - Get user's appointments
- `PUT /api/appointments/cancel/:id` - Cancel an appointment
- `GET /api/appointments/:id` - Get specific appointment details

### 2. **Data Validation** ✅
- Date format validation (YYYY-MM-DD)
- Date cannot be in the past
- Time slot validation (HH:MM format)
- Time must be between 9:00 AM and 5:00 PM
- Business hours enforcement

### 3. **Database Indexing** ✅
- Added compound index to prevent duplicate bookings
- Index on `{ psychologistId, date, timeSlot, status }`
- Partial filter for active appointments only

### 4. **Error Handling** ✅
- Proper HTTP status codes (400, 401, 404, 409, 500)
- Descriptive error messages
- Validation error handling

## API Endpoints

### Booking Appointment
```
POST /api/appointments/book
Headers: Authorization: Bearer <token>
Body: {
  "psychologistId": "psychologist_id",
  "date": "2025-12-15",
  "timeSlot": "10:00",
  "reason": "Optional reason"
}
```

### Get Available Slots
```
GET /api/appointments/available-slots?psychologistId=ID&date=YYYY-MM-DD
Headers: Authorization: Bearer <token>
```

### Get User Appointments
```
GET /api/appointments/my-appointments
Headers: Authorization: Bearer <token>
```

### Cancel Appointment
```
PUT /api/appointments/cancel/:appointmentId
Headers: Authorization: Bearer <token>
```

### Get Specific Appointment
```
GET /api/appointments/:appointmentId
Headers: Authorization: Bearer <token>
```

## Testing

### Test Script
Created `test-appointment.js` to verify:
- Model validation works correctly
- Date validation rejects past dates
- Time validation rejects invalid times
- Database connection works

### Running Tests
```bash
node test-appointment.js
```

## Files Modified

1. **`routes/appointment.js`** - Fixed user ID extraction, added validation, new endpoints
2. **`models/appointment.js`** - Added validation rules and database indexing
3. **`test-reminders.js`** - Fixed invalid function call
4. **`test-appointment.js`** - New comprehensive test file

## Validation Rules

### Date Validation
- Must be in YYYY-MM-DD format
- Cannot be in the past
- Must be a valid date

### Time Validation
- Must be in HH:MM format
- Must be between 9:00 AM and 5:00 PM
- Business hours only

### Business Logic
- No duplicate bookings for same psychologist/time
- No duplicate bookings for same user/time
- Only active appointments (Booked/Completed) count as conflicts

## Status Codes

- `200` - Success
- `201` - Appointment created
- `400` - Bad request (missing fields, validation errors)
- `401` - Unauthorized (no token)
- `404` - Appointment not found
- `409` - Conflict (slot already booked)
- `500` - Server error

## Next Steps

1. **Testing**: Test all endpoints with real data
2. **Frontend Integration**: Update frontend to use new endpoints
3. **Payment Integration**: Link appointments with payment system
4. **Notifications**: Add appointment reminders
5. **Calendar Integration**: Add calendar view for appointments

## Notes

- All endpoints require authentication
- User can only access their own appointments
- Psychologist availability is not yet implemented (future enhancement)
- Payment integration is ready via `paymentId` field 