




// const postToEnrolled = (req,res,psql) => {
//     const { classid, userid } = req.body;
//     psql('enrolled')
//         .returning('*')
//         .insert({ classid, userid })
//         .then(data => res.json(data[0]))
//         .catch(err => res.json(err))
// }





const postToEnrolled = (req,res,psql) => {
    const { classid, userid, sectionid, prereq } = req.body;
    if( prereq === null ) {
        psql.transaction(trx => {
            trx("enrolled")
            .select('*')
            .where({ userid, sectionid })
            .then(data => {
                if(!data[0]) {
                    trx("enrolled")
                     .returning("*")
                     .insert({ classid, userid, sectionid })
                     .then(response => res.json(response) )
                     .catch(err => res.json(err))
                }
                else {
                    res.json('class taken')
                }
            })
            .then(trx.commit)
            .catch(trx.rollback)
        } )
        .catch((err) => res.json(err))
    }
    else {
       psql("enrolled")
        .select("*")
        .where({ userid, sectionid })
        .then(async(data) => {
            if(!data[0]) {
                try {
                    const check = await psql("enrolled")
                                        .select("*")
                                        .where({ userid: userid, sectionid: prereq })
                    if(check[0]) {
                        psql("enrolled")
                            .returning("*")
                            .insert({ classid, userid, sectionid })
                            .then(info => res.json(info))
                            .catch(err => res.json(err))
                    }
                    else  {
                        res.json("Prereq Not Taken")
                    }
                }
                catch(err) {
                    return res.json(err)
                }
            }
            else {
                res.json("Class Taken")
            }
        })
        .catch(err => res.json(err))
    }
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

const deleteFromEnrolled = (req,res,psql) => {
    const { classid, userid } =  req.headers;
    psql("enrolled")
        .where({ classid, userid })
        .returning("*")
        .del()
        .then(data => res.json(data[0]))
        .catch(err => res.json(err))
}


module.exports = {
    postToEnrolled,
    getEnrolledClasses,
    deleteFromEnrolled
}