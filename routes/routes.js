const express = require('express');
require("dotenv").config();
const router = express.Router();


/************************************************  Testing  ************************************************/
const { test } = require('../controllers/test');
router.get("/test", test);


/************************************************  Project  ************************************************/
const { createProject, getProjectByName, getProjectByAddress, getAllProjects, getProjectById, assignTokenToProject, withdraw } = require('../controllers/project');
router.post("/projects/createProject", createProject);
router.get("/projects/getProjectByName/:name", getProjectByName);
router.get("/projects/getProjectByAddress/:address", getProjectByAddress);
router.get('/projects/getProjectById/:id', getProjectById);
router.get("/projects/getAllProjects", getAllProjects);
router.post('/projects/assignTokenToProject', assignTokenToProject);
router.post("/projects/withdraw/:projectID", withdraw);


/************************************************  Investment  ************************************************/
const { createInvestment, getInvestmentByProject, getInvestmentByAddress, getAllInvestment } = require('../controllers/investments');
router.post("/investments/createInvestment", createInvestment);
router.get("/investments/getInvestmentByProject/:ProjectId", getInvestmentByProject);
router.get("/investments/getInvestmentByAddress/:address", getInvestmentByAddress);
router.get("/investments/getAllInvestment", getAllInvestment);


/************************************************  Returns  ************************************************/
const { investorsClosedProject, investorsReturns } = require('../controllers/returns');
router.get("/returns/investorsClosedProject/:projectId", investorsClosedProject);
router.get("/returns/investorsReturns/:projectId", investorsClosedProject);


/************************************************  Router Export  ************************************************/
module.exports = router;