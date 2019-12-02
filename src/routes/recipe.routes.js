const recipe = require("express").Router();
const Recipe = require("../models/recipe.model");
const auth = require("../middlewares/auth.middleware");
const { check, validationResult } = require("express-validator");

recipe.get("/recipes", auth, async (req, res) => {
  try {
    const existingRecipes = await Recipe.findAll({
      where: {
        creator_id: req.user.id
      }
    });

    if (!existingRecipes)
      return res.status(200).json({
        status: true,
        existingRecipes: []
      });

    res.status(200).json({
      status: true,
      existingRecipes
    });
  } catch (excption) {
    console.log(excption);
    return res.status(400).send(excption);
  }
});

recipe.get("/recipe/:id", auth, async (req, res) => {
  try {
    const idMatchedRecipe = await Recipe.findOne({
      where: {
        id: req.params.id
      }
    });

    res.status(200).json({ status: true, recipe: idMatchedRecipe.dataValues });
  } catch (excption) {
    console.log(excption);
    res.status(400).send(excption);
  }
});

recipe.post(
  "/createRecipe",
  auth,
  [
    check("title").isLength({ min: 4 }),
    check("subTitle").isLength({ min: 4 }),
    check("description").isLength({ min: 4 }),
    check("mainImageURL").isURL(),
    check("ending").isLength({ min: 4 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const newRecipe = {
        ...req.body,
        creator_id: req.user.id
      };
      await Recipe.create(newRecipe).then(createdRecipe => {
        res.status(200).json({
          status: true,
          message: `New recipe sucessfully created`
        });
      });
    } catch (excption) {
      res.status(400).send(excption);
    }
  }
);

recipe.put(
  "/update-recipe/:id",
  auth,
  [
    check("title").isLength({ min: 4 }),
    check("subTitle").isLength({ min: 4 }),
    check("description").isLength({ min: 4 }),
    check("mainImageURL").isURL(),
    check("ending").isLength({ min: 4 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      await Recipe.update(
        { ...req.body },
        { where: { id: req.params.id } }
      ).then(data => {
        console.log(data);
        res.status(200).json({
          status: true,
          message: `Recipe Updated.`
        });
      });
    } catch (excption) {
      res.status(400).send(excption);
    }
  }
);

recipe.delete("/deleteRecipe/:id", auth, async (req, res) => {
  try {
    await Recipe.destroy({
      where: {
        creator_id: req.user.id,
        id: req.params.id
      }
    });

    const existingRecipes = await Recipe.findAll({
      where: {
        creator_id: req.user.id
      }
    });

    if (!existingRecipes)
      return res.status(200).json({
        status: true,
        existingRecipes: []
      });

    res.status(200).json({
      status: true,
      existingRecipes
    });
  } catch (excption) {
    res.status(400).send(excption);
    console.log(excption);
  }
});

module.exports = recipe;
