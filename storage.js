const fs = require('fs').promises;
const path = require('path');

// Use a path within your project directory
const filePath = path.join(__dirname, 'pendingNotifications.json');

async function savePendingNotifications(pendingNotifications) {
    const data = JSON.stringify([...pendingNotifications]);
    await fs.writeFile(filePath, data, 'utf-8');
}

async function loadPendingNotifications() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        if (data.trim() === '') {
            return new Map();
        }
        return new Map(JSON.parse(data));
    } catch (error) {
        // If the file doesn't exist, create it with an empty map
        if (error.code === 'ENOENT') {
            await savePendingNotifications(new Map());
            return new Map();
        }
        throw error;
    }
}

module.exports = { savePendingNotifications, loadPendingNotifications };
