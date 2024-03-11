const Investment = require("../models/investment");
const Project = require("../models/project");


/**
 * @swagger
 * tags:
 *   name: Investments
 *   description: API endpoints for managing investments
 */

/**
 * @swagger
 * /api/investments/createInvestment:
 *   post:
 *     summary: Create a new investment
 *     tags: [Investments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               investorAddress:
 *                 type: string
 *               givenAmount:
 *                 type: number
 *               actualAmount:
 *                 type: number
 *               projectID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Investment listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 responseMessage:
 *                   type: string
 *                   example: Investment Listed Successfully
 *       404:
 *         description: Project doesn't exist
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
 *                   example: Project doesn't exist
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
const createInvestment = async (req, res) => {
    try{
        const existingProject = await Project.findOne({
            _id: req.body.projectID,
            status: 'OPEN'
        });

        if (!existingProject) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Project doesn't exist",
            });
        }

        const newInvestment = new Investment({
            investorAddress: req.body.investorAddress,
            investedAmount: req.body.givenAmount,
            projectID: req.body.projectID,
            actualAmount: req.body.actualAmount
        });

        await newInvestment.save();
        existingProject.amountRaised += req.body.actualAmount;
        existingProject.totalRaised += req.body.givenAmount;
        await existingProject.save();
        if(existingProject.amountRaised>=existingProject.targetAmount)
        {
            existingProject.status = "CLOSED"
            await existingProject.save();
        }
        return res.status(200).json({
            statusCode: 200,
            responseMessage: "Investment Listed Successfully",
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
 * /api/investments/getInvestmentByProject/{projectId}:
 *   get:
 *     summary: Get investment by project ID
 *     tags: [Investments]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       404:
 *         description: Project not found
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
 *                   example: Project not found
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
const getInvestmentByProject = async (req, res) => {
    try {
        // console.log(req.params.projectId)
        const project = await Project.findById(req.params.projectId);
        // console.log(project);
        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Project not found",
            });
        }

        const investment = await Investment.find({ projectID: req.params.projectId });
        console.log()
        return res.status(200).json({
            statusCode: 200,
            investment,
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
 * /api/investments/getInvestmentByAddress/{address}:
 *   get:
 *     summary: Get investment by investor address
 *     tags: [Investments]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *       404:
 *         description: Investment not found
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
 *                   example: Investment not found
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
const getInvestmentByAddress = async (req, res) => {
    try {
        const investorAddress = req.params.address;
        const investments = await Investment.find({ investorAddress: investorAddress });
        if (!investments || investments.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Investment not found",
            });
        }

        const investmentDetails = await Promise.all(investments.map(async (investment) => {
            const project = await Project.findById(investment.projectID);
            return {
                _id: investment._id,
                investorAddress: investment.investorAddress,
                investedAmount: investment.investedAmount,
                actualAmount: investment.actualAmount,
                projectID: investment.projectID,
                createdAt: investment.createdAt,
                updatedAt: investment.updatedAt,
                project: project ? project.name : "Project not found",
            };
        }));

        return res.status(200).json({
            statusCode: 200,
            investment: investmentDetails,
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
 * /api/investments/getAllInvestment:
 *   get:
 *     summary: Get all investments
 *     tags: [Investments]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 investments:
 *                   type: array
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
const getAllInvestment = async (req, res) => {
    try {
        const investments = await Investment.find();
        return res.status(200).json({
            statusCode: 200,
            investments: investments,
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
const sellStakes = async (req, res) => {
    try {
        const investments = await Investment.find();
        return res.status(200).json({
            statusCode: 200,
            investments: investments,
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
const buyStakes =
module.exports = {
    createInvestment,
    getInvestmentByProject,
    getInvestmentByAddress,
    getAllInvestment
};
