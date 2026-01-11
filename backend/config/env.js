// Load environment variables
import 'dotenv/config.js';

// Export JWT secret
export const JWT_SECRET = process.env.JWT_SECRET;

// Validate environment variables
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
