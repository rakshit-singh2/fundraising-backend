const Project = require("../models/project");

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
 *               totalAmount:
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
        const existingProject = await Project.findOne({
            $or: [{ name: req.body.name }, { recieverAddress: req.body.recieverAddress }],
        });

        if (existingProject) {
            if (existingProject.name == req.body.name ) {
                return res.status(409).json({
                    statusCode: 409,
                    responseMessage: "Project already exists",
                });
            }
        }

        const newProject = new Project({
            name: req.body.name,
            totalAmount: req.body.totalAmount,
            tokenSupply: req.body.tokenSupply,
            minimumBuy: req.body.minimumBuy,
            maximumBuy: req.body.maximumBuy,
            vesting: req.body.vesting,
            recieverAddress: req.body.recieverAddress
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
module.exports = {
    createProject,
    getProjectByName,
    getProjectByAddress,
    getAllProjects
};