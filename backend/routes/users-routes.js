const express = require('express');
const router = express.Router();

const DUMMY_USERS = [
  {
      id: "u1",
      name: 'Shawn Chiao',
      image: 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairDreads02&accessoriesType=Kurt&hairColor=Blonde&facialHairType=BeardLight&facialHairColor=BlondeGolden&clotheType=BlazerSweater&eyeType=Happy&eyebrowType=AngryNatural&mouthType=Eating&skinColor=Tanned',
      places: 3

  }        
]

router.get('/:uid', (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_USERS.find(u => {
    return u.id === userId;
  });
  res.json({user});
});


module.exports = router;