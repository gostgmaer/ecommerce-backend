const express = require('express');
const router = express.Router();

const {
  addAttribute,
  addAllAttributes,
  getAllAttributes,
  getShowingAttributes,
  getAttributeById,
  updateAttributes,
  updateStatus,
  deleteAttribute,
  getShowingAttributesTest,
  updateChildStatus,
  deleteChildAttribute,
  addChildAttributes,
  updateChildAttributes,
  getChildAttributeById,
  updateManyAttribute,
  deleteManyAttribute,
  updateManyChildAttribute,
  deleteManyChildAttribute,
} = require('../controller/attributeController');

//add attribute
router.post('/attributes/add', addAttribute);

//add all attributes
router.post('/attributes/add/all', addAllAttributes);

// add child attribute
router.put('/attributes/add/child/:id', addChildAttributes);

//get all attribute
router.get('/attributes', getAllAttributes);

// router.get('/show', getShowingProducts);
router.get('/attributes/show', getShowingAttributes);

router.put('/attributes/show/test', getShowingAttributesTest);

// update many attributes
router.patch('/attributes/update/many', updateManyAttribute);

//get attribute by id
router.get('/attributes/:id', getAttributeById);

// child get attributes by id
router.get('/attributes/child/:id/:ids', getChildAttributeById);

//update attribute
router.put('/attributes/:id', updateAttributes);

// update child attribute
router.patch('/attributes/update/child/many', updateManyChildAttribute);

// update child attribute
router.put('/attributes/update/child/:attributeId/:childId', updateChildAttributes);

//show/hide a attribute
router.put('/attributes/status/:id', updateStatus);

// show and hide a child status
router.put('/attributes/status/child/:id', updateChildStatus);

//delete attribute
router.delete('/attributes/:id', deleteAttribute);

// delete child attribute
router.put('/attributes/delete/child/:attributeId/:childId', deleteChildAttribute);

// delete many attribute
router.patch('/attributes/delete/many', deleteManyAttribute);

// delete many child attribute
router.patch('/attributes/delete/child/many', deleteManyChildAttribute);

module.exports = router;
