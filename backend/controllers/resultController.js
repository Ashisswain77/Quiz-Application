import Result from '../models/resultModel.js';

export async function createResult(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized, no token provided.'
            });
        }
        const { title, technology, level, totalQuestions, correct, wrong } = req.body;
        if(!technology || !level || totalQuestions === undefined || correct === undefined) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            })
        }
        const computedWrong = wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestions) - Number(correct));
        if(!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required.'
            })
        }
        const payload = {
            title: String(title).trim(),
            technology,
            level,
            totalQuestions: Number(totalQuestions),
            correct: Number(correct),
            wrong: computedWrong,
            user: req.user.id //for a specific user
        };

        const created = await Result.create(payload);
        return res.status(201).json({
            success: true,
            message: 'Result created successfully.',
            result: created
        });

    } catch (err) {
        console.error('Result Creation Error: ', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'});
    }
}

// List the Result
export async function listResults(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized, no token provided.'
            });
        }
        const {technology} = req.query;

        const query = {user: req.user.id};
        if(technology && technology.toLowerCase() !== 'all') {
            query.technology = technology;
        }

        const items = await Result.find(query).sort('-createdAt').lean();
        return res.status(200).json(
            {success: true, results: items}
        )
    } catch (err) {
        console.error('List Result Error: ', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'});
    }
}