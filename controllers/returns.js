const mongoose = require("mongoose");
const Investment = require("../models/investment");
const Project = require("../models/project");
/**
 * @swagger
 * /api/returns/investorsOnProject/{projectID}:
 *   get:
 *     summary: Get total investments by project ID
 *     tags: [Returns]
 *     parameters:
 *       - in: path
 *         name: projectID
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
const investorsOnProject = async (req, res) => {
    try {
        const projectID = req.params.projectID;
        // console.log(req.params.projectID)
        const project = await Project.findById(projectID);

        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Project not found",
            });
        }
        
        const result = await Investment.aggregate([
            { $match: { projectID: new mongoose.Types.ObjectId(projectID) } }, // Ensure projectID is properly converted to ObjectId
            {
                $group: {
                    _id: "$investorAddress", // Ensure field name is correct, "investorAddress" or "investorAddress"
                    totalInvestment: { $sum: "$investedAmount" }
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
            projectID: projectID,
            investments: result.map(item => ({ address: item._id, amount: item.totalInvestment }))
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
 * /api/returns/investorsReturns/{projectID}:
 *   get:
 *     summary: Get total investments by project ID
 *     tags: [Returns]
 *     parameters:
 *       - in: path
 *         name: projectID
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
        const projectID = req.params.projectID;
        // console.log(req.params.projectID)
        const project = await Project.findById(projectID);

        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Project not found",
            });
        }
        
        const result = await Investment.aggregate([
            { $match: { projectID: new mongoose.Types.ObjectId(projectID) } }, // Ensure projectID is properly converted to ObjectId
            {
                $group: {
                    _id: "$investorAddress", // Ensure field name is correct, "investorAddress" or "investorAddress"
                    totalInvestment: { $sum: "$investedAmount" }
                }
            }
        ]);

        if (!result || result.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "No investments found for the specified project",
            });
        }
        console.log("project.tokenSupply",project.tokenSupply,"\n project.tokenSupply", project.targetAmount)
        return res.status(200).json({
            statusCode: 200,
            projectID: projectID,
            investments: result.map(item => ({ address: item._id, amount: ( ( project.tokenSupply / project.targetAmount ) * item.totalInvestment ) }))
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
    investorsOnProject,
    investorsReturns
};