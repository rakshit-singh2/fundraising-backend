const Investment = require("../models/investment");


/**
 * @swagger
 * /api/returns/investorsClosedProject/{projectId}:
 *   get:
 *     summary: Get total investments by project ID
 *     tags: [Investments]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     responses:
 *       200:
 *         description: Total investments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 projectID:
 *                   type: string
 *                 investments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                         example: "0xCD5Fc6F111884617A37997E5c206Ff344ca77275"
 *                       amount:
 *                         type: number
 *                         example: 100
 *       404:
 *         description: No investments found for the specified project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 responseMessage:
 *                   type: string
 *                   example: No investments found for the specified project
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 responseMessage:
 *                   type: string
 *                   example: Something went wrong
 *                 error:
 *                   type: object
 */
const investorsClosedProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Aggregate pipeline to sum up the invested amount for each investor on the specified project
        const result = await Investment.aggregate([
            { $match: { projectID: projectId } }, // Filter by project ID
            {
                $group: {
                    _id: "$investerAddress", // Group by investor address
                    totalInvestment: { $sum: "$investedAmount" } // Calculate the total invested amount
                }
            }
        ]);

        if (!result || result.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "No investments found for the specified project",
            });
        }

        return res.status(200).json({
            statusCode: 200,
            projectID: projectId, // The project ID
            investments: result.map(item => ({ address: item._id, amount: item.totalInvestment })) // List of investments by address
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            responseMessage: "Something went wrong",
            error: error,
        });
    }
};

/**
 * @swagger
 * /api/returns/investorsReturns/{projectId}:
 *   get:
 *     summary: Get total investments by project ID
 *     tags: [Investments]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     responses:
 *       200:
 *         description: Total investments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 projectID:
 *                   type: string
 *                 investments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                         example: "0xCD5Fc6F111884617A37997E5c206Ff344ca77275"
 *                       amount:
 *                         type: number
 *                         example: 100
 *       404:
 *         description: No investments found for the specified project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 responseMessage:
 *                   type: string
 *                   example: No investments found for the specified project
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 responseMessage:
 *                   type: string
 *                   example: Something went wrong
 *                 error:
 *                   type: object
 */
const investorsReturns = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        // Aggregate pipeline to sum up the invested amount for each investor on the specified project
        const result = await Investment.aggregate([
            { $match: { projectID: projectId } }, // Filter by project ID
            {
                $group: {
                    _id: "$investerAddress", // Group by investor address
                    totalInvestment: { $sum: "$investedAmount" } // Calculate the total invested amount
                }
            }
        ]);

        if (!result || result.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "No investments found for the specified project",
            });
        }

        const project = await Project.findById(projectId);
        return res.status(200).json({
            statusCode: 200,
            projectID: projectId, // The project ID
            investments: result.map(item => ({ address: item._id, amount: (project.tokenSupply * item.totalInvestment)/ project.targetAmount})) // List of investments by address
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            responseMessage: "Something went wrong",
            error: error,
        });
    }
};


module.exports = {
    investorsClosedProject,
    investorsReturns
};