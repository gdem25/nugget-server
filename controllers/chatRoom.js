

const getChatRooms = ( req,res,psql ) => {
    const { major } = req.headers
    psql
        .select("sectionid")
        .from("requiredclasses")
        .where({ major })
        .then(data => res.json(data) )
        .catch(err => res.json(err))
}



const postComment = ( req,res,psql ) => {
      const { name, userid, image, sectionid, comment  } = req.body;
  psql("chatcomments")
    .returning("*")
    .insert({ name, userid, image, sectionid, comment })
    .then((resp) => res.json(resp[0]))
    .catch((err) => res.json(err));
}

const getComments = ( req, res, psql ) => {
    const { sectionid } = req.headers;
    psql
      .select("*")
      .from("chatcomments")
      .where({ sectionid })
      .then((resp) => res.json(resp))
      .catch((err) => res.json(err));
}


module.exports = {
    getChatRooms,
    postComment,
    getComments
}

