const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
//const ipfsAPI = require("ipfs-api");
Tesseract = require("tesseract.js");
const Contract = require("../../Contract");
const Provider = require("../../Provider");
const contract = new Contract();
const provider = new Provider();
const web3 = provider.web3;
const instance = contract.initContract();

// const ipfsClient = require('ipfs-http-client')

//const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

// const ipfsClient = require('ipfs-http-client')
// const ipfs = ipfsClient()


// const IPFS = require('ipfs-mini');
// const ipfs = new IPFS();

const { NFTStorage, File, Blob } = require('nft.storage')

const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDExZjMxRTEzMjcxNjFGQzE3MWZDZkNFMDY4MTU3QThiODk4QzUzZDUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MDY1MjA0NDQ5NCwibmFtZSI6IkZpbmFsWWVhclByb2plY3QifQ.u-m8wScjOb4gLxXPWlXmYqarXozpJxyHVv3lk1i9dyI'
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.email + "-rc-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/uploadrc", upload.single("image"), async (req, res, next) => {
  console.log(path.resolve("./" + req.file.path));
  fs.rename(
    "./uploads/" + req.file.filename,
    "./uploads/" + req.body.email + "-rc.png",
    () => {
      console.log("renamed");
    }
  );
  
  t=[]
  a=[]
  j={}
  Tesseract.recognize(
    "./uploads/" + req.body.email + "-rc.png",
    'eng',
    //{ logger: m => console.log(m) }
  ).then(async ({ data: { text } }) => {
    t=text.split('\n')
    for (let i = 0; i < t.length; i++) {
        s=t[i].split('-')
        
        if(s[0]!=''){
        a.push(s)
        }
    }
    for(let i=0;i<a.length;i++){
        
      a[i][0] = a[i][0].replace(" ", "_");
      j[(a[i][0])]=a[i][1]

        
    }
    console.log(j)
      const testFile = fs.readFileSync(
        "./uploads/" + req.body.email + "-rc.png"
      );
      
      const imageFile = new File([testFile], 'rc.png', { type: 'image/png' })
      const metadata = await client.store({
      name: 'My sweet NFT',
      description: 'Just try to funge it. You can\'t do it.',
      image: imageFile
    })  

    try {
      const accounts = await web3.eth.getAccounts();
      //console.log(accounts[0]);
      await instance.methods
        .add_rc(
          metadata.ipnft,
          '1S',
          j.Validity,
          j.registration_date,
          j.chasis_number,
          j.engine_no,
          j.model,
          j.seat
        )
        .send({ from: accounts[0], gas: 300000 });
      const response = await instance.methods.getId().call();
      console.log(response);
      const result1 = await instance.methods
        .get_rc_details(response)
        .call();
      //console.log(result1);
      return res.status(200).json(result1);
    } catch (err) {
      console.log(err);
    }
  
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err });
    });
  //res.status(200).json({ message: "file uploaded" });
});

router.post("/uploadpuc", upload.single("image"), (req, res, next) => {
  console.log(path.resolve("./" + req.file.path));
  fs.rename(
    "./uploads/" + req.file.filename,
    "./uploads/" + req.body.email + "-puc.png",
    () => {
      console.log("renamed");
    }
  );
  t = [];
  a = [];
  j = {};
  Tesseract.recognize("./uploads/" + req.body.email + "-puc.png", "eng", {
    logger: (m) => console.log(m),
  })
    .then(async ({ data: { text } }) => {
      t = text.split("\n");
      for (let i = 0; i < t.length; i++) {
        s = t[i].split("-");

        if (s[0] != "") {
          a.push(s);
        }
      }
      for (let i = 0; i < a.length; i++) {
        a[i][0] = a[i][0].replace(" ", "_");
        j[a[i][0]] = a[i][1];
      }
      console.log(j);
      const testFile = fs.readFileSync(
        "./uploads/" + req.body.email + "-puc.png"
      );
      
      const imageFile = new File([testFile], 'rc.png', { type: 'image/png' })
      const metadata = await client.store({
        name: 'My sweet NFT',
        description: 'Just try to funge it. You can\'t do it.',
        image: imageFile
      })    

      try {
        const accounts = await web3.eth.getAccounts();
        await instance.methods
          .add_puc(metadata.ipnft,'1', j.Validity)
          .send({ from: accounts[0], gas: 300000 });
        const response = await instance.methods.getId().call();
        console.log(response);
        const result1 = await instance.methods
          .get_puc_details(response)
          .call();
        console.log(result1);
        res.status(200).json(result1)
      } catch (err) {
        console.log(err);
      }

      // return res.status(200).json({ "puc-details": j });
    })
    .catch((err) => {
      console.log(err);
      res.status(200).json(err);
      // return res.status(500).json({ error: err });
    });
});

router.post("/uploadinsurance", upload.single("image"), (req, res, next) => {
  console.log(path.resolve("./" + req.file.path));
  fs.rename(
    "./uploads/" + req.file.filename,
    "./uploads/" + req.body.email + "-insurance.png",
    () => {
      console.log("renamed");
    }
  );
  t = [];
  a = [];
  j = {};
  Tesseract.recognize("./uploads/" + req.body.email + "-insurance.png", "eng", {
    //logger: (m) => console.log(m),
  })
    .then(async ({ data: { text } }) => {
      t = text.split("\n");
      for (let i = 0; i < t.length; i++) {
        s = t[i].split("-");

        if (s[0] != "") {
          a.push(s);
        }
      }
      for (let i = 0; i < a.length; i++) {
        a[i][0] = a[i][0].replace(" ", "_");
        j[a[i][0]] = a[i][1];
      }
      console.log(j);
      const testFile = fs.readFileSync(
        "./uploads/" + req.body.email + "-insurance.png"
      );
      
      const imageFile = new File([testFile], 'rc.png', { type: 'image/png' })
      const metadata = await client.store({
        name: 'My sweet NFT',
        description: 'Just try to funge it. You can\'t do it.',
        image: imageFile
      })    


      try {
        const accounts = await web3.eth.getAccounts();
        await instance.methods
          .add_insurance(metadata.ipnft, '1', j.Validity)
          .send({ from: accounts[0], gas: 300000 });
        const response = await instance.methods.getId().call();
        console.log(response);
        const result1 = await instance.methods
          .get_insurance_details(response)
          .call();
        res.status(200).json(result1)
      } catch (err) {
        console.log(err);
      }

    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err });
    });
  // res.status(200).json({ message: "file uploaded" });
});


// router.get('/testupload',async (req, res) => {
//   let testFiles = fs.readFileSync(__dirname+'/rc.png')
//   // ipfs.add(testFiles, function(err,file) {
//   //   if(err) console.log(err)
//   //   else console.log(file)
//   // })
//   // console.log(file)

//   // const file = fs.readFileSync(__dirname+'/rc.png')
//   // ipfs.add(file,async(err,res)=> {
//   //   if(err) console.log(err)
//   //   console.log(res)
//   // })

//   // ipfs.add('Hello', (err, hash) => {
//   //   if(err) console.log(err)
//   //   else console.log(hash)
//   // })

//   const imageFile = new File([testFiles], 'rc.png', { type: 'image/png' })
//   const metadata = await client.store({
//   name: 'My sweet NFT',
//   description: 'Just try to funge it. You can\'t do it.',
//   image: imageFile
// })
// console.log(metadata)

// })

module.exports = router;