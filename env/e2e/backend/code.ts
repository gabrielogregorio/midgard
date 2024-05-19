/**
 * @swagger
 * /example/endpoint/:
 *  post:
 *    tags: [tag1, tag2]
 *    summary: summary-example
 *    description: |
 *      description-example
 *    requestBody:
 *      x-name: body
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - message
 *            properties:
 *              message:
 *                type: string
 *                example: "hello world"
 *    responses:
 *      200:
 *        description: Ok
 *        content:
 *          application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 */
const anyCodeHere = '';
