


const postToTranscript = (req,res,psql) => {
    const { classid, userid, gpa, grade, term, units, sectionid } = req.body;
    psql('transcript')
        .returning('*')
        .insert({ classid, userid, gpa, grade, term, units, sectionid })
        .then(data => res.json(data[0]))
        .catch(err => res.json(err))
}

const getSemesterTranscript = (req,res,psql) => {
    const { userid, term } = req.headers
    psql.select('*')
        .from('transcript')
        .where({ userid, term })
        .returning('*')
        .then(data => res.json(data) )
        .catch(err => res.json(err) )
}

const getStudentTranscript = (req,res,psql) => {
    const { userid } = req.headers;
    psql.select('*')
        .from('transcript')
        .where({ userid })
        .returning('*')
        .then(data => res.json(data))
        .catch(err => res.json(err))
}

const getRequiredAdmin = (req,res,psql) => {
    const { userid } = req.headers;
    psql
        .select('classid', 'sectionid')
        .from('enrolled')
        .where({ userid })
        .then(data => res.json(data))
        .catch(err => res.json(err))
}


module.exports = {
    postToTranscript,
    getStudentTranscript,
    getRequiredAdmin,
    getSemesterTranscript
}