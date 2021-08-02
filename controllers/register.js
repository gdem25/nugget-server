

const handleRegister = (req, res,psql) => {
    const { name, email, userid, image, major } = req.body;
    psql("students").returning("*").insert({ name, email, userid, image, major })
        .then((resp) => res.json(resp))
        .catch(err => res.json(err));
}


module.exports = {
    handleRegister
}