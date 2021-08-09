




const postToEnrolled = (req,res,psql) => {
    const { classid, userid } = req.body;
    psql('enrolled')
        .returning('*')
        .insert({ classid, userid })
        .then(data => res.json(data[0]))
        .catch(err => res.json(err))
}

const getEnrolledClasses = (req,res,psql) => {
    const { userid } = req.body;
    psql.select('*')
        .from('enrolled')
        .where({ userid })
        .returning('*')
        .join('requiredclasses','enrolled.classid','requiredclasses.classid')
        .then(data => res.json(data))
        .catch(err => res.json(err))
}


module.exports = {
    postToEnrolled,
    getEnrolledClasses
}