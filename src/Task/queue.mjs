

import Queue from "bull"

// Create a new queue instance
const taskQueue = new Queue('task-queue');

// Process pending position status job
taskQueue.process('pending_position_status', async (job, done) => {
    try {
        // Call the Pending_position_status function here
        const result = await Pending_position_status();
        done(null, result); // Job completed successfully
    } catch (error) {
        done(new Error('Failed to process pending position status'));
    }
});

// Process merging data job
taskQueue.process('merging_data', async (job, done) => {
    try {
        // Call the Merging_data function here
        const result = Merging_data();
        done(null, result); // Job completed successfully
    } catch (error) {
        done(new Error('Failed to process merging data'));
    }
});



export default taskQueue; 