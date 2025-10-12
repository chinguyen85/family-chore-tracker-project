const Family = require('../models/family');
const User = require('../models/user');

// Handle family creation by authenticaed users (route POST /create)
exports.createFamily = async (req, res) => {
    const { familyName } = req.body;
    const supervisorId = req.user.id; // User ID comes from the 'protect' middleware

    // Check if user already belongs to a family
    if (req.user.familyId) {
        return res.status(400).json({ success: false, error: 'User already belongs to a family.' });
    }

    try {
        // Create the Family document, get and save the invite code
        const family = await Family.create({
            familyName,
            supervisorId // Set the creator
        });
        family.getInviteCode();
        await family.save();

        // Update the Supervisor's familyId and return family details
        await User.findByIdAndUpdate(supervisorId, { familyId: family._id });
        res.status(201).json({
            success: true,
            data: {
                id: family.id,
                familyName: family.familyName,
                inviteCode: family.inviteCode
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Handle joining via an invite code (route POST /join)
exports.joinFamily = async (req, res) => {
    const { inviteCode } = req.body;
    const userId = req.user.id;

    if (req.user.familyId) {
        return res.status(400).json({ success: false, error: 'User already belongs to a family.' });
    }

    try {
        // Find the family by invite code
        const family = await Family.findOne({ inviteCode }).select('+inviteCode'); // Need to select inviteCode as it's selected false by default
        if (!family) {
            return res.status(404).json({ success: false, error: 'Invalid invite code.' });
        }

        // Update the Member's familyId and return confirmation
        await User.findByIdAndUpdate(userId, { familyId: family._id });
        res.status(200).json({
            success: true,
            data: {
                message: `Successfully joined ${family.familyName}.`,
                familyId: family._id,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Handle fetching family details of the logged in user (route GET /)
exports.getFamilyDetails = async (req, res) => {
    const userFamilyId = req.user.familyId;

    // Ensure the user belongs to the requested family
    if (!userFamilyId) {
        return res.status(400).json({ success: false, error: 'User does not belong to a family.' });
    }

    try {
        // Find the family by ID and populate supervisor details
        let familyQuery = await Family.findById(familyId).populate('supervisorId', 'fullName email role');

        // If user is Supervisor, include the invite code and execute the query
        if (req.user.role === 'Supervisor') {
            familyQuery = await Family.findById(familyId).select('+inviteCode').populate('supervisorId', 'fullName email role');
        }
        const family = await familyQuery;

        // If no family found, return 404
        if (!family) {
            return res.status(404).json({ success: false, error: 'Family not found.' });
        }

        // Return family details in JSON format with OK status
        res.status(200).json({
            success: true,
            data: family
        });
    } catch (err) {
        console.error('Error fetching family by ID:', err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Handle fetching family members by family ID (route GET /:familyId/members)
exports.getFamilyMembers = async (req, res) => {
    const { familyId } = req.user.familyId;
    
    if (!familyId) {
        return res.status(400).json({ success: false, error: 'User does not belong to any family.' });
    }

    try {
        // Find all users with the same familyId
        const members = await User.find({ familyId }).select('fullName email role starTotal');

        // Return members list in JSON format with OK status
        res.status(200).json({
            success: true,
            count: members.length,
            data: members
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};