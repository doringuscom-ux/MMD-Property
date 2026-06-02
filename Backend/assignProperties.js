import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Property from './models/propertyModel.js';
import connectDB from './config/db.js';

dotenv.config();

const propertyIds = [
  "69f5ce4f1e56433a96f054c1", "69f5c682bb4989f063b36f4f", "69f5c682bb4989f063b36f4e",
  "69f5c682bb4989f063b36f4d", "69f5c682bb4989f063b36f4c", "69f5c682bb4989f063b36f4b",
  "69f5c682bb4989f063b36f4a", "69f5c682bb4989f063b36f49", "69f5c682bb4989f063b36f48",
  "69f5c682bb4989f063b36f41", "69f5c682bb4989f063b36f47", "69f5c682bb4989f063b36f46",
  "69f5c682bb4989f063b36f45", "69f5c682bb4989f063b36f44", "69f5c682bb4989f063b36f43",
  "69f5c682bb4989f063b36f42", "69f5c682bb4989f063b36f40", "69f5c682bb4989f063b36f3f",
  "69f5c682bb4989f063b36f3e", "69f5c682bb4989f063b36f3d", "69f5c682bb4989f063b36f3c",
  "69f5c682bb4989f063b36f3b", "69f5c682bb4989f063b36f3a", "69f5c682bb4989f063b36f39",
  "69f5c682bb4989f063b36f38", "69f5c682bb4989f063b36f37", "69f5c682bb4989f063b36f36",
  "69f5c682bb4989f063b36f35", "69f5c682bb4989f063b36f34", "69f5c682bb4989f063b36f33",
  "69f5c682bb4989f063b36f32"
];

const assignProperties = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const agents = [];
        for (let i = 1; i <= 6; i++) {
            const email = `agent${i}@mmdproperty.com`;
            let agent = await User.findOne({ email });
            if (!agent) {
                agent = await User.create({
                    name: `Agent ${i}`,
                    email,
                    password: 'password123',
                    role: 'agent',
                    phone: `987654320${i}`,
                    isVerified: true
                });
                console.log(`Created Agent ${i}`);
            } else {
                console.log(`Agent ${i} already exists`);
            }
            agents.push(agent);
        }

        // Fetch properties to make sure they exist, if not we will just update based on propertyIds
        // Update properties evenly
        for (let i = 0; i < propertyIds.length; i++) {
            const agentIndex = i % agents.length;
            const agentId = agents[agentIndex]._id;
            
            const result = await Property.updateOne(
                { _id: propertyIds[i] },
                { $set: { postedBy: agentId } }
            );
            if (result.modifiedCount > 0) {
                console.log(`Assigned property ${propertyIds[i]} to ${agents[agentIndex].name}`);
            }
        }
        
        console.log('Assignment Complete!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

assignProperties();
