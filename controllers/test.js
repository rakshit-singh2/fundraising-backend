/**
 * @swagger
 * tags:
 *   name: Hello
 *   description: Hello World
 */

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Returns "Hello, World!"
 *     tags: [Hello]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
const test = async (req, res) => {
    res.send('Hello, World!');
};

module.exports = { test };
