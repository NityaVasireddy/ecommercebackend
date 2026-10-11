const express = require("express");
const router = express.Router();
let ideas = [
    {
        id: 1,
        idea: "ai",
        teamSize: 5,
        domain: "ai",
        selected: false
    },
    {
        id: 2,
        idea: "iot",
        teamSize: 3,
        domain: "iot",
        selected: false
    },
    {
        id: 3,
        idea: "ml",
        teamSize: 2,
        domain: "ml",
        selected: false
    }
];
router.get("",  (req, res) => {
    res.status(200).send(ideas);
});
router.get("/:id",  (req, res) => {

    const id = req.params.id;

    const idea =ideas.find((i) => i.id === Number(id));

    if (!idea) {
        return res.status(404).json({
            message: "Idea not found"
        });
    }

    res.status(200).json(idea);
});


router.post("",  (req, res) => {

    const { idea, teamSize, domain } = req.body;

    if (!idea) {
        return res.status(400).json({
            message: "Idea not found"
        });
    }

    if (!teamSize) {
        return res.status(400).json({
            message: "teamSize not found"
        });
    }

    const newIdea = {
        id:ideas.length+1,
        idea,
        teamSize,
        domain,
        selected:false
    }
    ideas.push(newIdea);

 

    console.log(newIdea);

    return res.status(201).json(newIdea);
});


router.put("/:id",  (req, res) => {

    const id = req.params.id;

    const idea =ideas.find((i) => i.id === Number(id));

    if (!idea) {
        return res.status(404).json({
            message: "Idea not found"
        });
    }

    idea.idea = req.body.idea ?? idea.idea;
    idea.teamSize = req.body.teamSize ?? idea.teamSize;
    idea.domain = req.body.domain ?? idea.domain;
    idea.selected = req.body.selected ?? idea.selected;

    res.status(200).json(idea);
});


router.delete("/:id", (req, res) => {

    const id = req.params.id;

    idea = ideas.filter((i) => i.id !=Number(id)) ;
 

    res.status(200).json({
        message: "Idea deleted successfully"
    })
})


module.exports = router;