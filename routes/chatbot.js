const express = require("express");
const router = express.Router();
const axios = require("axios");

// Configuration
const FLASK_HOST = "localhost";  // instead of "127.0.0.1"
const FLASK_PORT = 7000;
const FLASK_URL = `http://${FLASK_HOST}:${FLASK_PORT}`;



// Test Flask connection function
const testFlaskConnection = async () => {
    try {
        console.log(`🔍 Testing Flask connection via GET to ${FLASK_URL}/...`);
        const response = await axios.get(`${FLASK_URL}/`, {
            timeout: 30000
        });

        if (response.data?.status === "ok") {
            console.log('✅ Flask server is reachable and responded');
            return true;
        } else {
            console.log('⚠️ Flask did not return a proper response');
            return false;
        }
    } catch (error) {
        console.log('❌ Flask server is NOT reachable:', error.message);
        return false;
    }
};


// Enhanced message route with extensive debugging
router.post("/message", async (req, res) => {
    const startTime = Date.now();
    console.log('\n' + '='.repeat(50));
    console.log('🚀 NEW CHAT REQUEST RECEIVED');
    console.log('='.repeat(50));
    
    const { message } = req.body;
    
    // Input validation
    if (!message) {
        console.log('❌ No message provided in request body');
        return res.status(400).json({ error: "No message provided" });
    }
    
    console.log(`📝 User message: "${message}"`);
    console.log(`⏰ Request timestamp: ${new Date().toISOString()}`);
    
    try {
        // Test Flask connection first
        const isFlaskReachable = await testFlaskConnection();
        if (!isFlaskReachable) {
            throw new Error('Flask server is not reachable');
        }
        
        console.log(`➡️ Sending message to Flask: ${FLASK_URL}/chat`);
        console.log(`📦 Payload:`, { message });
        
        // Make request to Flask with detailed configuration
        const flaskResponse = await axios.post(`${FLASK_URL}/chat`, {
            message: message
        }, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            // Add these for Windows networking
            maxRedirects: 0,
            validateStatus: (status) => status < 500
        });
        
        const responseTime = Date.now() - startTime;
        console.log(`⬅️ Flask responded in ${responseTime}ms`);
        console.log(`📊 Response status: ${flaskResponse.status}`);
        console.log(`📋 Response data:`, flaskResponse.data);
        
        // Validate Flask response
        if (!flaskResponse.data) {
            throw new Error("Empty response from Flask");
        }
        
        if (!flaskResponse.data.response) {
            console.log('⚠️ No response field in Flask data:', flaskResponse.data);
            throw new Error("Invalid response format from Flask");
        }
        
        const botReply = flaskResponse.data.response;
        console.log(`🤖 Bot reply: "${botReply}"`);
        
        // Prepare successful response
        const successResponse = {
            userMessage: message,
            botReply: botReply,
            timestamp: new Date().toISOString(),
            responseTime: responseTime
        };
        
        console.log('✅ SUCCESS - Sending response to client');
        console.log('='.repeat(50) + '\n');
        
        res.status(200).json(successResponse);
        
    } catch (error) {
        const responseTime = Date.now() - startTime;
        console.log('\n' + '🔥'.repeat(20));
        console.log('❌ CHATBOT ERROR OCCURRED');
        console.log('🔥'.repeat(20));
        console.log(`⏰ Error occurred after ${responseTime}ms`);
        console.log(`📝 Error message: ${error.message}`);
        console.log(`🔍 Error code: ${error.code}`);
        
        if (error.response) {
            console.log(`📊 HTTP Status: ${error.response.status}`);
            console.log(`📋 Response data:`, error.response.data);
        }
        
        if (error.request) {
            console.log('📡 Request was made but no response received');
            console.log('🔧 Check if Flask server is running on port 7000');
        }
        
        console.log('📚 Full error stack:', error.stack);
        console.log('🔥'.repeat(20) + '\n');
        
        // Prepare error response
        const errorResponse = {
            userMessage: message,
            botReply: "Sorry, I couldn't respond at the moment. Please try again.",
            timestamp: new Date().toISOString(),
            error: error.message,
            responseTime: responseTime
        };
        
        // Return 200 with error message instead of 500 to avoid client-side errors
        res.status(200).json(errorResponse);
    }
});

// Health check endpoint
router.get("/health", async (req, res) => {
    console.log('🏥 Health check requested');
    
    try {
        const isFlaskReachable = await testFlaskConnection();
        
        const healthStatus = {
            status: isFlaskReachable ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            flask_connection: isFlaskReachable,
            flask_url: FLASK_URL
        };
        
        console.log('🏥 Health check result:', healthStatus);
        
        res.status(isFlaskReachable ? 200 : 503).json(healthStatus);
        
    } catch (error) {
        console.log('🏥 Health check failed:', error.message);
        res.status(503).json({
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Test endpoint for debugging
router.get("/test", (req, res) => {
    console.log('🧪 Test endpoint called');
    res.json({
        message: "Chatbot router is working!",
        timestamp: new Date().toISOString(),
        flask_url: FLASK_URL
    });
});

console.log(`🤖 Chatbot router loaded - Flask target: ${FLASK_URL}`);

module.exports = router;