




// const postToEnrolled = (req,res,psql) => {
//     const { classid, userid } = req.body;
//     psql('enrolled')
//         .returning('*')
//         .insert({ classid, userid })
//         .then(data => res.json(data[0]))
//         .catch(err => res.json(err))
// }





const postToEnrolled = (req,res,psql) => {
    const { classid, userid, sectionid, prereq, term } = req.body;
    if( prereq === null ) {
        psql.transaction(trx => {
            trx("enrolled")
            .select('*')
            .where({ userid, sectionid })
            .then(data => {
                if(!data[0]) {
                    trx("enrolled")
                     .returning("*")
                     .insert({ classid, userid, sectionid, term })
                     .then(response => res.json(response[0]) )
                     .catch(err => res.json(err))
                }
                else {
                    res.json({ error: 'class taken', classid: classid })
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
                            .insert({ classid, userid, sectionid, term })
                            .then(info => res.json(info[0]))
                            .catch(err => res.json(err))
                    }
                    else  {
                        res.json({ error: "Prereq Not Taken", classid: classid })
                    }
                }
                catch(err) {
                    return res.json(err)
                }
            }
            else {
                res.json({ error: 'class taken', classid: classid })
            }
        })
        .catch(err => res.json(err))
    }
}



const getEnrolledClasses = (req,res,psql) => {
    const { userid } = req.headers;
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


const swapClasses = (req,res,psql) => {
    const { classid, userid, sectionid, term } = req.body
    psql
        .select("*")
        .from("enrolled")
        .where({ userid, sectionid })
        .update({ classid, term })
        .returning("*")
        .then(data => {
            if(data[0]) {
                res.json({ classid: data[0].classid })
            }
            else {
                res.json({ error: "Class not Found: Cant Swap This Class", classid: classid })
            }
        })
        

}


module.exports = {
    postToEnrolled,
    getEnrolledClasses,
    deleteFromEnrolled,
    swapClasses
}