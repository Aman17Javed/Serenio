const appointmentModule = require('./routes/appointment');
const { checkReminders } = appointmentModule; // Destructure from the module object if exported
checkReminders().catch(err => console.error('Test error:', err));