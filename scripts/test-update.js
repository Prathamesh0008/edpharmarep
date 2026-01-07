// scripts/test-update.js
import mongoose from 'mongoose';
import User from '../app/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function testUpdate() {
  try {
    console.log('🧪 Testing database update...');
    
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not set');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find a test user
    const testEmail = 'test@example.com';
    let user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('📝 Creating test user...');
      user = new User({
        username: 'Test User',
        email: testEmail,
        password: 'temp123',
        mobile: '1234567890',
        gender: 'Male',
        address: {
          street: 'Test Street',
          city: 'Test City',
          pincode: '123456'
        }
      });
      await user.save();
      console.log('✅ Test user created');
    }
    
    console.log('📊 Before update:', {
      username: user.username,
      mobile: user.mobile,
      address: user.address
    });
    
    // Update the user
    const newUsername = 'Updated ' + Date.now();
    const updateResult = await User.updateOne(
      { email: testEmail },
      { 
        $set: { 
          username: newUsername,
          'address.street': 'Updated Street ' + Date.now()
        }
      }
    );
    
    console.log('📊 Update result:', {
      matched: updateResult.matchedCount,
      modified: updateResult.modifiedCount,
      acknowledged: updateResult.acknowledged
    });
    
    // Verify update
    const updatedUser = await User.findOne({ email: testEmail });
    console.log('📊 After update:', {
      username: updatedUser.username,
      mobile: updatedUser.mobile,
      address: updatedUser.address
    });
    
    console.log('✅ Test completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testUpdate();