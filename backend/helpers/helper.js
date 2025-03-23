// Convert timestamp to YYYY-MM-DD
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
};

const formatTimestamp = (unixTimestamp) => {
    if (!unixTimestamp) return null; // Handle null or undefined values
    const date = new Date(unixTimestamp);
    return date.toISOString().replace("T", " ").substring(0, 19); // Convert to "YYYY-MM-DD HH:mm:ss"
};

module.exports = {
    formatDate,
    formatTimestamp
}