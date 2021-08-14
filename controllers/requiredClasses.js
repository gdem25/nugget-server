


const insertClassesToDB = (req, res, psql) => {
    const { name, section, sectionid, classid, teacher, rate, major, description, first, prereq  } = req.body;
    psql('requiredclasses')
        .returning('*')
        .insert({ name, section, sectionid, classid, teacher, rate, major, description, first, prereq })
        .then((classInfo) => { res.json(classInfo[0]) })
        .catch((err) => res.json(err));
}

const getAllClasses = (req,res,psql) => {
    psql
        .select('*')
        .from('requiredclasses')
        .then(classes => res.json(classes))
        .catch(err => res.json(err))
}

const getRequiredClasses = (req,res,psql) => {
    const { major } = req.headers
    psql('requiredclasses')
        .where({ major })
        .returning('*')
        .then(classes => res.json(classes))
        .catch(err => res.json(err))
}

module.exports = {
    insertClassesToDB,
    getAllClasses,
    getRequiredClasses
}