

const handleSignIn = (req, res,psql) => {
    const { name, email, userid, image } = req.body;
    psql
        .transaction((trx) => {
            trx
                .select("*")
                .from("students")
                .where({ userid })
                .then((e) => {
                    if (e[0]) {
                        res.json(e[0]);
                    } else {
                        return trx("students")
                            .returning("*")
                            .insert({ name, email, userid, image })
                            .then((user) => res.json(user[0]));
                    }
                })
                .then(trx.commit)
                .catch(trx.rollback);
        })
        .catch((err) => res.json(err));
}

const updateStudentMajor = (req,res,psql) => {
    const { userid, major } = req.body;
    psql
        .select("major")
        .from("students")
        .where({ userid })
        .update({ major })
        .returning('major')
        .then(major => res.json(major[0]) )
        .catch(err => res.json(err));
};


module.exports = {
    handleSignIn,
    updateStudentMajor
}