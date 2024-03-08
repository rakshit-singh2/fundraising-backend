const Project = require("../models/project");
const { ethers } = require("ethers");

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API endpoints for managing projects
 */

/**
 * @swagger
 * /api/projects/createProject:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               targetAmount:
 *                 type: number
 *               tokenSupply:
 *                 type: number
 *               minimumBuy:
 *                 type: number
 *               maximumBuy:
 *                 type: number
 *               vesting:
 *                 type: string
 *               recieverAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project listed successfully
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
 *                   example: Project Listed Successfully
 *       404:
 *         description: Invalid address
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
 *                   example: Invalid Address
 *       409:
 *         description: Project already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 409
 *                 responseMessage:
 *                   type: string
 *                   example: Project already exists
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
const createProject = async (req, res) => {
    try {
        if (!req.body.recieverAddress || req.body.recieverAddress.length != 42) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Invalid Address",
            });
        }
        const existingProject = await Project.find({
            $and: [{ name: req.body.name }, { recieverAddress: req.body.recieverAddress }],
        });
        console.log(existingProject)
        if (existingProject) {
            return res.status(409).json({
                statusCode: 409,
                responseMessage: "Project already exists",
            });
        }
        const wallet = ethers.Wallet.createRandom();
        const newProject = new Project({
            name: req.body.name,
            targetAmount: req.body.targetAmount,
            tokenSupply: req.body.tokenSupply,
            minimumBuy: req.body.minimumBuy,
            maximumBuy: req.body.maximumBuy,
            vesting: req.body.vesting,
            recieverAddress: req.body.recieverAddress,
            publicKey: wallet.address,
            privateKey: wallet.privateKey
        });
        await newProject.save();
      
        return res.status(200).json({
            statusCode: 200,
            responseMessage: "Project Listed Successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 505,
            responseMessage: "Something went wrong",
            error: error,
        });
    }
};


/**
 * @swagger
 * /api/projects/getProjectByName/{name}:
 *   get:
 *     summary: Get a project by name
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Name of the project
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project found
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
 */
const getProjectByName = async (req, res) => {
    try {
        const projectName = req.params.name;
        const project = await Project.findOne({ name: projectName });
        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Project not found",
            });
        }
        return res.status(200).json({
            statusCode: 200,
            project: project,
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
 * /api/projects/getProjectByAddress/{address}:
 *   get:
 *     summary: Get a project by address
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         description: Ethereum address of the project
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project found
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
 */
const getProjectByAddress = async (req, res) => {
    try {
        const projectAddress = req.params.address;
        const project = await Project.findOne({ recieverAddress: projectAddress });
        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Project not found",
            });
        }
        return res.status(200).json({
            statusCode: 200,
            project: project,
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
 * /api/projects/getProjectById/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Project ID
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '404':
 *         description: Project not found
 *       '500':
 *         description: Internal server error
 */
const getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id; // Assuming the route parameter is named "id"
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Project not found",
            });
        }
        return res.status(200).json({
            statusCode: 200,
            project: project,
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
 * /api/projects/getAllProjects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
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
 *                 projects:
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
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        return res.status(200).json({
            statusCode: 200,
            projects: projects,
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
 * /api/projects/assignTokenToProject:
 *   post:
 *     summary: Assign token to a project
 *     tags: 
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectID:
 *                 type: string
 *                 description: The ID of the project.
 *               tokenAddress:
 *                 type: string
 *                 description: The address of the token to assign.
 *     responses:
 *       '200':
 *         description: Successful operation
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
 *                   example: Success
 *       '404':
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
 *                   example: Project doesn't exist
 *       '500':
 *         description: Internal server error
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
 */
const assignTokenToProject = async (req, res) => {
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

        existingProject.tokenAddress = req.body.tokenAddress;
        await existingProject.save();
        return res.status(200).json({
            statusCode: 200,
            projects: existingProject,
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
 * /api/projects/withdraw/{projectID}:
 *   post:
 *     summary: Withdraw funds from a project
 *     tags: 
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: projectID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project.
 *     responses:
 *       '200':
 *         description: Successful operation
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
 *                   example: Success
 *       '404':
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
 *                   example: Project doesn't exist
 *       '500':
 *         description: Internal server error
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
 */
const withdraw = async (req, res) => {
    try{
        const existingProject = await Project.findOne({
            _id: req.params.projectID,
            status: 'OPEN'
        });

        if (!existingProject) {
            return res.status(404).json({
                statusCode: 404,
                responseMessage: "Project doesn't exist",
            });
        }

        existingProject.totalRaised = 0;
        await existingProject.save();
        return res.status(200).json({
            statusCode: 200,
            projects: existingProject,
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
    createProject,
    getProjectByName,
    getProjectByAddress,
    getAllProjects,
    getProjectById,
    assignTokenToProject,
    withdraw,
};