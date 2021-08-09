


const postToTranscript = (req,res,psql) => {
    const { classid, userid, gpa, grade } = req.body;
    psql('transcript')
        .returning('*')
        .insert({ classid, userid, gpa, grade })
        .then(data => res.json(data[0]))
        .catch(err => res.json(err))
}

const getStudentTranscript = (req,res,psql) => {
    const { userid } = req.body;
    psql.select('*')
        .from('transcript')
        .where({ userid })
        .returning('*')
        .join('requiredclasses','transcript.classid','requiredclasses.classid')
        .then(data => res.json(data))
        .catch(err => res.json(err))
}


module.exports = {
    postToTranscript,
    getStudentTranscript
}