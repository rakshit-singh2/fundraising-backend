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
 * /api/investments/getInvestmentByProject/{projectID}:
 *   get:
 *     summary: Get investment by project ID
 *     tags: [Investments]
 *     parameters:
 *       - in: path
 *         name: projectID
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
        // console.log(req.params.projectID)
        const project = await Project.findById(req.params.projectID);
        // console.log(project);
        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Project not found",
            });
        }

        const investment = await Investment.find({ projectID: req.params.projectID });
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
        if (!investments || investments.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "No investments not found",
            });
        }
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


/**
 * @swagger
 * /api/investments/sellStakes:
 *   post:
 *     summary: Sell stakes for an investor in a project
 *     tags: [Investments]
 *     parameters:
 *       - in: query
 *         name: investorAddress
 *         required: true
 *         description: Address of the investor
 *         schema:
 *           type: string
 *       - in: query
 *         name: projectID
 *         required: true
 *         description: ID of the project
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stakes sold successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 responseMessage:
 *                   type: string
 *                   example: Both investorAddress and projectID are required
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
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 *                 error:
 *                   type: object
 */
const sellStakes = async (req, res) => {
    try {
        // console.log("req.query.investorAddress",req.query.investorAddress,"\nreq.query.projectID",req.query.projectID)
        // Check if both investorAddress and projectID are provided
        if (!req.query.investorAddress || !req.query.projectID) {
            return res.status(400).json({
                statusCode: 400,
                responseMessage: "Both investorAddress and projectID are required",
            });
        }
        // console.log("req.query.investorAddres",req.query.investorAddress,"\nreq.query.projectID",req.query.projectID)
        // Find investments matching investorAddress and projectID
        const investments = await Investment.find({ investorAddress: req.query.investorAddress, projectID: req.query.projectID });
        
        // Check if investments were found
        if (!investments || investments.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Investment not found",
            });
        }

        // Update saleStatus for each investment
        for (const investment of investments) {
            investment.saleStatus = true;
            await investment.save();
        }

        // Respond with success message and updated investments
        return res.status(200).json({
            statusCode: 200,
            investments: investments,
        });
    } catch (error) {
        // Handle internal server error
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            responseMessage: "Internal Server Error",
            error: error,
        });
    }
};


/**
 * @swagger
 * /api/investments/getOnSaleInvestmentByProject/{projectID}:
 *   get:
 *     summary: Get investments on sale by project
 *     tags: [Investments]
 *     parameters:
 *       - in: path
 *         name: projectID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Project not found
 *       500:
 *         description: Something went wrong
 */
const getOnSaleInvestmentByProject = async (req, res) => {
    try {
        // console.log("req.params.projectID",req.params.projectID)
        const investments = await Investment.find({ projectID: req.params.projectID, saleStatus: true });
        if (!investments || investments.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Investment not found",
            });
        }
        return res.status(200).json({
            statusCode: 200,
            investments,
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
 * /api/investments/buyStakes:
 *   post:
 *     summary: Buy stakes for an investor in a project
 *     tags: [Investments]
 *     parameters:
 *       - in: query
 *         name: investorAddress
 *         required: true
 *         description: Address of the investor
 *         schema:
 *           type: string
 *       - in: query
 *         name: projectID
 *         required: true
 *         description: ID of the project
 *         schema:
 *           type: string
 *       - in: query
 *         name: newInvestorAddress
 *         required: true
 *         description: Address of the new investor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stakes bought successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Something went wrong
 */
const buyStakes = async (req, res) => {
    try {
        const investments = await Investment.find({ investorAddress: req.query.investorAddress, projectID: req.query.projectID, saleStatus: true });
        if (!investments || investments.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Investment not found",
            });
        }
        for (const investment of investments) {
            investment.saleStatus = false;
            investment.investorAddress = req.query.newInvestorAddress;
            await investment.save();
        }
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

module.exports = {
    createInvestment,
    getInvestmentByProject,
    getInvestmentByAddress,
    getAllInvestment,
    buyStakes,
    getOnSaleInvestmentByProject,
    sellStakes
};
